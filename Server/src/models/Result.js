import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
	student: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	classId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Class",
		required: true,
	},
	subject: {
		type: String,
		required: true,
		trim: true,
	},
	exam: {
		type: String,
		required: true,
		trim: true,
	},
	marksObtained: {
		type: Number,
		required: true,
		min: 0,
	},
	totalMarks: {
		type: Number,
		required: true,
		min: 0,
	},
    enteredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
},
}, {
	timestamps: true,
});

resultSchema.index({ student: 1, classId: 1, subject: 1, exam: 1 }, { unique: true });

const Result = mongoose.model("Result", resultSchema);
export default Result;