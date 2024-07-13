import express from "express";

import {
    TestRoute,
    SignIn, Login, Logout,
    DeleteUser,
    SendOTP, VerifyOTP
} from '../controller/auth';
import authenticator from '../middlewares/auth';

const router = express.Router();

router.get('/', authenticator, TestRoute);

router.post('/register', SignIn);
router.post('/login', Login);
router.delete('/delete/:id', DeleteUser);
router.post('/logout', Logout);

router.post('/otp/send', SendOTP);
router.patch('/otp/verify', VerifyOTP);

export default router;