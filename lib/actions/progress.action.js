"use server";
import { auth } from "@clerk/nextjs/server";

import { objectId } from "../utils";

import Progress from "@/models/progress.model";

export async function updateProgress({ lessonId, courseId, moduleId }) {
  try {
    const { sessionClaims } = await auth();
    const studentId = sessionClaims?.userId;
    await Progress.findOneAndUpdate(
      { student: objectId(studentId), course: courseId, modules: moduleId },
      {
        $addToSet: { lessons: lessonId },
      },
      { new: true, upsert: true },
    );
    return null;
  } catch (error) {
    console.error("Error updating progress:", error);
    throw new Error("Failed to update progress");
  }
}
