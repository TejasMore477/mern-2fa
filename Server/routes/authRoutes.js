import express from 'express';
import { isAuthenticated, loginController, logOutController, registerController, resetPasswordController, sendResetOtpController, sendVerifyOtpController, verifyEmailController } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const authRouter = express.Router();

//authrouter endpoints
// rout : /api/auth/register
authRouter.post('/register',registerController);

//rout : /api/auth/login
authRouter.post('/login',loginController);

//rout : /api/auth/logout
authRouter.post('/logout',logOutController);

//rout : /api/auth/send-verify-otp
authRouter.post('/send-verify-otp', authMiddleware ,sendVerifyOtpController);

//rout : /api/auth/verify-account
authRouter.post('/verify-account', authMiddleware ,verifyEmailController);

//rout : /api/auth/isauth
authRouter.get('/isauth', authMiddleware ,isAuthenticated);

//rout : /api/auth/send-reset-otp
authRouter.post('/send-reset-otp', sendResetOtpController);

//rout : /api/auth/reset-password
authRouter.post('/reset-password', resetPasswordController);

export default authRouter;