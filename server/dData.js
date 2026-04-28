import mongoose from 'mongoose';
import dotenv from "dotenv"
import bcrypt from "bcryptjs"
import { User } from './models/User.js';
import { Event } from './models/Event.js';
import { Booking } from './models/Booking.js';


dotenv.config();

const users = [
    { name: 'Admin User', email: 'admin@bookifyr.com', password: 'password123', role: 'admin' },
    { name: 'Demo User', email: 'user@bookifyr.com', password: 'password123', role: 'user' },
    { name: 'Ali Khan', email: 'ali@bookifyr.com', password: 'password123', role: 'user' },
    { name: 'Sara Ahmed', email: 'sara@bookifyr.com', password: 'password123', role: 'user' },
    { name: 'Usman Tariq', email: 'usman@bookifyr.com', password: 'password123', role: 'user' },
    { name: 'Ayesha Malik', email: 'ayesha@bookifyr.com', password: 'password123', role: 'user' },
    { name: 'Hassan Raza', email: 'hassan@bookifyr.com', password: 'password123', role: 'user' },
    { name: 'Zara Noor', email: 'zara@bookifyr.com', password: 'password123', role: 'user' },
    { name: 'Omar Farooq', email: 'omar@bookifyr.com', password: 'password123', role: 'user' },
    { name: 'Noor Fatima', email: 'noor@bookifyr.com', password: 'password123', role: 'user' }
];

const events = [
    {
        title: 'Full-Stack Web Development Bootcamp',
        description: 'A hands-on bootcamp covering MERN stack development with real-world project building experience.',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        location: 'Tech Hub, Karachi',
        category: 'Technology',
        totalSeats: 200,
        ticketPrice: 0,
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Electro Beats Music Festival',
        description: 'A high-energy music festival featuring top DJs, EDM vibes, and an unforgettable night experience.',
        date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        location: 'Expo Center, Lahore',
        category: 'Music',
        totalSeats: 500,
        ticketPrice: 1500,
        imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Global Business Leadership Summit',
        description: 'An exclusive summit for entrepreneurs, CEOs, and investors to explore future business trends.',
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        location: 'Pearl Continental, Islamabad',
        category: 'Business',
        totalSeats: 150,
        ticketPrice: 5000,
        imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Contemporary Art Exhibition',
        description: 'A curated exhibition showcasing modern art pieces from emerging and professional artists.',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        location: 'National Art Gallery',
        category: 'Art',
        totalSeats: 300,
        ticketPrice: 200,
        imageUrl: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Startup Pitch Challenge 2026',
        description: 'A competitive startup pitching event where innovators present ideas to investors for funding.',
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        location: 'Innovation Center, Dubai',
        category: 'Business',
        totalSeats: 250,
        ticketPrice: 100,
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Cloud Computing & DevOps Workshop',
        description: 'Deep dive into cloud architecture, deployment strategies, and scalable system design practices.',
        date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        location: 'Tech Valley, Islamabad',
        category: 'Technology',
        totalSeats: 100,
        ticketPrice: 600,
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800'
    }
];

const seedDatabase = async () => {
    try {
        console.log("🚀 Seeding started...");

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB connected");

        // clear old data
        await User.deleteMany();
        await Event.deleteMany();
        await Booking.deleteMany();
        console.log("🗑️ Old data cleared");

        // hash passwords
        const salt = await bcrypt.genSalt(10);
        const hashedUsers = users.map(user => ({
            ...user,
            password: bcrypt.hashSync(user.password, salt),
            isVerified: true
        }));

        const createdUsers = await User.insertMany(hashedUsers);
        const adminUser = createdUsers.find(u => u.role === 'admin');

        console.log(`👤 ${createdUsers.length} users created`);

        // create events
        const eventsWithAdmin = events.map(event => ({
            ...event,
            availableSeats: event.totalSeats,
            createdBy: adminUser._id
        }));

        const createdEvents = await Event.insertMany(eventsWithAdmin);

        console.log(`🎉 ${createdEvents.length} events created`);

        console.log("✅ Seeding completed successfully!");
        process.exit();

    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
};

// ❗ VERY IMPORTANT
seedDatabase();
// rest of your code stays SAME (no change in logic)