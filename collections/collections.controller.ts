import {User, Role, Group, Collection, Item, UserRO} from "../_helpers/interfaces";
import {NextFunction, Request, Response, Router} from "express";

const express = require('express');
const router: Router = Router();
const collectionService = require('../collections/collections.service');

import {authorizeMiddleware, isMyCollectionMiddleware} from "../_helpers/authorize";
import {getGroupById} from "../groups/groups.service";


// routes
router.get('/', authorizeMiddleware(['globalManager']), getAllCollections);
router.get('/:id', authorizeMiddleware(), isMyCollectionMiddleware(), getCollectionById);
router.post('/', authorizeMiddleware(), isMyCollectionMiddleware(), createCollection);
router.put('/:id', authorizeMiddleware(), isMyCollectionMiddleware(), updateCollection);
router.delete('/:id', authorizeMiddleware(), isMyCollectionMiddleware(), deleteCollection);
export const collectionRoutes: Router = router;

function getAllCollections(req: any, res: Response, next: NextFunction) {
    collectionService.getAllCollections()
        .then((collections: Collection[]) => res.json(collections))
        .catch((err: Error) => next(err));
}

function getCollectionById(req: any, res: Response, next: NextFunction) {
    collectionService.getCollectionById(req.params.id)
        .then((collection: Collection) => collection ? res.json(collection) : res.sendStatus(404))
        .catch((err: Error) => next(err));
}

async function createCollection(req: any, res: Response, next: NextFunction) {
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

function deleteCollection(req: any, res: Response, next: NextFunction) {
    collectionService.deleteCollection(req.params.id)
        .then((status: boolean) => status ? res.json({message: 'Group deleted'}) : res.sendStatus(404))
        .catch((err: Error) => next(err));
}

