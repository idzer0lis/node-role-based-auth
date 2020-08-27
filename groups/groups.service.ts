import {Group, Collection} from "../_helpers/interfaces";
import { groups } from "../data/data.source";
import {Service} from "../users/users.service";

export interface IGroupService extends Service{
    getGroupByCollectionId(collectionId: string): Promise<Group>
}

export class GroupsService implements IGroupService {
    groups: Group[];

    constructor() {
        this.groups = groups;
    }


    getAll(): Promise<Group[]> {
        return Promise.resolve(this.groups);
    }

    getById(id: string): Promise<Group> {
        const group = this.groups.find((g: Group) => g.id === parseInt(id));
        if (!group) return;
        return Promise.resolve(group);
    }

// only one collection per group
    public getGroupByCollectionId(id: string): Promise<Group> {
        let group = undefined as Group;
        this.groups.map( (g: Group) => {
            if (g.collections && g.collections.length) {
                if(g.collections.find( (c: Collection) => c.id == parseInt(id))) {
                    group = g;
                }
            }
        });

        return Promise.resolve(group);
    }

    create(group: Group): Promise<Group> {
        const lastGroupIndex = this.groups[groups.length -1].id;
        group.id = lastGroupIndex + 1;
        groups.push(group);
        return Promise.resolve(group);
    }

    update(group: Group): Promise<Group> {
        const _group = this.groups.find((g: Group) => g.id === group.id);
        if (!_group) return;
        groups[groups.findIndex(el => el.id === _group.id)] = group;
        const updatedGroup =  Object.assign(group, _group);
        return Promise.resolve(updatedGroup);
    }

    delete(id: string): Promise<boolean> {
        let index = this.groups.findIndex((g: Group) => g.id === parseInt(id));
        if (index > 0 || index == 0) {
            groups.splice(index, 1);
            return Promise.resolve(true);
        }
        return Promise.resolve(false);

    }

}