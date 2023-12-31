import express from 'express'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import { createError } from '../utils/Err.js'
import jwt from 'jsonwebtoken'
const router = express.Router()



router.post('/register', async(req, res, next) => {

    try {

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(req.body.password, salt)
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash

        })
        await newUser.save()
        res.status(201).send({ msg: "User has been created" })
    } catch (err) {

        next(err)
    }
})



router.post('/login', async(req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return next(createError(404, "Not a valid user"));
        }

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) {
            return next(createError(400, "Wrong password or username"));
        }

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, "prsanshi")

        const { password, isAdmin, ...otherDetails } = user._doc
        res.cookie('prsanshi', token, {
            httpOnly: true
        }).status(200).json(otherDetails);
    } catch (err) {
        next(err);
    }
});

export default router