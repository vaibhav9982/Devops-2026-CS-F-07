import mongoose from "mongoose";

const projectSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    prompt: {
      type: String,
      required: true,
    },

    language: {
      type: String,
      required: true,
    },

    code: {
      type: String,
      required: true,
    },

    
    aiAnalysis: {
      type: mongoose.Schema.Types.Mixed,
      default: undefined,
    },

    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
    },

    generatedVisualization: {
      code: {
        type: String,
        default: undefined,
      },

      explanation: {
        type: String,
      },

      type: {
        type: String,
        default: "react-jsx",
      },
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Project = mongoose.model("Project", projectSchema);

export default Project;