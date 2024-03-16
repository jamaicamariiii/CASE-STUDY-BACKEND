import mongoose from "mongoose";
import Cleaner from "../models/CleanerSchema.js";


const reviewSchema = new mongoose.Schema({
  cleaner: {
    type: mongoose.Types.ObjectId,
    ref: "Cleaner",
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  reviewText: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
    default: 0,
  },
},
{ timestamps: true }
);

reviewSchema.pre(/^find/, function(next){
  this.populate({
    path: "user", 
    select:"name photo",
  });

  next();
});

reviewSchema.statics.calcAverageRatings = async function(cleanerId){

  // this points to the current review
  const stats = await this.aggregate([{
    $match:{cleaner:cleanerId}
  },
  {
    $group:{
      _id: "$doctor",
      numOfRating: {$sum:1},
      avgRating:{$avg: '$rating'},
    },
  },
]);

await Cleaner.findByIdAndUpdate(cleanerId, {
  totalRating: stats[0].numOfRating,
  averageRating:stats[0].avgRating,
});
  
};
reviewSchema.post("save", function() {
  this.constructor.calcAverageRatings(this.cleaner);
});

export default mongoose.model("Review", reviewSchema);