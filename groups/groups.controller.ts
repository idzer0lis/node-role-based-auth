import {Controller, Group} from "../_helpers/interfaces";
import {NextFunction, Response, Router} from "express";
import {Service} from "../users/users.service";
import {authorizeMiddleware, isGroupManagerMiddleware, isMyGroupMiddleware} from "../_helpers/middlewares";
const groupService = require('./groups.service');

export class GroupsController implements Controller {
    public path = 'groups';
    public router: Router = Router();
    private groupsService: Service;

    constructor(GroupsService: Service) {
        this.groupsService = GroupsService;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, authorizeMiddleware(['globalManager']), this.getAll);
        this.router.get(`${this.path}/:id`, authorizeMiddleware(), isMyGroupMiddleware(), this.getById);
        this.router.post(`${this.path}`, authorizeMiddleware(['globalManager', 'manager']), this.create);
        this.router.put(`${this.path}/:id`, authorizeMiddleware(['globalManager', 'manager']), isGroupManagerMiddleware(), this.update);
        this.router.delete(`${this.path}/:id`, authorizeMiddleware(['globalManager', 'manager']),  isGroupManagerMiddleware(), this.delete);
    }

    getAll (req: any, res: Response, next: NextFunction) {
        groupService.getAllGroups()
            .then((groups: Group[]) => res.json(groups))
            .catch((err: Error) => next(err));
    }

    getById (req: any, res: Response, next: NextFunction) {
        groupService.getGroupById(req.params.id)
            .then((group: Group) => group ? res.json(group) : res.sendStatus(404))
            .catch((err: Error) => next(err));
    }

    create (req: any, res: Response, next: NextFunction) {
        const newGroup = req.body.group;
        if(!newGroup) return res.status(401).json({ message: 'No group post data' });

        groupService.createGroup(newGroup)
            .then((group: Group) => group ? res.json(group) : res.sendStatus(404))
            .catch((err: Error) => next(err));
    }

    update (req: any, res: Response, next: NextFunction) {
        res.json({message: 'Group updated'}); //todo

    }

    delete (req: any, res: Response, next: NextFunction) {
        const groupId = req.params.id;
        groupService.deleteGroup(groupId)
            .then((status: boolean) => status ? res.json({message: 'Group deleted'}) : res.sendStatus(404))
            .catch((err: Error) => next(err));
    }
}

