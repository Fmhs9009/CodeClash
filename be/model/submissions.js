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

        submittedAt:{
            type:Date,
            default:Date.now
        }

});


export default mongoose.model("Submission",submissionSchema)