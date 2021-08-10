import { Router, Request, Response } from 'express';
import { ROUTES } from './index.constants';
import { getUserData, login, register } from './users.controller';
import { isLoggedIn, validateUserInputData } from './users.middleware';

const router = Router();

//user registration rout
router.post(ROUTES.REGISTER, validateUserInputData, register);
router.post(ROUTES.LOGIN, validateUserInputData, login);
router.get(ROUTES.ME, isLoggedIn, getUserData);
router.get(ROUTES.HOME, (req: Request, res: Response) => {
  res.send('Welcome to my User service');
});

export default router;
