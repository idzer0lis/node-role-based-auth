import {Collection, Controller, Group} from "../_helpers/interfaces";
import {NextFunction, Response, Router} from "express";
const collectionService = require('../collections/collections.service');
import {GroupsService, IGroupService} from "../groups/groups.service";
import {authorizeMiddleware, isMyCollectionMiddleware} from "../_helpers/middlewares";

export class CollectionsController implements Controller {
    public path = '/collections';
    public router: Router = Router();
    groupsService: IGroupService;

    constructor(GroupsService: IGroupService) {
        this.groupsService = GroupsService;
        this.initializeRoutes();
    }

    private initializeRoutes() {

        this.router.get(`${this.path}`, authorizeMiddleware(['globalManager']), this.getAll)
        this.router.get(`${this.path}/:id`, authorizeMiddleware(), isMyCollectionMiddleware(), this.getById);
        this.router.post(`${this.path}`, authorizeMiddleware(), isMyCollectionMiddleware(), this.create);
        this.router.put(`${this.path}/:id`, authorizeMiddleware(), isMyCollectionMiddleware(), this.update);
        this.router.delete(`${this.path}/:id`, authorizeMiddleware(), isMyCollectionMiddleware(), this.delete);

    }

    getAll (req: any, res: Response, next: NextFunction) {
        collectionService.getAllCollections()
            .then((collections: Collection[]) => res.json(collections))
            .catch((err: Error) => next(err));
    }

    getById (req: any, res: Response, next: NextFunction) {
        collectionService.getCollectionById(req.params.id)
            .then((collection: Collection) => collection ? res.json(collection) : res.sendStatus(404))
            .catch((err: Error) => next(err));
    }

    async create (req: any, res: Response, next: NextFunction) {
        const newCollection = req.body.collection;
        const group: Group = await this.groupsService.getById(req.body.groupId);

        if(!newCollection) return res.status(401).json({ message: 'No collection data' });
        if(!group) return res.status(401).json({ message: 'No group id' });

        collectionService.createCollection(newCollection, group.id)
            .then((collection: Collection) => collection ? res.json(collection) : res.sendStatus(404))
            .catch((err: Error) => next(err));
    }

    update (req: any, res: Response, next: NextFunction) {
        // todo
        res.json({message: 'Collection updated'})
    }

    delete (req: any, res: Response, next: NextFunction) {
        collectionService.deleteCollection(req.params.id)
            .then((status: boolean) => status ? res.json({message: 'Group deleted'}) : res.sendStatus(404))
            .catch((err: Error) => next(err));
    }


}
