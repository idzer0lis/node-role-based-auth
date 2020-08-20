import {User, Role, Group, Collection, Item} from "../_helpers/interfaces";

const getGroupById = require('../groups/groups.service');

//hardcoded for simplicity

const item1: Item = {id: 1, name: 'item1'};
const item2: Item = {id: 2, name: 'item2'};
const item3: Item = {id: 3, name: 'item3'};

const collection1: Collection = {id: 1, name: 'Manager`s access collection', items: [item1]};
const collection2: Collection = {id: 2, name: 'Backoffice', items: [item2, item3]};

const groups: Group[] = [
    { id: 1, name: 'managers', collections: [collection1]},
    { id: 2, name: 'regulars', collections: [collection2] },
];

module.exports = {
    getAllCollections,
    getCollectionById,
    createCollection,
    updateCollection,
    deleteCollection
};

async function getAllCollections(): Promise<Collection[]> {
    let allCollections = [] as Collection[];
    groups.map( (g: Group) => {
       if (g.collections && g.collections.length) allCollections.concat(g.collections);
    });
    return allCollections;
}

async function getCollectionById(id: string): Promise<Collection> {
    const collections: Collection[] = await getAllCollections();
    const _collection = collections.find((c: Collection) => c.id === parseInt(id));
    if (!_collection) return;
    return _collection;
}

async function createCollection(collection: Collection, groupId: number): Promise<Collection> {
    const _group = getGroupById(groupId);
    if (!_group) return;
    _group.collections.push(collection);
    groups[groups.findIndex( el => el.id === _group.id)] = _group;
    return collection;
}

async function updateCollection(collection: Collection, groupId: number): Promise<Collection> {
    const _group = getGroupById(groupId);
    if (!_group) return;
    const _collection = _group.collections.find((c: Collection) => c.id === collection.id);
    if (!_collection) return;
    _group.collections[_group.collections.findIndex( el => el.id === _collection.id)] = collection;

    return collection;
}

async function deleteCollection(id: number): Promise<boolean> {
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