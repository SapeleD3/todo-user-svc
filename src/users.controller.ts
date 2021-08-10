import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import httpStatusCode, { ReasonPhrases } from 'http-status-codes';
import { sign } from 'jsonwebtoken';
import { responseHandler } from './index.constants';
import { RequestWithUser, User } from './users.model';

const { INTERNAL_SERVER_ERROR, BAD_REQUEST, OK } = httpStatusCode;

const expiresIn = '9999 years';

/**
 * register user controller to add user to database
 * @param req
 * @param res
 * @returns
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    //check if email exists in db
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return responseHandler(res, BAD_REQUEST, {
        message: ReasonPhrases.BAD_REQUEST,
        data: {},
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });
    const { _id } = newUser;
    const token = sign({ user: _id }, process.env.JWT_SECRET_KEY!, {
      expiresIn,
    });
    return responseHandler(res, OK, {
      message: ReasonPhrases.OK,
      data: {
        token,
      },
    });
  } catch (e) {
    return responseHandler(res, INTERNAL_SERVER_ERROR, {
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      data: {},
    });
  }
};

//constant for invalid login credentials
const INVALID_CREDENTIALS = 'invalid credentials';

/**
 * login user controller to validate user
 * @param req
 * @param res
 * @returns
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    //check if email exists in db
    const user = await User.findOne({ email });
    if (!user) {
      return responseHandler(res, BAD_REQUEST, {
        message: ReasonPhrases.BAD_REQUEST,
        data: {},
      });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return responseHandler(res, BAD_REQUEST, {
        message: INVALID_CREDENTIALS,
        data: {},
      });
    }

    const token = sign({ user: user._id }, process.env.JWT_SECRET_KEY!, {
      expiresIn,
    });
    return responseHandler(res, OK, {
      message: ReasonPhrases.OK,
      data: {
        token,
      },
    });
  } catch (e) {
    return responseHandler(res, INTERNAL_SERVER_ERROR, {
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      data: {},
    });
  }
};

/**
 * get authenticated user details
 * @param req
 * @param res
 * @returns
 */
export const getUserData = async (req: RequestWithUser, res: Response) => {
  const { user }: any = req;
  const { _id } = user;
  try {
    const userData = await User.findOne({ _id }).select('-password');
    return responseHandler(res, OK, {
      message: ReasonPhrases.OK,
      data: {
        userData,
      },
    });
  } catch (e) {
    return responseHandler(res, INTERNAL_SERVER_ERROR, {
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      data: {},
    });
  }
};
