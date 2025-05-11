import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: String,
  completed: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
