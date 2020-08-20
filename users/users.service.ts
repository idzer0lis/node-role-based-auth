const config = require('../config.json');
const jwt = require('jsonwebtoken');
import {User, UserRO} from "../_helpers/interfaces";
import {users, groups} from "../data/data.source";


export async function authenticate({ username, password }: any): Promise<any> {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const token = jwt.sign({ id: user.id, role: user.role, groups: groups }, config.secret);
        const { password, ...userWithoutPassword } = user;
        return {
            ...userWithoutPassword,
            token
        };
    }
}

export async function getAllUsers() {
    return users.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
}

export async function getUserById(id: string): Promise<UserRO> {
    const user = users.find(u => u.id === parseInt(id));
    if (!user) return;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

export async function createUser(user: User): Promise<UserRO> {
    //increment the id before adding the user
    const lastUserId = users[users.length -1].id;
    user.id = lastUserId + 1;
    users.push(user);
    delete user.password;
    return user;
}

export async function updateUser(user: User) {
    const _user = users.find(u => u.id === user.id);
    if (!_user) return;
    users[users.findIndex(el => el.id === _user.id)] = _user;
    return Object.assign(user, _user);
}

export async function deleteUser(id: number): Promise<boolean> {
    let index = users.findIndex((u: User) => u.id === id);
    if(index >0 || index==0) {
        users.splice(index, 1);
        return true;
    }
    return false;
}