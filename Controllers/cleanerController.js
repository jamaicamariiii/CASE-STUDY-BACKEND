import BookingSchema from "../models/BookingSchema.js";
import Cleaner from "../models/CleanerSchema.js";

//update
export const updateCleaner = async(req, res) => {
    const id = req.params.id;

    try {
        const updatedCleaner = await Cleaner.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedCleaner) {
            return res.status(404).json({ success: false, message: "Cleaner not found" });
        }

        res.status(200).json({
            success:true, 
            message:"Successfully updated", 
            data:updatedCleaner,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success:false, message: "Failed to update" });
    }
};


//delete
export const deleteCleaner = async(req, res) => {
    const id = req.params.id;

    try {
       await Cleaner.findByIdAndDelete(id, );

        res.status(200).json({
            success:true, 
            message:"Sucessfully deleted",
        });

    } catch (err) {
        res.status(500).json({success:false, message:"Failed to delete"});
        
    }
};

//search 
export const getSingleCleaner = async(req, res) => {
    const id = req.params.id;

    try {
        const cleaner = await Cleaner.findById(id)
        .populate("reviews")
        .select("-password");

        res.status(200).json({
            success:true, 
            message:"User found", 
            data:cleaner,
        });

    } catch (err) {
        res.status(404).json({success:false, message:"No cleaner found"});
        
    }
};

//get all
export const getAllCleaner = async(req, res) => {
    
    try {

        const {query} = req.query
        let cleaner;

        if(query){
            cleaner = await Cleaner.find({
                isApproved: "approved", 
                $or:[
                {name:{$regex:query, $options: "i"}}, 
                {specialization: {$regex: query, $options: "i"}},
                ],
        }).select("-password");
        } else {
            cleaner = await Cleaner.find({ isApproved: "approved" })
            .select("-password");
        }

        res.status(200).json({
            success:true, 
            message:"Users found", 
            data:cleaner,
        });

    } catch (err) {
        res.status(500).json({success:false, message:"Not found"});
        
    }
};

export const getCleanerProfile = async(req,res) =>{
    const cleanerId = req.cleanerId

    try {
        const cleaner = await Cleaner.findById(cleanerId)

        if(!cleaner){
            return res.status(404).json({success:false, message: "Cleaner not found"});
        }

        const {password, ...rest} = cleaner._doc;
        const appointments = await Booking.find({cleaner: cleanerId})

        res.status(200).json({success:true, message: "Profile Information is getting", data: {...rest, appointments },
    })
    } catch (err) {
        res.status(500).json({success:false, message:"Something went wrong, cannot get information"});
        
    }
};

  