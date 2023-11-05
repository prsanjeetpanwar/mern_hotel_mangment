import express from 'express';
import Hotel from '../models/Hotels.js';
import { createError } from '../utils/Err.js';
import { verifyAdmin } from '../utils/verifyToken.js';

const router = express.Router();

router.post('/', verifyAdmin, async(req, res) => {
    const newHotel = new Hotel(req.body);

    try {
        const hotel = await newHotel.save();
        res.status(200).json(hotel);
    } catch (err) {
        res.status(500).json(err);
    }
});


router.put('/:id', verifyAdmin, async(req, res) => {
    try {
        const updateHotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updateHotel);
    } catch (err) {
        res.status(500).json(err);
    }
});
router.delete('/:id', verifyAdmin, async(req, res) => {
    try {
        const deleteHotel = await Hotel.findByIdAndDelete(req.params.id)
        res.status(200).json(deleteHotel)

    } catch (err) {
        res.status(500).json(err)
    }
})


router.get('/:id', async(req, res) => {


    try {
        const getHotel = await Hotel.findById(req.params.id)
        res.status(201).json(getHotel)
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get('/', async(req, res) => {



    try {

        const getallHotels = await Hotel.find()
        res.status(200).json(getallHotels)


    } catch (err) {



        req.status(600).json(err)
    }
})

router.get('/find/countByCity', async(req, res, next) => {
    const citites = req.query.cities.split(",")
    try {

        const list = await Promise.all(citites.map(city => {
            return Hotel.countDocuments({ city: city })
        }))
        res.status(200).json(list)
    } catch (err) {
        next(err)
    }

})


router.get('/find/countByType', async(req, res, next) => {
    try {
        const hotelCount = await Hotel.countDocuments({ type: "hotel"});
        const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
        const resortCount = await Hotel.countDocuments({ type: "resort" });
        const villaCount = await Hotel.countDocuments({ type: "villa" });
        const cabinCount = await Hotel.countDocuments({ type: "cabin" });
    
        res.status(200).json([
          { type: "hotel", count: hotelCount },
          { type: "apartments", count: apartmentCount },
          { type: "resorts", count: resortCount },
          { type: "villas", count: villaCount },
          { type: "cabins", count: cabinCount },
        ]);
      } catch (err) {
        next(err);
      }
})
















export default router;