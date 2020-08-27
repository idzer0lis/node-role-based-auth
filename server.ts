import App from './app';
import {UsersController} from "./users/users.controller";
import {IUserService, Service, UsersService} from "./users/users.service";
import 'dotenv/config';
import {validateEnv} from './_helpers/utils';
import {GroupsController} from "./groups/groups.controller";
import {CollectionsController} from "./collections/collections.controller";
import {ItemsController} from "./items/items.controller";
import {GroupsService, IGroupService} from "./groups/groups.service";
import {ItemsService} from "./items/items.service";
import { CollectionsService} from "./collections/collections.service";

validateEnv();

const usersService: IUserService = new UsersService();
const groupService: IGroupService = new GroupsService();
const collectionService: Service = new CollectionsService(groupService)
const itemsService: Service = new ItemsService(collectionService);
const app = new App(
    [
        new UsersController(usersService),
        new GroupsController(groupService),
        new CollectionsController(groupService),
        new ItemsController(itemsService, groupService)
    ],
);

app.listen();