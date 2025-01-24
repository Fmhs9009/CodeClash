import mongoose from "mongoose";
import { Schema } from "mongoose";


const contestSchema=new Schema({

    name :{
        type:String,
        required:true
    },

    time:{
        type:Number,
        required:true
    },

    numQuestions:{
        type:Number,
        required:true
    },

    questions:{
        type:[String],
        required:true
    },

    createdBy:{
        type:String,
        required:true
    },

    createdAt:{
        type:Date,
        default:Date.now
    }
})


export default  mongoose.model("Contest",contestSchema)