// export enum Role  {
//     'globalManager',
//     'regular',
//     'manager'
// }

export type Role =  "globalManager" | "manager" | "regular";

export interface User  {
    id: number;
    username: string;
    password: string;
    name: string;
    role: Role;
    groups: Group[] | null;
}

// user response object, like the user without password
export interface UserRO  {
    id: number;
    username: string;
    name: string;
    role: Role;
    groups: Group[] | null;
}

export interface Group {
    id: number;
    name: string;
    collections: Collection[];
}

export interface Collection {
    id: number;
    name: string;
    items: Item[] | null;
}

export interface Item {
    id: number;
    name: string;
}

/*

Users can belong to multiple groups or be a global manager
  A group can link to multiple collections
  A collection can belong to a single group
  Items belong to a single collection


GroupSchema = {
    name: String,
    collectionIds: ArrayOf(String),
};

CollectionSchema = {
    name: String,
};

ItemSchema = {
    name: String,
    parentId: String, /// collection id
}
*/