import {Controller, Item, User} from "../_helpers/interfaces";
import {NextFunction, Request, Response, Router} from "express";
import {ItemsService} from "./items.service";
import {authorizeMiddleware} from "../_helpers/middlewares";
import {Service} from "../users/users.service";
import {CollectionsService} from "../collections/collections.service";
import {GroupsService, IGroupService} from "../groups/groups.service";

export class ItemsController implements Controller {
    public path = '/items';
    public router = Router();
    itemService: Service;
    collectionService: Service;

    constructor(ItemService: Service, GroupsService: IGroupService) {
        this.itemService = ItemService;
        this.collectionService = new CollectionsService(GroupsService);
        this.initializeRoutes();

    }

    private initializeRoutes() {

        this.router.get(`${this.path}`, authorizeMiddleware(['globalManager']), this.getAll);
        this.router.get(`${this.path}/:id`, authorizeMiddleware(), this.getById);
        this.router.post(`${this.path}`, authorizeMiddleware(), this.create);
        this.router.put(`${this.path}:/id`, authorizeMiddleware(), this.update);
        this.router.delete(`${this.path}/:id`, authorizeMiddleware(), this.delete);
    }

    getAll (req: any, res: Response, next: NextFunction) {
        this.itemService.getAll()
            .then((items: Item[]) => res.json(items))
            .catch((err: Error) => next(err));
    }

    getById (req: any, res: Response, next: NextFunction) {
        const id = req.params.id;

        this.itemService.getById(id)
            .then((item: Item) => item ? res.json(item) : res.sendStatus(404))
            .catch((err: Error) => next(err));
    }

    async create (req: any, res: Response, next: NextFunction) {
        const newItem = req.body.item;
        const collection = await this.collectionService.getById(req.body.groupId);

        if(!newItem) return res.status(401).json({ message: 'No collection data' });
        if(!collection) return res.status(401).json({ message: 'No group id' });

        this.itemService.create(newItem, collection.id)
            .then((item: Item) => item ? res.json(item) : res.sendStatus(404))
            .catch((err: Error) => next(err));
    }

    update (req: any, res: Response, next: NextFunction) {
        // todo
    }

    delete (req: any, res: Response, next: NextFunction) {
        const id = req.params.id;

        this.itemService.delete(id)
            .then((status: boolean) => status ? res.json({message: 'Group deleted'}) : res.sendStatus(404))
            .catch((err: Error) => next(err));
    }


}


