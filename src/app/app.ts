import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { Request, Response, Router } from 'express';
import createError from 'http-errors';
import logger from 'morgan';
import path from 'path';

import env from '../environments/environment';
import envProd from '../environments/environment.prod';
import envTest from '../environments/environment.test';

import { Mongo } from './controllers';
import BaseRouter from './routes';

class App {
    public express: express.Application;
    public constructor() {
        this.express = express();

        this.onEnv(process.env.NODE_ENV);
        this.config();
        this.middlewares();
        this.database();
        this.routes();
        this.errors();
    }

    private onEnv(val: string | undefined) {
        if (val === 'production') {
            const props = Object.keys(envProd);
            for (const prop of props) {
                (env as any)[prop] = (envProd as any)[prop];
            }
        } else if (val === 'test') {
            const props = Object.keys(envTest);
            for (const prop of props) {
                (env as any)[prop] = (envTest as any)[prop];
            }
        }
    }

    private config() {
        this.express.set('views', path.join(__dirname, '../assets/views')); // eslint-disable-line
        this.express.set('view engine', 'ejs');
        this.express.use((req, res, next) => {
            res.set('X-Powered-By', 'PHP/7.1.7');
            next();
        });

        this.express.disable('etag');
        this.express.use((req, res, next) => {
            res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
            next();
        });
        this.express.disable('view cache');
    }

    private middlewares(): void {
        if (!env.production && !env.test) {
            this.express.use(logger('dev'));
        }
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(cookieParser());
        this.express.use(express.static(path.join(__dirname, 'public')));
        this.express.use(cors());
        this.express.use(compression());

        this.express.use('/', BaseRouter);
    }

    private database(): void {
        Mongo.connect(env.database, env.config);
    }

    private routes(): void {
        this.express.get('/', async (req: Request, res: Response) => {
            res.send('respond with a resource');
        });
    }

    private errors(): void {
        // catch 404 and forward to error handler
        this.express.use(async (req, res, next) => {
            next(createError(404));
        });

        // error handler
        this.express.use(async (err: any, req: any, res: any, next: any) => {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });
    }
}

export default new App().express;
