import  express from 'express'
import {protect, admin} from "../middlewares/auth.js"

const router = express.Router()

// get all events
router.get("/",getAllEvents);

//get Event by Id
router.get("/:id",getEventsById);

//Update Events(admin only)
router.post("/",protect,admin, createEvent);

//Delete Events(admin only)
router.put("/:id",protect,admin, updateEvent);

//Delete Events(admin only)
router.put("/:id",protect,admin, deleteEvent);

export {router}