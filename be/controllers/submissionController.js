
import Submission from "./../model/submissions.js"
import mongoose from "mongoose";

const postCreateSubmission=async (req,res)=>{

        const {contestID, answers}=req.body;

        if (!contestID || !answers) {
            return res.status(400).json({
                msg: "Contest ID and answers are required"
            });
        }

    try{
        const submission = await Submission.create({
            contestID,
            answers,
        })
    
        res.status(201).json({
            msg:"Submission successful",
            submissionId: submission._id
        })
    
    }
    catch(err){
        console.log("Error submitting answers",err);
        res.status(500).json({
            msg: "Error submitting answers",
            error: err.message
        });
    }

}
const postFeedback=async (req,res)=>{

    const {subID,feedback,name}=req.body;

    if (!subID || !feedback) {
        return res.status(400).json({
            msg: "Submission ID and feedback are required"
        });
    }

    try {
        const sub=await Submission.updateOne({_id:new mongoose.Types.ObjectId(subID)},{
            $set:{feedback:feedback, reviewedBy:name}
        })
        
        if (sub.matchedCount === 0) {
            return res.status(404).json({
                msg: "Submission not found"
            });
        }
        
        res.status(200).json({
            msg: "Feedback submitted successfully",
            result: sub
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Error submitting feedback",
            error: error.message
        });
    }
}

const getGetSubmissions=async (req,res)=>{

    const {id}=req.query;

try{
    const data=await Submission.find({contestID:id})
    res.status(200).json({
        data
    })
}
catch(err){
    console.log("Failed to get details");
}
}
export default {postCreateSubmission,getGetSubmissions,postFeedback}