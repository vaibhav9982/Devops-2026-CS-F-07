import Project from "../models/project.js";
import { generateVisualization } from "../services/AI/Ai.service.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { validateGeneratedVisualization } from "../utils/generatedVisualizationValidator.js";

const requiredFields = (data) =>
  ["title", "prompt", "language", "code"].every(
    (field) => typeof data[field] === "string" && data[field].trim(),
  );

async function createGeneratedVisualization(input) {
  const code = await generateVisualization(input);

  const validation = validateGeneratedVisualization(code);

  if (!validation.valid) {
    throw new Error(validation.reason);
  }

  return {
    code,
    type: "react-jsx",
    explanation: "AI-generated interactive visualization.",
  };
}

export const createProject = asyncHandler(async (req, res) => {
  if (!requiredFields(req.body)) {
    throw new ApiError(
      400,
      "title, prompt, language, and code are required.",
    );
  }

  const { title, prompt, language, code } = req.body;

  const generatedVisualization = await createGeneratedVisualization({
    code,
    language,
    prompt,
  });

  const project = await Project.create({
    title,
    prompt,
    language,
    code,
    generatedVisualization,
    status: "completed",
    userId: req.user.id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "New project created successfully", project));
});

export const projects = asyncHandler(async (req, res) => {
  const data = await Project.find({
    userId: req.user.id,
  }).sort({
    updatedAt: -1,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      data.length
        ? "Projects fetched successfully"
        : "You have not created any projects",
      data,
    ),
  );
});

export const specific_project = asyncHandler(async (req, res) => {
  const project = await Project.findOne({
    _id: req.params.id,
    userId: req.user.id,
  });

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Project fetched successfully", project));
});

export const edit_project = asyncHandler(async (req, res) => {
  const existing = await Project.findOne({
    _id: req.params.id,
    userId: req.user.id,
  });

  if (!existing) {
    throw new ApiError(404, "Project not found.");
  }

  const updatedData = {};

  for (const key of ["title", "prompt", "language", "code"]) {
    if (req.body[key] !== undefined) {
      updatedData[key] = req.body[key];
    }
  }

  const finalInput = {
    title: updatedData.title ?? existing.title,
    prompt: updatedData.prompt ?? existing.prompt,
    language: updatedData.language ?? existing.language,
    code: updatedData.code ?? existing.code,
  };

  if (!requiredFields(finalInput)) {
    throw new ApiError(
      400,
      "title, prompt, language, and code are required.",
    );
  }

  const sourceChanged =
    req.body.regenerate === true ||
    ["prompt", "language", "code"].some(
      (key) =>
        updatedData[key] !== undefined &&
        updatedData[key] !== existing[key],
    );

  if (sourceChanged) {
    updatedData.generatedVisualization =
      await createGeneratedVisualization(finalInput);

    updatedData.status = "completed";
  }

  const project = await Project.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user.id,
    },
    {
      $set: updatedData,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Project updated", project));
});

export const del_project = asyncHandler(async (req, res) => {
  const project = await Project.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id,
  });

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Project deleted", project));
});