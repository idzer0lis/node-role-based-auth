import {authorizeMiddleware} from "../_helpers/middlewares";
import {Router} from "express";
import {authenticate, createUser, deleteUser, getAllUsers, getUserById, updateUser} from "./users.controller";

const router: Router = Router();

router.post('/authenticate', authenticate);     // public route
router.get('/', authorizeMiddleware(['globalManager']), getAllUsers);
router.get('/:id', authorizeMiddleware(), getUserById);       // all authenticated users
router.post('/', authorizeMiddleware(['globalManager']), createUser);
router.put('/:id', authorizeMiddleware(), updateUser);
router.delete('/:id', authorizeMiddleware(['globalManager', 'manager']), deleteUser);

export const userRoutes: Router = router;