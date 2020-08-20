import {User, Role, Group, Collection, Item} from "../_helpers/interfaces";
const getGroupById = require('../groups/groups.service');
import { groups } from "../data/data.source";

export async function getAllCollections(): Promise<Collection[]> {
    let allCollections = [] as Collection[];
    groups.map( (g: Group) => {
        allCollections.concat(g.collections);
       if (g.collections && g.collections.length) {
            g.collections.map( (c: Collection) => {
                allCollections.push(c);
            })
       }
    });
    return allCollections;
}

export async function getCollectionById(id: string): Promise<Collection> {
    const collections: Collection[] = await getAllCollections();
    const _collection = collections.find((c: Collection) => c.id === parseInt(id));
    if (!_collection) return;
    return _collection;
}

export async function createCollection(collection: Collection, groupId: number): Promise<Collection> {
    const _group = getGroupById(groupId);
    if (!_group) return;
    _group.collections.push(collection);
    groups[groups.findIndex( el => el.id === _group.id)] = _group;
    return collection;
}

export async function updateCollection(collection: Collection, groupId: number): Promise<Collection> {
    const _group = getGroupById(groupId);
    if (!_group) return;
    const _collection = _group.collections.find((c: Collection) => c.id === collection.id);
    if (!_collection) return;
    _group.collections[_group.collections.findIndex( (el: Collection) => el.id === _collection.id)] = collection;

    return collection;
}

export async function deleteCollection(id: number): Promise<boolean> {
    let deleted = false;
    groups.map( (g: Group) => {
        if (g.collections && g.collections.length) {
            let index = g.collections.findIndex((c: Collection) => c.id === id);
            if(index >0 || index==0) {
                g.collections.splice(index, 1);
                deleted = true;
            }
        }
    });
    return deleted;

}