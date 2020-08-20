// data hardcoded for simplicity, store in a db for production applications

import {Collection, Group, Item, User} from "../_helpers/interfaces";

const item1: Item = {id: 1, name: 'item1'};
const item2: Item = {id: 2, name: 'item2'};
const item3: Item = {id: 3, name: 'item3'};

const collection1: Collection = {id: 1, name: 'Manager`s access collection', items: [item1]};
const collection2: Collection = {id: 2, name: 'Backoffice', items: [item2, item3]};

export const groups: Group[] = [
    { id: 1, name: 'managers', collections: [collection1]},
    { id: 2, name: 'regulars', collections: [collection2] },
];

export const users: User[] = [
    { id: 1, username: 'manager', password: 'manager', name: 'Manager', role: 'manager', groups: [groups[0]] },
    { id: 2, username: 'user', password: 'user', name: 'User', role: 'regular', groups: [groups[1]] },
    { id: 3, username: 'global-manager', password: 'global-manager', name: 'Global Manager', role: 'globalManager', groups: [groups[0]]}
];