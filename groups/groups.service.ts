const config = require('../config.json');
const jwt = require('jsonwebtoken');
import {Group, Collection} from "../_helpers/interfaces";
import { groups } from "../data/data.source";

export async function getAllGroups(): Promise<Group[]> {
    return groups;
}

export async function getGroupById(id: string): Promise<Group> {
    const group = groups.find((g: Group) => g.id === parseInt(id));
    if (!group) return;
    return group;
}

// only one collection per group
export async function getGroupByCollectionId(id: string): Promise<Group> {
    let group = undefined as Group;
    groups.map( (g: Group) => {
       if (g.collections && g.collections.length) {
           if(g.collections.find( (c: Collection) => c.id == parseInt(id))) {
               group = g;
           }
       }
    });

    return group;
}

export async function createGroup(group: Group): Promise<Group> {
    const lastGroupIndex = groups[groups.length -1].id;
    group.id = lastGroupIndex + 1;
    groups.push(group);
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