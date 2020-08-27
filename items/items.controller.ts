import {Controller, Item, User} from "../_helpers/interfaces";
import {NextFunction, Request, Response, Router} from "express";
import {getCollectionById} from "../collections/collections.service";
import {ItemsService} from "./items.service";
import {authorizeMiddleware} from "../_helpers/middlewares";
import {Service} from "../users/users.service";

export class ItemsController implements Controller {
    public path = '/items';
    public router = Router();
    itemsService: Service;

    constructor(ItemService: Service) {
        this.itemsService = ItemService;
        this.initializeRoutes();

    }

    private initializeRoutes() {

        this.router.get(`${this.path}`, authorizeMiddleware(['globalManager']), getAllItems);
        this.router.get(`${this.path}/:id`, authorizeMiddleware(), getItemById);
        this.router.post(`${this.path}`, authorizeMiddleware(), createItem);
        this.router.put(`${this.path}:/id`, authorizeMiddleware(), updateItem);
        this.router.delete(`${this.path}/:id`, authorizeMiddleware(), deleteItem);
    }

    getAll (req: any, res: Response, next: NextFunction) {
        this.itemsService.getAll()
            .then((users: User[]) => res.json(users))
            .catch((err: Error) => next(err));
    }

    getById (req: any, res: Response, next: NextFunction) {
        const id = req.params.id;

        this.itemsService.getById(id)
            .then((user: User) => user ? res.json(user) : res.sendStatus(404))
            .catch((err: Error) => next(err));
    }

    async createUser (req: any, res: Response, next: NextFunction) {
        const newUser = req.body.user;

        if(!newUser) return res.status(401).json({ message: 'No user post data' });

        this.itemsService.create(newUser)
            .then((user: User) => user ? res.json(user) : res.sendStatus(404))
            .catch((err: Error) => next(err));
    }

    updateUser (req: any, res: Response, next: NextFunction) {
        const newUserData = req.body.user;

        if(!newUserData) return res.status(401).json({ message: 'No user post data' });

        this.itemsService.update(newUserData)
            .then((user: User) => user ? res.json(user) : res.sendStatus(404))
            .catch((err: Error) => next(err));
    }

    deleteUser (req: any, res: Response, next: NextFunction) {
        const id = req.params.id;

        this.itemsService.delete(id)
            .then((status: boolean) => status ? res.json({message: 'User deleted'}) : res.sendStatus(404))
            .catch((err: Error) => next(err));
    }

}

export const getAllItems = function (req: any, res: Response, next: NextFunction) {
    this.itemService.getAll()
        .then((items: Item[]) => res.json(items))
        .catch((err: Error) => next(err));
}

export const getItemById  = function (req: any, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);

    this.itemService.getItem(id)
        .then((item: Item) => item ? res.json(item) : res.sendStatus(404))
        .catch((err: Error) => next(err));
}

export const createItem = async function (req: any, res: Response, next: NextFunction) {
    const newItem = req.body.item;
    const collection = await getCollectionById(req.body.groupId);

    if(!newItem) return res.status(401).json({ message: 'No collection data' });
    if(!collection) return res.status(401).json({ message: 'No group id' });

    this.itemService.create(newItem, collection.id)
        .then((item: Item) => item ? res.json(item) : res.sendStatus(404))
        .catch((err: Error) => next(err));
}

export const updateItem = function (req: any, res: Response, next: NextFunction) {
    // todo
}

export const deleteItem = function (req: any, res: Response, next: NextFunction) {
    const currentUser = req.user;
    const id = parseInt(req.params.id);

    this.itemService.delete(id)
        .then((status: boolean) => status ? res.json({message: 'Group deleted'}) : res.sendStatus(404))
        .catch((err: Error) => next(err));
}

