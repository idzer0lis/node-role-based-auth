import {secret} from '../config';
const jwt = require('jsonwebtoken');
import {User, UserLoginRO, UserRO} from "../_helpers/interfaces";
import {users, groups} from "../data/data.source";

// todo move
export interface ILogin {
    username: string;
    password: string;
}

// intentional use of promises. Easier to plugin an persistance system
export interface Service {
    getAll(): Promise<any[]>
    getById(id: string): Promise<any>
    create(entity: any, relationId?: number): Promise<any>
    update(entity: any, relationId?: number): Promise<any>
    delete(id: string): Promise<boolean>;
}

export interface IUserService extends Service{
    authenticate({}: ILogin): Promise<UserLoginRO>
}

export class UsersService implements IUserService {

    users: User[];

    constructor() {
        this.users = users;
    }

    async authenticate({username, password}: ILogin): Promise<UserLoginRO> {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            const token = jwt.sign({id: user.id, role: user.role, groups: groups}, secret);
            const {password, ...userWithoutPassword} = user;
            return {
                ...userWithoutPassword,
                token
            };
        }
    }

    getAll(): Promise<UserRO[]> {
        const users = this.users.map(u => {
            const {password, ...userWithoutPassword} = u;
            return userWithoutPassword;
        });
        return Promise.resolve(users); // simulate async like reading from db
    }

    getById(id: string): Promise<UserRO> {
        const user = users.find(u => u.id === parseInt(id));
        if (!user) return;
        const {password, ...userWithoutPassword} = user;
        return Promise.resolve(userWithoutPassword);
    }

    create(user: User): Promise<UserRO> {
        //increment the id before adding the user
        const lastUserId = users[users.length - 1].id;
        user.id = lastUserId + 1;
        users.push(user);
        delete user.password;
        return Promise.resolve(user);
    }

    update(user: User): Promise<UserRO> {
        const _user = users.find(u => u.id === user.id);
        if (!_user) return;
        users[users.findIndex(el => el.id === _user.id)] = _user;
        const updatedUser = Object.assign(user, _user);
        return Promise.resolve(updatedUser);
    }

    delete(id: string): Promise<boolean> {
        let index = users.findIndex((u: User) => u.id === parseInt(id));
        if (index > 0 || index == 0) {
            users.splice(index, 1);
            return Promise.resolve(true);
        }
        return Promise.resolve(false);
    }

}
