import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: {
        id: number;
    };
    token?: string;
}

export const authenticateJWT = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        req.token = token; 

        try {
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
            const userId = decoded.userId;

            if (!userId) {
                res.status(403).json({ message: 'Token invalid.' });
                return;
            }

            req.user = { id: userId };
            next();
        } catch (err) {
            console.error(err);
            res.status(403).json({ message: 'Token invalid or expired.' });
            return; 
        }
    } else {
        res.sendStatus(401);
        return;
    }
};