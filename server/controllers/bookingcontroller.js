import { Event } from "../models/Event.js";
import {Booking} from "../models/Booking.js"
import { OTP } from "../models/OTP.js";
import { sendBookingEmail, sendOTPEmail } from "../utils/email.js";


const generateOTP = ()=>{
    return Math.floor(100000 + Math.random() * 900000).toString()
}

export const sendBookingOTP = async(req,res)=>{
    try {
        const otp = generateOTP()

        await OTP.findOneAndDelete({email: req.user.email, action:"event_booking"})
        await OTP.create({email:req.user.email, otp:otp, action:"event_booking"})
        await sendOTPEmail(req.user.email, otp,"event_booking");

        res.json({message: "OTP send to email"});
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });    }
}

export const bookEvent = async(req,res)=>{
    try {
        const {eventId, otp} = req.body;

        const otpRecord = await OTP.findOne({email: req.user.email, action:"event_booking"})

        if (!otpRecord || otpRecord.otp !== otp) {
             return res.status(400).json({ msg: "Invalid or expired OTP!" });
        }

        const event = await Event.findById(eventId);
        if(!event){
             return res.status(400).json({msg:"Event Not Found!"})
        }

        if(event.availableSeats <= 0){
             return res.status(400).json({msg:"No seats Available!"})
        }
    
        const existingBooking = await Booking.findOne({userId:req.user._id, eventId})
        if(existingBooking){
             return res.status(400).json({msg:"You have already booked this event!"})
        }
         
        const booking = await Booking.create({
            userId: req.user._id,
            eventId,
            status:'pending',
            paymentStatus:'non-paid',
            amount:event.ticketPrice
        });

        await OTP.deleteOne({_id: otpRecord._id});
        res.status(201).json({msg:"Booking created, Please check your email for verification"})

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

export const confirmBooking = async (req, res) => {
    try {
        const paymentStatus = req.body.paymentStatus;

        // Validate payment status
        if (!['paid', 'non-paid'].includes(paymentStatus)) {
            return res.status(400).json({ msg: "Invalid payment state!" });
        }

        // Find booking
        const booking = await Booking.findById(req.params.id).populate('eventId');
        if (!booking) {
            return res.status(404).json({ msg: "Booking not Found!" });
        }

        // Already confirmed check
        if (booking.status === 'confirmed') {
            return res.status(400).json({ message: 'Booking is already confirmed' });
        }

        // Update booking first
        booking.status = 'confirmed';
        booking.paymentStatus = paymentStatus || booking.paymentStatus;
        await booking.save();

        // Safely decrease seat (atomic update)
        const updatedEvent = await Event.findOneAndUpdate(
            { _id: booking.eventId._id, availableSeats: { $gt: 0 } },
            { $inc: { availableSeats: -1 } },
            { new: true }
        );

        // If no seat available (race condition safe)
        if (!updatedEvent) {
            return res.status(400).json({ msg: "No seats Available!" });
        }

        // Populate user for email
        await booking.populate('userId');

        // Send confirmation email
        await sendBookingEmail(
            booking.userId.email,
            booking.userId.name,
            booking.eventId.title
        );

        return res.status(200).json({
            message: 'Booking confirmed successfully',
            booking
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};

export const getMyBooking =async (req,res)=>{
      try {
        const bookings = req.user.role === 'admin'
            ? await Booking.find().populate('eventId').populate('userId', 'name email').sort({ createdAt: -1 })
            : await Booking.find({ userId: req.user._id }).populate('eventId').sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export const cancelBooking= async(req,res)=>{
  try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (booking.userId.toString() !== req.user._id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        if (booking.status === 'cancelled') return res.status(400).json({ message: 'Already cancelled' });

        const wasConfirmed = booking.status === 'confirmed';

        booking.status = 'cancelled';
        await booking.save();

        // Only restore the seat if it was actually confirmed and deducted
        if (wasConfirmed) {
            const event = await Event.findById(booking.eventId);
            if (event) {
                event.availableSeats += 1;
                await event.save();
            }
        }

        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};