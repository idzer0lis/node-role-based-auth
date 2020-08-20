import {NextFunction, Response} from "express";
import {Role} from "./interfaces";
import {getUserById} from "../users/user.service";

const jwt = require('express-jwt');
const { secret } = require('config.json');

export const authorize = function(roles: Role[] = []) {
    // roles param can be a single role string (e.g. Manager or 'Manager')
    // or an array of roles (e.g. [Manager, Regular] or ['Manager', 'Regular'])
    if (typeof roles === 'string') {
        roles = [roles];
    }
    return [
        // authenticate JWT token and attach user to request object (req.user)
        jwt({ secret, algorithms: ['HS256'] }),

        // authorize based on user role
        async (req: any, res: Response, next: NextFunction) => {
            // authentication and authorization successful

            if (roles.length && !roles.includes(req.user.role)) {
                // user's role is not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }

            req.user = await getUserById(req.user.id); // store all user data

            next();
        }
    ];
}