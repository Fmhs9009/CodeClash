
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

    const {subID, feedback, name, userEmail}=req.body;

    if (!subID || !feedback) {
        return res.status(400).json({
            msg: "Submission ID and feedback are required"
        });
    }

    if (!userEmail) {
        return res.status(400).json({
            msg: "User email is required for authorization"
        });
    }

    try {
        // First, find the submission to get the contest ID
        const submission = await Submission.findById(subID);
        
        if (!submission) {
            return res.status(404).json({
                msg: "Submission not found"
            });
        }

        // Then, find the contest to check if user is the creator
        const Contest = (await import('./../model/contest.js')).default;
        const contest = await Contest.findById(submission.contestID);
        
        if (!contest) {
            return res.status(404).json({
                msg: "Contest not found"
            });
        }

        // Check if current user is the contest creator
        const isCreator = contest.createdBy === userEmail;
        
        if (!isCreator) {
            return res.status(403).json({
                msg: "Access denied. Only contest creators can submit feedback.",
                isCreator: false
            });
        }

        // If creator, allow feedback submission
        const updateResult = await Submission.updateOne(
            {_id: new mongoose.Types.ObjectId(subID)},
            {$set: {feedback: feedback, reviewedBy: name}}
        );
        
        if (updateResult.matchedCount === 0) {
            return res.status(404).json({
                msg: "Submission not found"
            });
        }
        
        res.status(200).json({
            msg: "Feedback submitted successfully",
            result: updateResult,
            isCreator: true
        });
    } catch (error) {
        console.log("Error submitting feedback:", error);
        res.status(500).json({
            msg: "Error submitting feedback",
            error: error.message
        });
    }
}

const getGetSubmissions=async (req,res)=>{

    const {id, userEmail}=req.query;
    
    // Debug logging
    console.log('🔍 getGetSubmissions called with:');
    console.log('- Contest ID:', id);
    console.log('- User Email:', userEmail);
    console.log('- Full query params:', req.query);

    if (!id) {
        return res.status(400).json({
            msg: "Contest ID is required"
        });
    }

    if (!userEmail) {
        return res.status(400).json({
            msg: "User email is required"
        });
    }

try{
    // First, check if the user is the contest creator
    const Contest = (await import('./../model/contest.js')).default;
    const contest = await Contest.findById(id);
    
    if (!contest) {
        return res.status(404).json({
            msg: "Contest not found"
        });
    }
    
    // Check if current user is the contest creator
    const isCreator = contest.createdBy === userEmail;
    
    if (!isCreator) {
        // If not creator, return "Not reviewed yet" message
        return res.status(200).json({
            data: [],
            message: "Not reviewed yet",
            isCreator: false
        });
    }
    
    // If creator, return all submissions
    const data = await Submission.find({contestID:id});
    res.status(200).json({
        data,
        isCreator: true
    });
}
catch(err){
    console.log("Failed to get submissions:", err);
    res.status(500).json({
        msg: "Failed to get submissions",
        error: err.message
    });
}
}
export default {postCreateSubmission,getGetSubmissions,postFeedback}