import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["student", "admin"]).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});

const lessonSchema = z.object({
  title: z.string().min(1, "Lesson title is required"),
  videoUrl: z.string().url("Invalid Video URL"),
  duration: z.number().optional(),
  isFree: z.boolean().optional(),
});

const batchSchema = z.object({
  title: z.string().min(1, "Batch title is required"),
  startDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Invalid date format"),
});

const quizQuestionSchema = z.object({
  question: z.string().min(1, "Question text is required"),
  options: z.array(z.string()).min(2, "At least 2 options required"),
  correctAnswer: z.string().min(1, "Correct answer is required"),
});

const assignmentSchema = z.object({
  title: z.string().min(1, "Assignment title is required"),
  instructions: z.string().min(1, "Instructions are required"),
  totalPoints: z.number().min(1),
});

export const courseSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    price: z.number().min(0, "Price cannot be negative"),
    category: z.string().min(1, "Category is required"),
    thumbnail: z.string().url("Invalid Thumbnail URL"),
    instructor: z.string().min(1),
    level: z.enum(["Beginner", "Intermediate", "Advanced"]),
    syllabus: z.array(lessonSchema).optional(),
    batches: z.array(batchSchema).optional(),
    quiz: z.array(quizQuestionSchema).optional(),
    assignment: assignmentSchema.optional(),
  }),
});

export const submissionSchema = z.object({
  body: z
    .object({
      courseId: objectId,
      type: z.enum(["assignment", "quiz"]),
      content: z
        .string()
        .optional()
        .refine((val) => val !== undefined, {
          message: "Content is required for assignments",
          path: ["content"],
        })
        .or(z.literal("")),
      score: z.number().min(0).max(100).optional(),
    })
    .refine(
      (data) => {
        if (data.type === "assignment" && !data.content) return false;
        if (data.type === "quiz" && data.score === undefined) return false;
        return true;
      },
      {
        message: "Invalid submission data for the selected type",
      }
    ),
});

export const enrollmentSchema = z.object({
  body: z.object({
    courseId: objectId,
  }),
});
