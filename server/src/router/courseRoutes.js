import express from 'express';
import { 
  getAllCourses, 
  createCourse, 
  getCourseById 
} from '../controller/courseController.js';
import { protect, admin } from '../middlewares/authMiddleware.js'; 

const router = express.Router();

router.get('/', getAllCourses);
router.get('/:id', getCourseById);

router.post('/', protect, admin, createCourse);

export default router;