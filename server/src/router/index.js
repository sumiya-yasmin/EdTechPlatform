import authRouter from './authRoutes.js'
import courseRouter from './courseRoutes.js'
const configureRouter = (app) => {
  app.use('/auth', authRouter);
  app.use('/courses', courseRouter);
};

export default configureRouter;