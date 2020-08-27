require('rootpath')(); // absolute paths is a requirement(spec)
const express = require('express');
const cors = require('cors');
const helmet = require("helmet");
import * as bodyParser from 'body-parser';
import * as serverless from 'serverless-http';

import router from "./router";
import {errorHandlerMiddleware} from "./_helpers/middlewares";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//api routes
app.use(router);

//security
app.use(helmet());

// global error handler
app.use(errorHandlerMiddleware);

// start server
const port = process.env.NODE_ENV === 'production' ? 80 : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
