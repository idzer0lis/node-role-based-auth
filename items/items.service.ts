import {User, Role, Group, Collection, Item} from "../_helpers/interfaces";

const getCollectionById = require('../collections/collections.service');

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
    getAllItems,
    getCollectionById,
    createItem,
    updateItem,
    deleteItem
};

async function getAllItems(): Promise<Item[]> {
    let allItems = [] as Item[];
    groups.map( (g: Group) => {
        if (g.collections && g.collections.length) {
            g.collections.map( (c: Collection) => {
                if (c.items && c.items.length) allItems.concat(c.items);
            });
        }
    });
    return allItems;
}

async function getItemId(id: string): Promise<Item> {
    const items: Item[] = await getAllItems();
    const _item = items.find((i: Item) => i.id === parseInt(id));
    if (!_item) return;
    return _item;
}

// TODO

async function createItem(item: Item, collectionId: number): Promise<Item> {
    const _collection = getCollectionById(collectionId);
    if (!_collection) return;
    _collection.items.push(item);
    //const _group = groups[groups.findIndex( el => el.id === _group.id)] = _group;
    return item;
}

async function updateItem(item: Item, groupId: number): Promise<Item> {
    return item;
}

async function deleteItem(id: number): Promise<boolean> {
    let deleted = false;
    groups.map( (g: Group) => {
        if (g.collections && g.collections.length) {
           g.collections.map ( (c: Collection) => {
               if (c.items && c.items.length) {
                   let index = c.items.findIndex((i: Item) => i.id === id);
                   if(index >0 || index==0) {
                       c.items.splice(index, 1);
                       deleted = true;
                   }
               }
           })
        }
    });
    return deleted;

}