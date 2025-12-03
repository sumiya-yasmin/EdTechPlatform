import { protect } from '../middlewares/authMiddleware.js';
import authRouter from './authRoutes.js'
import courseRouter from './courseRoutes.js'
import enrollmentRouter from './enrollmentRoutes.js'
const configureRouter = (app) => {
  app.use('/auth', authRouter);
  app.use('/courses', courseRouter);
  app.use('/enrollments', protect, enrollmentRouter);
};

export default configureRouter;