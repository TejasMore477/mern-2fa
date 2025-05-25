import express from 'express';
import {authMiddleware} from "../middleware/authMiddleware.js"
import { getUserDataController } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data', authMiddleware, getUserDataController);

export default userRouter;