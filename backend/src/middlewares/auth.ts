import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../utils/auth';

export interface CustomRequest extends Request {
    user?: any;
}

const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    const { token } = req.cookies;

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const payload = verifyToken(token);
        req.user = payload;
        next();
    } catch (error: unknown) {
        if (error instanceof Error)
            return res.status(500).json({ message: error.message });

        return res.status(500).json({ message: 'An unexpected error occurred.' });
    }
}

export default authenticateToken;