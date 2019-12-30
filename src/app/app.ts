import createError from 'http-errors';
import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { Request, Response, Router } from 'express';

class App {
    public express: express.Application;
    public constructor() {
        this.express = express();

        this.middlewares();
        this.routes();
        this.errors();
    }

    private middlewares(): void {
        this.express.use(logger('dev'));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(cookieParser());
        this.express.use(express.static(path.join(__dirname, 'public')));
        this.express.use(cors());
    }

    private routes(): void {
        this.express.get('/', async (req: Request, res: Response) => {
            res.send('respond with a resource');
        });
    }

    private errors(): void {
        // catch 404 and forward to error handler
        this.express.use((req, res, next) => {
            next(createError(404));
        });

        // error handler
        this.express.use((err: any, req: any, res: any, next: any) => {
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
