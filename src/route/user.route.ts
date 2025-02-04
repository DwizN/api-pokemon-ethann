import { Router } from 'express';
import { createUser, loginUser, updateUser, deleteUser } from '../controller/user.controller';
import { verifyJWT } from '../services/user.service';

const userRouter = Router();

userRouter.post('/users', createUser);
userRouter.post('/users/login', loginUser);
userRouter.patch('/users', verifyJWT, updateUser);
userRouter.delete('/users', verifyJWT, deleteUser);

export const userRoutes = () => {
    return userRouter;
}

