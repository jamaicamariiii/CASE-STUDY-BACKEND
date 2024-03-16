import User from "../models/UserSchema.js";
import Booking from "../models/BookingSchema.js";
import Cleaner from "../models/CleanerSchema.js";

//update
export const updateUser = async(req, res) => {
    const id = req.params.id;

    try {
        const updatedUser = await User.findByIdAndUpdate(id, {$set:req.body}, {new:true});

        res.status(200).json({
            success:true, 
            message:"Sucessfully updated", 
            data:updatedUser,
        
        });
    } catch (err) {
        res.status(500).json({success:false, message:"Failed to Update"});
        
    }
};

//delete
export const deleteUser = async(req, res) => {
    const id = req.params.id;

    try {
       await User.findByIdAndDelete(id, );

        res.status(200).json({
            success:true, 
            message:"Sucessfully deleted",
        });

    } catch (err) {
        res.status(500).json({success:false, message:"Failed to delete"});
        
    }
};

//search user
export const getSingleUser = async(req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findById(id).select("-password");

        res.status(200).json({
            success:true, 
            message:"User found", 
            data:user,
        });

    } catch (err) {
        res.status(404).json({success:false, message:"No user found"});
        
    }
};

//get all
export const getAllUser = async(req, res) => {
    
    try {
        const users = await User.find({}).select("-password");

        res.status(200).json({
            success:true, 
            message:"Users found", 
            data:users,
        });

    } catch (err) {
        res.status(404).json({success:false, message:"Not found"});
        
    }
};


export const getUserProfile = async(req,res)=> {
    const userId = req.userId

    try {
        const user = await User.findById(userId)

        if(!user){
            return res.status(404).json({success:false, message: "User not found"})
        }

        const {password, ...rest} = user._doc;

        res.status(200).json({success:true, message: "Profile Information is getting", data:{...rest}});
    } catch (err) {
        res.status(500).json({success:false, message:"Something went wrong, cannot get information"});
        
    }
};

export const getMyAppointments = async(req,res) => {
    try {

        //step-1: retrieve appointments from booking for specific user
        const bookings = await Booking.find({user:req.userId})

        //step-2: extract cleaner ids from appointment booking
        const  cleanerIds = bookings.map(el=>el.cleaner.id)

        //step-3: retrieve cleaners using cleaner id
        const cleaner = await Cleaner.find({_id: {$in:cleanerIds}}).select("-password")

        res.status(200).json({success:true, message: "Getting Appointments", data:doc});

    } catch (error) {
        res.status(500).json({success:false, message:"Something went wrong, cannot get information"});
    }
};