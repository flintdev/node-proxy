// src/index.ts

import express from 'express';
import * as bodyParser from "body-parser";
import path from 'path';
import fs from 'fs';

export default class Server {
    port: number;
    host: string;
    app: any = express();

}