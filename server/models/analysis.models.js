import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    analysis: {
        timeComplexity: { type: String, required: true },
        spaceComplexity: { type: String, required: true },
        suggestions: [{ type: String }],
    },
    motivationalQuote: {
        type: String,

    }




}, { timestamps: true })

export const Analysis = mongoose.model('Analysis', analysisSchema);