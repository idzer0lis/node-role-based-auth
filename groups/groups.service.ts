const config = require('../config.json');
const jwt = require('jsonwebtoken');
import {User, Role, Group, Collection, Item} from "../_helpers/interfaces";

//hardcoded for simplicity

const item1: Item = {id: 1, name: 'item1'};
const item2: Item = {id: 2, name: 'item2'};
const item3: Item = {id: 3, name: 'item3'};

const collection1: Collection = {id: 1, name: 'Manager`s access collection', items: [item1]};
const collection2: Collection = {id: 2, name: 'Backoffice', items: [item2, item3]};

export const groups: Group[] = [
    { id: 1, name: 'managers', collections: [collection1]},
    { id: 2, name: 'regulars', collections: [collection2] },
];

export async function getAllGroups(): Promise<Group[]> {
    return groups;
}

export async function getGroupById(id: string): Promise<Group> {
    const group = groups.find((g: Group) => g.id === parseInt(id));
    if (!group) return;
    return group;
}

export async function createGroup(group: Group): Promise<Group> {
    this.groups.push(group);
    return group;
}

export async function updateGroup(group: Group): Promise<Group> {
    const _group = groups.find((g: Group) => g.id === group.id);
    if (!_group) return;
    groups[groups.findIndex(el => el.id === _group.id)] = group;
    return Object.assign(group, _group);
}

export async function deleteGroup(id: number): Promise<boolean> {
    let index = groups.findIndex((g: Group) => g.id === id);
    if(index >0 || index==0) {
        groups.splice(index, 1);
        return true;
    }
    return false;

}