import {NextFunction, Response} from "express";
import {Role, Group} from "./interfaces";
import {IUserService, UsersService} from "../users/users.service";
import {isGlobalManager, isManager, isMyCollection, isMyGroup, userHasGroups} from "./utils";
import {GroupsService, IGroupService} from "../groups/groups.service";

const jwt = require('express-jwt');
import {secret} from "../config";

export const authorizeMiddleware = function(roles: Role[] = []) {
    // roles param can be a single role string (e.g. Manager or 'Manager')
    // or an array of roles (e.g. [Manager, Regular] or ['Manager', 'Regular'])
    if (typeof roles === 'string') {
        roles = [roles];
    }
    return [
        // authenticate JWT token and attach user to request object (req.user)
        jwt({ secret: secret, algorithms: ['HS256'] }),

        // authorize based on user role
        async (req: any, res: Response, next: NextFunction) => {
            // authentication and authorization successful

            if (roles.length && !roles.includes(req.user.role)) {
                // user's role is not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const usersService: IUserService = new UsersService();

            req.user = await usersService.getById(req.user.id); // store all user data

            next();
        }
    ];
}

//intentional error messages, useful in dev, not okay in prod.

export const isMyGroupMiddleware = function () {
    return [
        async (req: any, res: Response, next: NextFunction) => {

            if (isGlobalManager(req.user)) {
                return next();
            }

            const _groupId = req.params.id;
            if(!isMyGroup(req.user, _groupId)) {
                return res.status(401).json({ message: 'Unauthorized because not your group' })
            }

            return next();
        }
    ];
}

export const isGroupManagerMiddleware = function () {
    return [
        async (req: any, res: Response, next: NextFunction) => {

            if (isGlobalManager(req.user)) {
                return next();
            }

            if(!isManager(req.user)) {
                return res.status(401).json({ message: 'Unauthorized cuz no manager' })
            }

            const _groupId = req.params.id;
            if(!isMyGroup(req.user, _groupId)) {
                return res.status(401).json({ message: 'Unauthorized cuz not your group to manage' })
            }

            return next();
        }
    ]
}

export const isMyCollectionMiddleware = function () {
    return [
        async (req: any, res: Response, next: NextFunction) => {

            if (isGlobalManager(req.user)) {
                return next();
            }

            const _collectionId = req.params.id;

            // check to see if the collection sits in the group of the manager
            let canManageCollection = false;
            if (isManager(req.user)) {
                const groupService: IGroupService = new GroupsService();
                const _collectionGroup: Group | undefined = await groupService.getGroupByCollectionId(_collectionId);
                if (_collectionGroup) canManageCollection = isMyGroup(req.user, _collectionGroup.id);
            }

            if (!canManageCollection) {
                // check if its own collection
                if(!isMyCollection(req.user, _collectionId)) {
                    return res.status(401).json({ message: 'Unauthorized cuz not your collection to manage' })
                }
            }

            return next();
        }
    ]
}

export const errorHandlerMiddleware =  function (err: any, req: any, res: any, next: any) {
    if (typeof (err) === 'string') {
        // custom application error
        return res.status(400).json({ message: err });
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({ message: 'Invalid Token' });
    }

    // default to 500 server error
    return res.status(500).json({ message: err.message });
}

