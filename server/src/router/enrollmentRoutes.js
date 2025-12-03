import express from 'express';
import { 
  enrollStudent, 
  getMyCourses, 
  updateProgress 
} from '../controller/enrollmentController.js';

const router = express.Router();

router.post('/', enrollStudent);              
router.get('/my-courses', getMyCourses);      
router.post('/progress', updateProgress);      

export default router;