import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    classId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Class",
        required:true,
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["present", "absent","Leave"],
        required: true,
    },
    markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});

AttendanceSchema.index({ student: 1, classId: 1, date: 1 }, { unique: true });
const Attendance = mongoose.model("Attendance", AttendanceSchema);
export default Attendance;