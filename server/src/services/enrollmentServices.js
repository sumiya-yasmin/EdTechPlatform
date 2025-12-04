import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';

export const enrollInCourseService = async (userId, courseId) => {
  const exists = await Enrollment.findOne({ student: userId, course: courseId });
  if (exists) throw new Error('Already enrolled in this course');

  const enrollment = await Enrollment.create({
    student: userId,
    course: courseId
  });
  return enrollment;
};

export const getMyCoursesService = async (userId) => {
  return await Enrollment.find({ student: userId })
    .populate('course', 'title thumbnail instructor level');
};

export const updateProgressService = async (userId, courseId, lessonId) => {
  const enrollment = await Enrollment.findOne({ student: userId, course: courseId });
  if (!enrollment) throw new Error('Enrollment not found');

  if (!enrollment.completedLessons.includes(lessonId)) {
    enrollment.completedLessons.push(lessonId);
    
    const course = await Course.findById(courseId);
    const totalLessons = course.syllabus.length;
    const completedCount = enrollment.completedLessons.length;
    
    enrollment.progress = Math.round((completedCount / totalLessons) * 100);
    
    if (enrollment.progress === 100) {
      enrollment.isCompleted = true;
    }

    await enrollment.save();
  }

  return enrollment;
};


export const getAllEnrollmentsService = async () => {
  return await Enrollment.find()
    .populate('student', 'name email')
    .populate('course', 'title price batches')
    .sort({ createdAt: -1 });
};