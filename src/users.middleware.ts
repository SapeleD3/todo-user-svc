import { Request, Response, NextFunction } from 'express';
import StatusCodes, { ReasonPhrases } from 'http-status-codes';
import { responseHandler } from './index.constants';
import { object, string } from 'joi';
import jwt from 'jsonwebtoken';
import { User } from './users.model';

const { UNPROCESSABLE_ENTITY, BAD_GATEWAY, NOT_FOUND, UNAUTHORIZED } =
  StatusCodes;

export const UserInputValidationSchema = object({
  email: string().min(5).required().trim(),
  password: string().min(6).max(1024).required(),
});

/**
 * validate the inputs served to login and register
 * @param req express request
 * @param res express response
 * @param next express next function
 * @returns
 */
export async function validateUserInputData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const validValues = await UserInputValidationSchema.validateAsync(req.body);
    req.body = validValues;
    return next();
  } catch (error) {
    return responseHandler(res, UNPROCESSABLE_ENTITY, {
      message: error.details[0].message,
      data: error.details,
    });
  }
}

/**
 * get token from authorization header and decrypt the token,
 * if successful add user to the request object
 * @param req express request
 * @param res express response
 * @param next express next function
 * @returns
 */
export async function isLoggedIn(req: any, res: Response, next: NextFunction) {
  let token = req.headers.authorization;
  if (!token) {
    return res
      .status(UNAUTHORIZED)
      .json({ message: ReasonPhrases.UNAUTHORIZED });
  }

  if (token.includes('Bearer ')) {
    token = token.replace('Bearer ', '');
  }

  try {
    const { user: userId }: any = jwt.verify(
      token,
      String(process.env.JWT_SECRET_KEY)
    );

    const currentUser: any = await User.findById(userId);

    if (!currentUser) {
      return res.status(NOT_FOUND).json({
        message: 'We could not find this user. Please contact support',
      });
    }

    req.user = currentUser;

    return next();
  } catch (error) {
    console.log('ERROR', error);
    return res.status(BAD_GATEWAY).json({
      message: 'Invalid token. Please log in and try again',
    });
  }
}
