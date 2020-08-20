require('rootpath')(); // absolute paths is a requirement(spec)
const express = require('express');
//const express = require('serverless-express/express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

import { userRoutes } from "./users/users.controller";
import { groupRoutes } from "./groups/groups.controller";
import {collectionRoutes} from "./collections/collections.controller";

import {errorHandlerMiddleware} from "./_helpers/middlewares";


const serverless = require('serverless-http');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//api routes
app.use('/users',  userRoutes);
app.use('/groups', groupRoutes);
app.use('/collections', collectionRoutes);

// global error handler
app.use(errorHandlerMiddleware);

// start server
const port = process.env.NODE_ENV === 'production' ? 80 : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});

module.exports.handler = serverless(app);

//module.exports = app;