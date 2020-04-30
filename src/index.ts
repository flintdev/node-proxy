// src/index.ts

import express from 'express';
import * as bodyParser from "body-parser";
import {httpProxy} from "./proxy";

interface Options {
    html: string,
    port?: number,
    host?: string,
    staticFiles: {
        url: string,
        path: string,
    }
}

export default class Server {
    port: number;
    host: string;
    app: express.Express = express();
    options: Options;
    constructor(options: Options) {
        this.options = options;
        this.app.use(bodyParser.json({type: 'application/json'}));
        this.app.use(bodyParser.json({type: 'application/**json'}));
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(options.staticFiles.url, express.static(options.staticFiles.path));
        // html page
        this.app.all('/', (req, res, next) => {
            res.setHeader('Content-Type', 'text/html');
            res.send(options.html);
        });
        // proxy
        this.app.all('/proxy/*', ((req, res, next) => {
            httpProxy(req, res);
        }));
    }

    start = () => {
        const port = !!this.options.port ? this.options.port : 8080;
        const host = !!this.options.host ? this.options.host : '0.0.0.0';
        this.app.listen(port, host, () => {
            console.log(`server is running on ${host}:${port}`);
        });
    };
}