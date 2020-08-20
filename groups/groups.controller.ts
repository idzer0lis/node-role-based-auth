import {Group} from "../_helpers/interfaces";
import {NextFunction, Request, Response, Router} from "express";
const express = require('express');
const router: Router = Router();
const groupService = require('./groups.service');
import {authorizeMiddleware, isMyGroupMiddleware, isGroupManagerMiddleware} from "../_helpers/middlewares";

// routes
router.get('/', authorizeMiddleware(['globalManager']), getAllGroups);
router.get('/:id', authorizeMiddleware(), isMyGroupMiddleware(), getGroupById);
router.post('/', authorizeMiddleware(['globalManager', 'manager']), createGroup);
router.put('/:id', authorizeMiddleware(['globalManager', 'manager']), isGroupManagerMiddleware(), updateGroup);
router.delete('/:id', authorizeMiddleware(['globalManager', 'manager']),  isGroupManagerMiddleware(), deleteGroup);
export const groupRoutes: Router = router;

function getAllGroups(req: any, res: Response, next: NextFunction) {
    groupService.getAllGroups()
        .then((groups: Group[]) => res.json(groups))
        .catch((err: Error) => next(err));
}

function getGroupById(req: any, res: Response, next: NextFunction) {
    groupService.getGroupById(req.params.id)
        .then((group: Group) => group ? res.json(group) : res.sendStatus(404))
        .catch((err: Error) => next(err));
}

async function createGroup(req: any, res: Response, next: NextFunction) {
    const newGroup = req.body.group;
    if(!newGroup) return res.status(401).json({ message: 'No group post data' });

    groupService.createGroup(newGroup)
        .then((group: Group) => group ? res.json(group) : res.sendStatus(404))
        .catch((err: Error) => next(err));
}

function updateGroup(req: any, res: Response, next: NextFunction) {
    res.json({message: 'Group updated'}); //todo

}

function deleteGroup(req: any, res: Response, next: NextFunction) {
    const groupId = req.params.id;
    groupService.deleteGroup(groupId)
        .then((status: boolean) => status ? res.json({message: 'Group deleted'}) : res.sendStatus(404))
        .catch((err: Error) => next(err));
}

