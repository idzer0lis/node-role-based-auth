import { Router } from "express";
import {userRoutes} from './users/users.routes';
import {itemRoutes} from "./items/items.routes";
import {collectionRoutes} from "./collections/collections.routes";
import {groupRoutes} from "./groups/groups.routes";

const router: Router = Router();

router.use('/users', userRoutes);
router.use('groups', groupRoutes);
router.use('/collections', collectionRoutes);
router.use('/items', itemRoutes);

export default router;