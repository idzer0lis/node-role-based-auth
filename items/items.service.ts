import {Group, Collection, Item} from "../_helpers/interfaces";
import {Service} from "../users/users.service";
import {groups} from "../data/data.source";

export class ItemsService implements Service {

    collectionService: Service;
    groups: Group[];

    constructor(CollectionService: Service) {
        this.collectionService = CollectionService;
        this.groups = groups;

    }


    getAll(): Promise<Item[]> {
        let allItems = [] as Item[];
        this.groups.map( (g: Group) => {
            if (g.collections && g.collections.length) {
                g.collections.map( (c: Collection) => {
                    if (c.items && c.items.length) allItems.concat(c.items);
                });
            }
        });
        return Promise.resolve(allItems);
    }

    async getById(id: string): Promise<Item> {
        const items: Item[] = await this.getAll();
        const _item = items.find((i: Item) => i.id === parseInt(id));
        if (!_item) return;
        return Promise.resolve(_item);
    }

    async create (item: Item, collectionId: number): Promise<Item> {
        const _collection = await this.collectionService.getById(collectionId.toString());
        if (!_collection) return;
        _collection.items.push(item);
        //const _group = groups[groups.findIndex( el => el.id === _group.id)] = _group;
        return Promise.resolve(item);
    }

    //todo
    update(item: Item, groupId: number): Promise<Item> {
        return Promise.resolve(item);
    }

    delete(id: string): Promise<boolean> {
        let deleted = false;
        groups.map( (g: Group) => {
            if (g.collections && g.collections.length) {
                g.collections.map ( (c: Collection) => {
                    if (c.items && c.items.length) {
                        let index = c.items.findIndex((i: Item) => i.id === parseInt(id));
                        if(index >0 || index==0) {
                            c.items.splice(index, 1);
                            deleted = true;
                        }
                    }
                })
            }
        });
        return Promise.resolve(deleted);

    }
}
