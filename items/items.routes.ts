import {authorizeMiddleware} from "../_helpers/middlewares";
import {Router} from "express";
import {createItem, deleteItem, getAllItems, getItemById, updateItem} from "./items.controller";

const router: Router = Router();

router.get('/', authorizeMiddleware(['globalManager']), getAllItems);
router.get('/:id', authorizeMiddleware(), getItemById);
router.post('/', authorizeMiddleware(), createItem);
router.put('/:id', authorizeMiddleware(), updateItem);
router.delete('/:id', authorizeMiddleware(), deleteItem);

export const itemRoutes: Router = router;