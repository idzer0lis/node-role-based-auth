import {User, Role, Group, Collection, Item, UserRO} from "../_helpers/interfaces";
import {NextFunction, Request, Response, Router} from "express";

const express = require('express');
const router: Router = Router();
const userService = require('./user.service');

import {authorize} from "../_helpers/authorize";

import {isManager, isGlobalManager, isMyGroup} from "../_helpers/utils";

import { getGroupById} from "../groups/groups.service";

// routes
router.post('/authenticate', authenticate);     // public route
router.get('/', authorize(['globalManager']), getAllUsers); // global only
router.get('/:id', authorize(), getUserById);       // all authenticated users
router.post('/', authorize(), createUser);
router.put('/:id', authorize(), updateUser);
router.delete('/:id', authorize(), deleteUser);
export const userRoutes: Router = router;

function authenticate(req: Request, res: Response, next: NextFunction) {
    userService.authenticate(req.body)
        .then((user: any) => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch((err: Error) => next(err));
}

function getAllUsers(req: any, res: Response, next: NextFunction) {
    const currentUser = req.user;
    if (!isGlobalManager(currentUser)) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    userService.getAllUsers()
        .then((users: User[]) => res.json(users))
        .catch((err: Error) => next(err));
}

function getUserById(req: any, res: Response, next: NextFunction) {
    const currentUser = req.user;
    const id = parseInt(req.params.id);

    // only global admin and own user can access
    if(isGlobalManager(currentUser) || id === currentUser.id) {
        userService.getUserById(req.params.id)
            .then((user: User) => user ? res.json(user) : res.sendStatus(404))
            .catch((err: Error) => next(err));
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

async function createUser(req: any, res: Response, next: NextFunction) {
    const currentUser = req.user;
    const newUser = req.body.user;

    if(!newUser) return res.status(401).json({ message: 'No user post data' });

    // only allow global managers to create users without a specific group.
    // normal managers can only create users in their group.
    if (isGlobalManager(currentUser)) {
        userService.createUser(newUser)
            .then((user: User) => user ? res.json(user) : res.sendStatus(404))
            .catch((err: Error) => next(err));

    } else if(isManager(currentUser)) {
        if (!req.body.groupId) {
            return res.status(401).json({ message: 'No user group data' });
        } else {

            const _group = await getGroupById(req.body.groupId)


            if (!isMyGroup(currentUser, _group)) {
                return res.status(401).json({ message: 'No access to this group' });
            } else {
                newUser.groups = [_group];
                userService.createUser(newUser)
                    .then((user: User) => user ? res.json(user) : res.sendStatus(404))
                    .catch((err: Error) => next(err));
            }
        }
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }


}

function updateUser(req: any, res: Response, next: NextFunction) {
    const currentUser = req.user;
    const newUserData = req.body.user;
    const id = parseInt(req.params.id);

    if(!newUserData) return res.status(401).json({ message: 'No user post data' });

    if (id !== currentUser.id ||  !isManager(currentUser) || !isGlobalManager(currentUser)) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    userService.updateUser(newUserData)
        .then((user: User) => user ? res.json(user) : res.sendStatus(404))
        .catch((err: Error) => next(err));
}

function deleteUser(req: any, res: Response, next: NextFunction) {
    const currentUser = req.user;
    const id = parseInt(req.params.id);

    if (isGlobalManager(currentUser) || id === currentUser.id) {
        userService.deleteUser(id)
            .then((status: boolean) => status ? res.json({message: 'User deleted'}) : res.sendStatus(404))
            .catch((err: Error) => next(err));
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }


}

