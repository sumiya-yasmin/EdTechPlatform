import * as enrollmentServices from '../services/enrollmentServices.js';

export const enrollStudent = async (req, res) => {
  try {
    const { courseId } = req.body;
    const result = await enrollmentServices.enrollInCourseService(req.user._id, courseId);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const getMyCourses = async (req, res) => {
  try {
    const courses = await enrollmentServices.getMyCoursesService(req.user._id);
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;
    const result = await enrollmentServices.updateProgressService(req.user._id, courseId, lessonId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};