import {Group} from "../_helpers/interfaces";
import {NextFunction, Response} from "express";
const groupService = require('./groups.service');

export const getAllGroups = function (req: any, res: Response, next: NextFunction) {
    groupService.getAllGroups()
        .then((groups: Group[]) => res.json(groups))
        .catch((err: Error) => next(err));
}

export const getGroupById = function (req: any, res: Response, next: NextFunction) {
    groupService.getGroupById(req.params.id)
        .then((group: Group) => group ? res.json(group) : res.sendStatus(404))
        .catch((err: Error) => next(err));
}

export const createGroup = async function (req: any, res: Response, next: NextFunction) {
    const newGroup = req.body.group;
    if(!newGroup) return res.status(401).json({ message: 'No group post data' });

    groupService.createGroup(newGroup)
        .then((group: Group) => group ? res.json(group) : res.sendStatus(404))
        .catch((err: Error) => next(err));
}

export const updateGroup = function (req: any, res: Response, next: NextFunction) {
    res.json({message: 'Group updated'}); //todo

}

export const deleteGroup = function (req: any, res: Response, next: NextFunction) {
    const groupId = req.params.id;
    groupService.deleteGroup(groupId)
        .then((status: boolean) => status ? res.json({message: 'Group deleted'}) : res.sendStatus(404))
        .catch((err: Error) => next(err));
}

