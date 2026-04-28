import {Event} from "../models/Event.js"

export const getAllEvents =async (req,res)=>{
    try {
        const filters = {};
        if(req.query.category){
            filters.category = req.query.category;
        }

        if(req.query.ticketPrice){
            filters.ticketPrice = req.query.ticketPrice;
        }

        const events = await Event.find(filters);
        res.json(events)
    } catch (error) {
        res.status(500).json({msg:"server ERROR!"})
    }
}

export const getEventsById = async (req,res)=>{
    try {
        const event = await Event.findById(req.params.id);

        if(!event){
           return res.status(404).json({msg:"event not found!"})
        }
        res.json(event)
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}

export const createEvent = async (req,res)=>{
     try {
        const {title,description,date,location,category,totalSeats,availableSeats,ticketPrice,imageUrl} = req.body;

        const event = await Event.create({
            title,description,
            date,location,
            category,
            totalSeats,
            availableSeats,
            ticketPrice,
            imageUrl
        })
        res.status(201).json(event)

     } catch (error) {
        res.status(500).json({error: error.message})
     }
}

export const updateEvent = async (req,res)=>{
    try {
         const {title,description,date,location,category,totalSeats,availableSeats,ticketPrice,imageUrl} = req.body;

        const event = await Event.findByIdAndUpdate(req.params.id, {
            title,description,
            date,location,
            category,
            totalSeats,
            availableSeats,
            ticketPrice,
            imageUrl
        },{new:true})

        if(!event){
            return res.status(404).json({error:"Event not found"});
        }
        res.status(200).json(event)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

export const deleteEvent = async(req,res)=>{
    try {
        const event = await Event.findByIdAndDelete(req.params.id)

        if(!event){
            return res.status(404).json({error:"Event Not Found"})
        }

        res.status(200).json({msg:"Event Deleted Successfully"})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

