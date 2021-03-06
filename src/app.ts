//load dependencies
import express, { Request, Errback, Response, NextFunction } from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import logger from './helpers/logging';
import swaggerUI from 'swagger-ui-express';
import docs from './user-svc.json';
import { APP_USE_LIMIT } from './index.constants';
import router from './users.router';

config();

const app = express();
app.use(cors());
app.use(morgan('combined', { stream: logger.stream.write }));
app.use(express.json());
app.use(APP_USE_LIMIT);
app.use(router);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(docs));
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  logger.error(
    `${req.method} - ${err.message}  - ${req.originalUrl} - ${req.ip}`
  );
  next(err);
});

export default app;
