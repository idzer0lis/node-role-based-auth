import * as bodyParser from 'body-parser';
const express = require('express')
import {Controller} from './_helpers/interfaces';
import * as helmet from "helmet";
import {errorHandlerMiddleware} from "./_helpers/middlewares";

export class App {
    public app: any;

    constructor(controllers: Controller[]) {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
        this.initializeExtraSecurity();
    }

    public listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(`App listening on the port ${process.env.PORT}`);
        });
    }

    public getServer() {
        return this.app;
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
    }

    private initializeErrorHandling() {
        this.app.use(errorHandlerMiddleware);
    }

    private initializeExtraSecurity() {
        //this.app.use(helmet());
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }
}

export default App;