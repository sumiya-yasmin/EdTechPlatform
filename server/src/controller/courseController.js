import * as courseServices from '../services/courseServices.js';


export const createCourse = async (req, res) => {
  try {
    const course = await courseServices.createCourseService(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const result = await courseServices.getAllCoursesService(req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await courseServices.getCourseByIdService(req.params.id);
    res.status(200).json(course);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};