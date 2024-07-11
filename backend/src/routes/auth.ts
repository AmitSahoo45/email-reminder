import express from "express";
import {
    TestRoute,
    SignIn, Login,
    SendOTP, VerifyOTP
} from '../controller/auth';

const router = express.Router();

router.get('/', TestRoute);

router.post('/register', SignIn);
router.post('/login', Login);

router.post('/otp/send', SendOTP);
router.patch('/otp/verify', VerifyOTP);

export default router;