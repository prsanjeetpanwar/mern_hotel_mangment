import express from 'express'
const router = express.Router()
import Room from '../models/Rooms.js'
import Hotel from '../models/Hotels.js'
import { createError } from '../utils/Err.js'
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js'


router.post('/:hotelid', verifyAdmin, async(req, res, next) => {
    const hotelId = req.params.hotelid;
    const newRoom = new Room(req.body);

    try {
        const savedRoom = await newRoom.save();
        try {
            await Hotel.findByIdAndUpdate(hotelId, {
                $push: { rooms: savedRoom._id },
            });
        } catch (err) {
            next(err);
        }
        res.status(200).json(savedRoom);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', verifyAdmin, async(req, res, next) => {
    try {
        const updatedRoom = await Room.findByIdAndUpdate(
            req.params.id, { $set: req.body }, { new: true }
        );
        res.status(200).json(updatedRoom);
    } catch (err) {
        next(err);
    }
});
router.delete('/:id/:hotelid', verifyAdmin, async(req, res, next) => {
    const hotelId = req.params.hotelid;
    try {
        await Room.findByIdAndDelete(req.params.id);
        try {
            await Hotel.findByIdAndUpdate(hotelId, {
                $pull: { rooms: req.params.id },
            });
        } catch (err) {
            next(err);
        }
        res.status(200).json("Room has been deleted.");
    } catch (err) {
        next(err);
    }



})


router.get('/:id', async(req, res, next) => {


    try {
        const getRoom = await Room.findById(req.params.id)
        res.status(201).json(getRoom)
    } catch (err) {
        next(err)
    }
})

router.get('/', async(req, res, next) => {



    try {

        const getAllRoom = await Room.find()
        res.status(200).json(getAllRoom)


    } catch (err) {



        next(err)
    }
})


export default router