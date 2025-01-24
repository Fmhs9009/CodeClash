import express from "express"
import  contestController from "./../controllers/contestController.js"
const {postCreateContest,getGetContest,postViewContests,putEditContest,deleteDeleteContest}  =contestController;
import submissionController from "./../controllers/submissionController.js"
const {postCreateSubmission,getGetSubmissions,postFeedback}=submissionController;
const router = express.Router();


// router.get("/",(req,res)=>{
//     res.send("hellooooo");
// })

router.post("/createContest",postCreateContest)
router.get("/getContest",getGetContest)
router.post("/createSubmission",postCreateSubmission)
router.get("/getSubmission",getGetSubmissions)
router.post("/feedback",postFeedback)
router.post("/viewContests",postViewContests)
router.put("/editCOntest",putEditContest)
router.delete("/deleteContest/:id",deleteDeleteContest)

export default router;