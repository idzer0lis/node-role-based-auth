import {Collection} from "../_helpers/interfaces";
import {NextFunction, Response} from "express";
const collectionService = require('../collections/collections.service');
import {getGroupById} from "../groups/groups.service";

export const getAllCollections = function (req: any, res: Response, next: NextFunction) {
    collectionService.getAllCollections()
        .then((collections: Collection[]) => res.json(collections))
        .catch((err: Error) => next(err));
}

export const getCollectionById = function (req: any, res: Response, next: NextFunction) {
    collectionService.getCollectionById(req.params.id)
        .then((collection: Collection) => collection ? res.json(collection) : res.sendStatus(404))
        .catch((err: Error) => next(err));
}

export const createCollection = async function (req: any, res: Response, next: NextFunction) {
    const newCollection = req.body.collection;
    const group = await getGroupById(req.body.groupId);

    if(!newCollection) return res.status(401).json({ message: 'No collection data' });
    if(!group) return res.status(401).json({ message: 'No group id' });

    collectionService.createCollection(newCollection, group.id)
        .then((collection: Collection) => collection ? res.json(collection) : res.sendStatus(404))
        .catch((err: Error) => next(err));
}

function updateCollection(req: any, res: Response, next: NextFunction) {
    // todo
    res.json({message: 'Collection updated'})
}

export const deleteCollection  = function (req: any, res: Response, next: NextFunction) {
    collectionService.deleteCollection(req.params.id)
        .then((status: boolean) => status ? res.json({message: 'Group deleted'}) : res.sendStatus(404))
        .catch((err: Error) => next(err));
}

