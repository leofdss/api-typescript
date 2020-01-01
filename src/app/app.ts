import createError from 'http-errors';
import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { Request, Response, Router } from 'express';
import BaseRouter from './routes';
import { Mongo } from './controllers';
import env from '../environments/environment';

class App {
    public express: express.Application;
    public constructor() {
        this.express = express();

        this.config();
        this.middlewares();
        this.database();
        this.routes();
        this.errors();
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
        this.express.use(logger('dev'));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(cookieParser());
        this.express.use(express.static(path.join(__dirname, 'public')));
        this.express.use(cors());

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
