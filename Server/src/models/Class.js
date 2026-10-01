import mongoose from "mongoose";
const ClassSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    section: {
        type: String,
        required: true,
    }
    ,
    classTeacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

}, {
    timestamps: true,
});

ClassSchema.index({ name: 1, section: 1 }, { unique: true }); 
const Class = mongoose.model("Class", ClassSchema);
export default Class;