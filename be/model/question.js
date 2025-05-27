import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
    input: {
        type: String,
        required: true
    },
    output: {
        type: String,
        required: true
    },
    isHidden: {
        type: Boolean,
        default: false
    }
});

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['coding', 'text'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    // For coding questions
    testCases: [testCaseSchema],
    sampleInput: String,
    sampleOutput: String,
    timeLimit: {
        type: Number,  // in milliseconds
        default: 2000
    },
    memoryLimit: {
        type: Number,  // in MB
        default: 256
    },
    // For text questions
    options: [{
        type: String
    }],
    correctAnswer: String,
    // Common fields
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Question', questionSchema); 