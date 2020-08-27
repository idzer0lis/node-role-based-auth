import App from './app';
import {UsersController} from "./users/users.controller";
import {Service, UsersService} from "./users/users.service";
import 'dotenv/config';
import {validateEnv} from './_helpers/utils';

validateEnv();

const UserService = new UsersService();
const app = new App(
    [
        new UsersController(UserService),
    ],
);

app.listen();