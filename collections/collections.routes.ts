import {Router} from "express";

import {authorizeMiddleware, isMyCollectionMiddleware} from "../_helpers/middlewares";
import {createCollection, deleteCollection, getAllCollections, getCollectionById} from "./collections.controller";

const router: Router = Router();


router.get('/', authorizeMiddleware(['globalManager']), getAllCollections);
router.get('/:id', authorizeMiddleware(), isMyCollectionMiddleware(), getCollectionById);
router.post('/', authorizeMiddleware(), isMyCollectionMiddleware(), createCollection);
//router.put('/:id', authorizeMiddleware(), isMyCollectionMiddleware(), updateCollection);
router.delete('/:id', authorizeMiddleware(), isMyCollectionMiddleware(), deleteCollection);

export const collectionRoutes: Router = router;