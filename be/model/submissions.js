import mongoose from "mongoose"
import {Schema} from "mongoose"


const submissionSchema = new Schema({

        contestID:{
            type:String,
            required:true
        },

        // userID:{
        //     type:mongoose.Schema.Types.ObjectId,
        //     required:true
        // },

        answers:[
            {
                question:{
                    type:String,
                    required:true
                },
                answer:{
                    type:String
                }
            }
        ],
        feedback:{
            
            logic:{
                type:String,
            },
            efficiency:{
                type:String,
            },
            codingStyle:{
                type:String
            },
            clarity:{
                type:String
            },
            custom:{
                type:String
            },
        
        },
        reviewedBy:{
            type:String
        },
        submittedAt:{
            type:Date,
            default:Date.now
        }

});


export default mongoose.model("Submission",submissionSchema)