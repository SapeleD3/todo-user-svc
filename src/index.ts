//load dependencies
import express from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import logger from './helpers/logging';
import { APP_USE_LIMIT, connectToDB } from './index.constants';
import router from './users.router';

config();

const app = express();

const stream: any = logger.stream;
app.use(cors());
app.use(morgan('combined', { stream }));
app.use(express.json());
app.use(APP_USE_LIMIT);
app.use(router);

connectToDB();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App is running on port: ${PORT}`);
});
