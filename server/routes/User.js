import express from 'express';
import User from '../models/User.js';
import { createError } from '../utils/Err.js';
import {
    verifyAdmin,
    verifyToken,
    verifyUser
} from '../utils/verifyToken.js';

const router = express.Router();

router.post('/', async(req, res) => {
    const newUser = new User(req.body);

    try {
        const user = await newUser.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.put('/:id', verifyUser, async(req, res, next) => {
    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updateUser);
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', verifyUser, async(req, res, next) => {
    try {
        const deleteUser = await User.findByIdAndDelete(req.params.id);
        res.status(200).json(deleteUser);
    } catch (err) {
        next(err)
    }
});

router.get('/:id', verifyUser, async(req, res, next) => {
    try {
        const getUser = await User.findById(req.params.id);
        res.status(200).json(getUser);
    } catch (err) {
        next(err)
    }
});

router.get('/', verifyAdmin, async(req, res, next) => {
    try {
        const allUsers = await User.find();
        res.status(200).json(allUsers);
    } catch (err) {
        next(err)
    }
});



export default router;