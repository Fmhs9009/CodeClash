
import Submission from "./../model/submissions.js"


const postCreateSubmission=async (req,res)=>{

        const {contestID, answers}=req.body;

    try{
        await Submission.create({
            contestID,
            answers,
        })
    
        res.status(200).json({
            msg:"Submission successful"
        })
    
    }
    catch(err){
        console.log("Error submitting answers",err);
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
export default {postCreateSubmission,getGetSubmissions}