import {Controller, User} from "../_helpers/interfaces";
import {NextFunction, Request, Response, Router} from "express";
import {IUserService, Service, UsersService} from "./users.service";
import {authorizeMiddleware} from "../_helpers/middlewares";


export class UsersController implements Controller {
    public path = '/users';
    public router: Router = Router();
    usersService: IUserService;

    constructor(UsersService: IUserService) {
        this.usersService = UsersService;
        this.initializeRoutes();

    }

    private initializeRoutes() {
        this.router.post(`${this.path}/authenticate`, this.authenticate);     // public route
        this.router.get(`${this.path}`, authorizeMiddleware(['globalManager']), this.getAll);
        this.router.get(`${this.path}/:id`, authorizeMiddleware(), this.getById);       // all authenticated users
        this.router.post(`${this.path}`, authorizeMiddleware(['globalManager']), this.create);
        this.router.put(`${this.path}/:id`, authorizeMiddleware(), this.update);
        this.router.delete(`${this.path}/:id`, authorizeMiddleware(['globalManager', 'manager']), this.delete);
    }


    authenticate (req: Request, res: Response, next: NextFunction) {
        this.usersService.authenticate(req.body)
            .then((user: any) => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
            .catch((err: Error) => next(err));
    }

    getAll (req: any, res: Response, next: NextFunction) {
        this.usersService.getAll()
            .then((users: User[]) => res.json(users))
            .catch((err: Error) => next(err));
    }

    getById (req: any, res: Response, next: NextFunction) {
        const id = req.params.id;

        this.usersService.getById(id)
            .then((user: User) => user ? res.json(user) : res.sendStatus(404))
            .catch((err: Error) => next(err));
    }

    create(req: any, res: Response, next: NextFunction) {
        const newUser = req.body.user;

        if(!newUser) return res.status(401).json({ message: 'No user post data' });

        this.usersService.create(newUser)
            .then((user: User) => user ? res.json(user) : res.sendStatus(404))
            .catch((err: Error) => next(err));
    }

    update (req: any, res: Response, next: NextFunction) {
        const newUserData = req.body.user;

        if(!newUserData) return res.status(401).json({ message: 'No user post data' });

        this.usersService.update(newUserData)
            .then((user: User) => user ? res.json(user) : res.sendStatus(404))
            .catch((err: Error) => next(err));
    }

    delete (req: any, res: Response, next: NextFunction) {
        const id = req.params.id;

        this.usersService.delete(id)
            .then((status: boolean) => status ? res.json({message: 'User deleted'}) : res.sendStatus(404))
            .catch((err: Error) => next(err));
    }

}


