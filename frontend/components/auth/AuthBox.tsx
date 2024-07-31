import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from "react-hot-toast";

import { useUser } from '@/context/user/UserContext';
import { authenticateUser, sendOTP, verifyOTP } from "@/services/authService";

const AuthBox: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [dontHaveAccount, setDontHaveAccount] = useState<boolean>(false);
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [otpWindow, setOtpWindow] = useState<boolean>(false);

    const {
        register,
        handleSubmit
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    });

    const [otp, setOtp] = useState<string>('');

    const { user, setUser } = useUser();

    const toggleAccountType = () => setDontHaveAccount(!dontHaveAccount);
    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const { name, email, password } = data;

        if (!email || !password) {
            toast.error(`Please enter ${!email ? "an email" : "a password"}`);
            return;
        }

        setLoading(true);
        try {
            const res = await authenticateUser({ name, email, password }, dontHaveAccount);
            setUser({ userid: res.userid, name: res.name, isVerified: true });

            if (res.ecode === 'USER_CREATED' || res.ecode === 'EMAIL_NOT_VERIFIED') {
                setOtpWindow(true);

                if (res.ecode === 'EMAIL_NOT_VERIFIED') toast.error('Email not verified', { duration: 4000 });
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    const onOtpSubmit = async () => {
        if (!otp && otp.length < 6)
            return toast.error('Please enter the correct OTP');

        setLoading(true);
        try {
            await verifyOTP({ otp });
            setUser({ ...user, isVerified: true });
            setOtpWindow(false);
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    const onOtpResend = async () => {
        try {
            setLoading(true);
            await sendOTP();
            toast.success('OTP sent successfully');
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <section className={`${otpWindow ? 'hidden' : ''}`}>
                <p className="text-center my-3 text-xs text-gray-200 tracking-wider">Signin/Login to continue</p>
                <div className="flex bg-white items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-8 rounded">
                    <div className="xl:mx-auto xl:w-full shadow-md p-4 xl:max-w-sm 2xl:max-w-md">
                        <div className="mb-2 flex justify-center"></div>
                        <h2 className="text-center text-2xl font-bold leading-tight text-black">
                            {dontHaveAccount ? 'Sign up for an account' : 'Sign in to your account'}
                        </h2>
                        <form className="mt-8">
                            <div className="space-y-5">
                                {dontHaveAccount && (
                                    <div>
                                        <label className="text-base font-medium text-gray-900">Full name</label>
                                        <div className="mt-2">
                                            <input
                                                placeholder="Full name"
                                                type="text"
                                                className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none text-black"
                                                required={dontHaveAccount}
                                                {...register('name', { required: true })}
                                            />
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <label className="text-base font-medium text-gray-900">Email address</label>
                                    <div className="mt-2">
                                        <input
                                            placeholder="Email"
                                            type="email"
                                            className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none text-black"
                                            required
                                            {...register('email', { required: true })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label className="text-base font-medium text-gray-900">
                                            Password
                                        </label>
                                    </div>
                                    <div className="mt-2 relative">
                                        <input
                                            placeholder="Password"
                                            type={passwordVisible ? 'text' : 'password'}
                                            className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none text-black"
                                            required
                                            {...register('password', { required: true })}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-black focus:outline-none"
                                            onClick={togglePasswordVisibility}
                                        >
                                            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    <div className="flex justify-end mt-2">
                                        <a
                                            className="text-[8px] font-semibold text-black hover:underline"
                                            title=""
                                            href="#"
                                        >
                                            Forgot password?
                                        </a>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                                        type="button"
                                        onClick={handleSubmit(onSubmit)}
                                        disabled={loading}
                                    >
                                        {loading ? 'Signing in...' : 'Get started'}
                                    </button>
                                </div>
                            </div>
                        </form>
                        <div className="mt-3 space-y-3">
                            <p className="mt-2 text-center text-sm text-gray-600">
                                {dontHaveAccount ? (
                                    <>
                                        Don't have an account? &nbsp;
                                        <span className="text-black font-bold cursor-pointer" onClick={toggleAccountType}>
                                            Sign up
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        Already have an account? &nbsp;
                                        <span className="text-black font-bold cursor-pointer" onClick={toggleAccountType}>
                                            Sign in
                                        </span>
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={`${!otpWindow ? 'hidden' : ''}`}>
                <p className="tracking-wide text-xs mb-2">Enter the OTP we have sent to your email</p>
                <div>
                    <input
                        required
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none text-white"
                        type="text"
                        placeholder="Enter OTP"
                        onChange={(e) => setOtp(e.target.value)}
                    />

                    <div className="flex items-center justify-center mb-3 mt-4">
                        <button
                            className=" w-3/5 rounded-md bg-white px-1.5 py-1.5 font-semibold leading-7 text-black hover:bg-white/80"
                            onClick={onOtpSubmit}
                            disabled={loading}
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>

                        <button
                        className=" w-3/5 rounded-md bg-transparent ml-2 px-1.5 py-1.5 font-semibold leading-7 text-white hover:text-gray-300 border-2 border-white hover:border-gray-300"
                        onClick={onOtpResend}
                        disabled={loading}
                        >
                            {loading ? 'Resending...' : 'Resend OTP'}
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AuthBox;