import Contest from "./../model/contest.js"




const postCreateContest=async (req,res)=>{

    // const temp=req.body;
    // console.log("The data is:",temp)
    const {name,time, numQuestions, questions,createdBy} =req.body;
    if(!time || !numQuestions || !questions ){
        return res.status(400).json({
            msg:"please enter time , number of questions and questions."
        })
    }

    try{
        const data =await Contest.create({
            name,
            time,
            numQuestions,
            questions,
            createdBy
        })
        const id=data._id;
        res.status(200).json({
            msg:"New contest created",
            id
        })
    }

    catch(err){
        res.status(500).json({
            msg:"Error Creating new contest",
            err
        })
    }

}

const getGetContest=async (req,res)=>{

    const {id}=req.query;
try{
    const details=await Contest.findById(id)
    if (!details) {
        return res.status(404).json({
            msg: "Contest not found"
        });
    }
    res.status(200).json({
        details
    })
}
catch(err){
    console.log("Error while fetching contest details",err);
    res.status(500).json({
        msg: "Error while fetching contest details",
        err: err.message
    });
}
}


const postViewContests=async(req,res)=>{
    const {sub}=req.body;

    if (!sub) {
        return res.status(400).json({
            msg: "User ID (sub) is required"
        });
    }

    try {
        let data=await Contest.find({createdBy:sub});
        res.status(200).json({
            msg:"Successfully Fetched",
            data
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Error fetching contests",
            error: error.message
        });
    }
}
const putEditContest= async(req,res)=>{

    const {id, editForm}=req.body;
    
    if (!id || !editForm) {
        return res.status(400).json({
            msg: "Contest ID and edit form data are required"
        });
    }
    
    try {
        const result = await Contest.findOneAndUpdate({_id:id},{
            $set:editForm
        }, { new: true });
        
        if (!result) {
            return res.status(404).json({
                msg: "Contest not found"
            });
        }
        
        res.status(200).json({msg:"Updated Successfully", contest: result})
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Error updating contest",
            error: error.message
        });
    }
}

const deleteDeleteContest=async(req,res)=>{

    const {id}=req.params;

    try {
        const data=await Contest.findOneAndDelete({_id:id})
        res.status(200).json(
            {msg:"Contest Deleted !"}
        )
    } catch (error) {
        console.log(error);
    }

}
export default {getGetContest,postCreateContest,postViewContests,putEditContest,deleteDeleteContest}

