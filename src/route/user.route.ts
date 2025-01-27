import { Router } from 'express';
import { createUser, loginUser } from '../controller/user.controller';

const userRouter = Router();

userRouter.post('/users', createUser);
userRouter.post('/users/login', loginUser);

export const userRoutes = () => {
    return userRouter;
}

