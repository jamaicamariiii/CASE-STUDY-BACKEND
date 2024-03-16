import Review from "../models/ReviewSchema.js";
import Cleaner from "../models/CleanerSchema.js";


//get all reviews
export const getAllReviews = async(req,res)=>{
    try {
        const reviews = await Review.find({});

        res.status(200).json({success:true, message: "Successful", data:reviews});
    } catch (error) {
        res.status(200).json({success:false, message: "Not found"});
    }
};


//create review 
export const createReview = async(req,res) =>{
    if(!req.body.cleaner) req.body.cleaner = req.params.cleanerId
    if(!req.body.user) req.body.user = req.params.userId

    const newReview = new Review(req.body)

    try {
        
        const savedReview = await newReview.save()

        await Cleaner.findByIdAndUpdate(req.body.cleaner,{
            $push:{reviews: savedReview._id}
        })

        res.status(200).json({success:true, message: "Review Submitted", data:savedReview})
    } catch (err) {
        res.status(200).json({success:false, message: err.message})
    }
}