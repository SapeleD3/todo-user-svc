import RateLimiter from 'express-rate-limit';
import mongoose from 'mongoose';
import { Response } from 'express';
import logger from './helpers/logging';

/**
 * Connects service to mongodb
 */
export async function connectToDB() {
  const { NODE_ENV, MONGO_TEST_URL, MONGO_URL } = process.env;
  const URL = NODE_ENV === 'test' ? MONGO_TEST_URL : MONGO_URL;
  try {
    await mongoose.connect(String(URL), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true,
    });
    logger.info('Successfully connected to', String(URL));
  } catch (err) {
    logger.error(err);
  }
}

//routes strings
export const ROUTES = {
  REGISTER: '/user/register',
  LOGIN: '/user/login',
  ME: '/user',
  HOME: '/',
  USER: '/user/:id',
};

export type ResponseDetails = {
  message: string;
  data: any;
};

/**
 * Handle all non defined route visits
 * @param res http response object
 * @param status http response status
 * @param values response message
 */
export const responseHandler = (
  res: Response,
  status: any,
  values: ResponseDetails
) => {
  const { message, data } = values;
  return res.status(status).json({ message, data });
};

/**
 * DDOS attack preventer. App should not allow a user
 * make more than 600 requests every 10 minutes i.e a request per second
 * @constant
 */
export const APP_USE_LIMIT = RateLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 600, // limit each IP to 600 requests every 10 minutes, i.e a request per second,
  message:
    'Too many requests from this user, please try again after 10 minutes',
});

/**
 * Prevents brute force password hack. Allows 5 login attempts every 10 minutes
 * @constant
 */
export const MAX_LOGIN_LIMITER = RateLimiter({
  windowMs: 5 * 60 * 1000, // 10 minutes
  max: 20, // limit each IP to 10 requests every 10 minutes,
  message: 'Too many login attempts, please try again after 10 minutes.',
});
