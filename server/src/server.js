import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import config from './config/envConfig.js';
import configureRouter from './router/index.js';
import seedAdmin from './scripts/seedAdmin.js';

const PORT = config.PORT;

const app = express();
connectDB().then(() => {
  seedAdmin();
});
app.use(express.json());
app.use(cors(config.CORS));

configureRouter(app);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));