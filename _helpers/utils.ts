import {Collection, Group, Item, Role, User} from "./interfaces";

export const isManager =  function (user: User): boolean {
    return user.role === 'manager';
}

export const isGlobalManager =  function (user: User): boolean {
    return user.role === 'globalManager';
}

export const userHasGroups = function (user: User): boolean {
    return !!user.groups
}

export const isMyGroup = function (user: User, groupId: number): boolean {
    if (!userHasGroups(user)) return false;
    return user.groups.some( (g: Group) => g.id == groupId);
}

export const isMyCollection = function (user: User, collectionId: number): boolean {
    if (!userHasGroups(user)) return false;
    let isMine = false;
    user.groups.map( (g: Group) => {
        if (g.collections && g.collections.length) {
            isMine = g.collections.some( (c: Collection) => c.id == collectionId);
        }
    });
    return isMine;
}

export const isMyItem = function (user: User, item: Item): boolean {
    if (!userHasGroups(user)) return false;
    let isMine = false;
    user.groups.map( (g: Group) => {
        if (g.collections && g.collections.length) {

            g.collections.map ( (c: Collection) => {
                isMine = c.items.some( (i: Item) => i.id === item.id);
            })
        }
    });
    return isMine;
}