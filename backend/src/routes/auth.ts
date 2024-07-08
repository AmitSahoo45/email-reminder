import express from "express";
import { TestRoute, SignIn, SendOTP, VerifyOTP } from '../controller/auth';

const router = express.Router();

router.get('/', TestRoute);
router.post('/register', SignIn);

router.post('/otp/send', SendOTP);
router.patch('/otp/verify', VerifyOTP);

export default router;