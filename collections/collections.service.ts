import {User, Role, Group, Collection, Item} from "../_helpers/interfaces";
import { groups } from "../data/data.source";
import {Service} from "../users/users.service";
import {IGroupService, GroupsService} from "../groups/groups.service";

export class CollectionsService implements Service {
    groups: Group[];
    groupService: IGroupService;
    constructor(GroupsService: IGroupService) {
        this.groups = groups;
        this.groupService = GroupsService;
    }

    getAll(): Promise<Collection[]> {
        let allCollections = [] as Collection[];
        this.groups.map( (g: Group) => {
            allCollections.concat(g.collections);
            if (g.collections && g.collections.length) {
                g.collections.map( (c: Collection) => {
                    allCollections.push(c);
                })
            }
        });
        return Promise.resolve(allCollections);
    }

    async getById(id: string): Promise<Collection> {
        const collections: Collection[] = await this.getAll();
        const _collection = collections.find((c: Collection) => c.id === parseInt(id));
        if (!_collection) return;
        return Promise.resolve(_collection);
    }

    async create(collection: Collection, groupId: number): Promise<Collection> {
        const _group = await this.groupService.getById(groupId.toString());
        if (!_group) return;
        _group.collections.push(collection);
        this.groups[groups.findIndex( el => el.id === _group.id)] = _group;
        return Promise.resolve(collection);
    }

    async update(collection: Collection, groupId: number): Promise<Collection> {
        const _group = await this.groupService.getById(groupId.toString());
        if (!_group) return;
        const _collection = _group.collections.find((c: Collection) => c.id === collection.id);
        if (!_collection) return;
        _group.collections[_group.collections.findIndex( (el: Collection) => el.id === _collection.id)] = collection;

        return Promise.resolve(collection);
    }

    delete(id: string): Promise<boolean> {
        let deleted = false;
        groups.map( (g: Group) => {
            if (g.collections && g.collections.length) {
                let index = g.collections.findIndex((c: Collection) => c.id === parseInt(id));
                if(index >0 || index==0) {
                    g.collections.splice(index, 1);
                    deleted = true;
                }
            }
        });
        return Promise.resolve(deleted);

    }
}