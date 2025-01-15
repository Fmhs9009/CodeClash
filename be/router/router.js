import express from "express"
import  contestController from "./../controllers/contestController.js"
const {postCreateContest,getGetContest}  =contestController;
import submissionController from "./../controllers/submissionController.js"
const {postCreateSubmission,getGetSubmissions}=submissionController;
const router = express.Router();


// router.get("/",(req,res)=>{
//     res.send("hellooooo");
// })

router.post("/createContest",postCreateContest)
router.get("/getContest",getGetContest)
router.post("/createSubmission",postCreateSubmission)
router.get("/getSubmission",getGetSubmissions)
export default router;