import Contest from "./../model/contest.js"




const postCreateContest=async (req,res)=>{

    // const temp=req.body;
    // console.log("The data is:",temp)
    const {time, numQuestions, questions} =req.body;
    if(!time || !numQuestions || !questions ){
        return res.status(400).json({
            msg:"please enter time , number of questions and questions."
        })
    }

    try{
        const data =await Contest.create({
            time,
            numQuestions,
            questions,
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

export default {getGetContest,postCreateContest}

