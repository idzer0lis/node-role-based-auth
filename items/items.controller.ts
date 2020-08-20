import {User, Role, Group, Collection, Item, UserRO} from "../_helpers/interfaces";
import {NextFunction, Request, Response, Router} from "express";

const express = require('express');
const router: Router = Router();
const itemService = require('../items/items.service');

import {authorizeMiddleware} from "../_helpers/authorize";

import {isGlobalManager} from "../_helpers/utils";
import {getCollectionById} from "../collections/collections.service";


// routes
router.get('/', authorizeMiddleware(['globalManager']), getAllItems);
router.get('/:id', authorizeMiddleware(), getItemById);
router.post('/', authorizeMiddleware(), createItem);
router.put('/:id', authorizeMiddleware(), updateItem);
router.delete('/:id', authorizeMiddleware(), deleteItem);
export const collectionRoutes: Router = router;

function getAllItems(req: any, res: Response, next: NextFunction) {
    const currentUser = req.user;
    if (!isGlobalManager(currentUser)) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    itemService.getAllItems()
        .then((items: Item[]) => res.json(items))
        .catch((err: Error) => next(err));
}

function getItemById(req: any, res: Response, next: NextFunction) {
    const currentUser = req.user;
    const id = parseInt(req.params.id);

    // only global admin and own user can access
    if(isGlobalManager(currentUser) || id === currentUser.id) {
        itemService.getCollectionById(req.params.id)
            .then((item: Item) => item ? res.json(item) : res.sendStatus(404))
            .catch((err: Error) => next(err));
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

async function createItem(req: any, res: Response, next: NextFunction) {
    const currentUser = req.user;
    const newItem = req.body.item;
    const collection = await getCollectionById(req.body.groupId);

    if(!newItem) return res.status(401).json({ message: 'No collection data' });
    if(!collection) return res.status(401).json({ message: 'No group id' });

    // only allow global managers to create groups
    if (isGlobalManager(currentUser)) {
        itemService.createItem(newItem, collection.id)
            .then((item: Item) => item ? res.json(item) : res.sendStatus(404))
            .catch((err: Error) => next(err));
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

function updateItem(req: any, res: Response, next: NextFunction) {
    // todo
}

function deleteItem(req: any, res: Response, next: NextFunction) {
    const currentUser = req.user;
    const id = parseInt(req.params.id);

    if (isGlobalManager(currentUser)) {
        itemService.deleteCollection(id)
            .then((status: boolean) => status ? res.json({message: 'Group deleted'}) : res.sendStatus(404))
            .catch((err: Error) => next(err));
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

