import {Router} from "express";
import {authorizeMiddleware, isGroupManagerMiddleware, isMyGroupMiddleware} from "../_helpers/middlewares";
import {createGroup, deleteGroup, getAllGroups, getGroupById, updateGroup} from "./groups.controller";

const router: Router = Router();

router.get('/', authorizeMiddleware(['globalManager']), getAllGroups);
router.get('/:id', authorizeMiddleware(), isMyGroupMiddleware(), getGroupById);
router.post('/', authorizeMiddleware(['globalManager', 'manager']), createGroup);
router.put('/:id', authorizeMiddleware(['globalManager', 'manager']), isGroupManagerMiddleware(), updateGroup);
router.delete('/:id', authorizeMiddleware(['globalManager', 'manager']),  isGroupManagerMiddleware(), deleteGroup);

export const groupRoutes: Router = router;