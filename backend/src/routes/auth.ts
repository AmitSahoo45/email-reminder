import express from "express";

import {
    TestRoute,
    SignIn, Login, GetProfile, Logout,
    DeleteUser,
    SendOTP, VerifyOTP
} from '../controller/auth';
import authenticator from '../middlewares/auth';

const router = express.Router();

router.get('/', authenticator, TestRoute);

router.post('/register', SignIn);
router.post('/login', Login);
router.get('/profile', authenticator, GetProfile);
router.delete('/delete/:id', DeleteUser);
router.post('/logout', Logout);

router.post('/otp/send', authenticator, SendOTP);
router.patch('/otp/verify', authenticator, VerifyOTP);

export default router;