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
    res.status(200).json({
        details
    })

}
catch(err){
    console.log("Error while fetching contest details",err);
}
}


const postViewContests=async(req,res)=>{
    const {sub}=req.body;

    try {
        let data=await Contest.find({createdBy:sub});
        res.status(200).json({
            msg:"Successfully Fetched",
            data
        })

    } catch (error) {
        console.log(error);
    }
}
const putEditContest= async(req,res)=>{

    const {id, editForm}=req.body;
    try {
        await Contest.findOneAndUpdate({_id:id},{
            $set:editForm
        })
        res.status(200).json({msg:"Updated Successfully"})
    } catch (error) {
        console.log(error);
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

