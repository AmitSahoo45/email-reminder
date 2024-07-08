import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';

import { userDetail } from '../types/userInterfaces';

const SALT_ROUNDS: number = 10;

export const emailIsValid = (email: string): boolean => validator.isEmail(email);

export const hashPassword = (password: string) => bcrypt.hash(password, SALT_ROUNDS);
export const comparePassword = (password: string, hash: string) => bcrypt.compare(password, hash);

export const generateToken = (user: userDetail) => jwt.sign(user, process.env.JWT_SECRET as string, { expiresIn: '30d' });
export const verifyToken = (token: string) => jwt.verify(token, process.env.JWT_SECRET as string);

export const generateId = (): string => uuidv4();

export const generateOTP = (): string => uuidv4().replace(/-/g, '').slice(0, 6);
