import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
import { Mongo } from '../controllers';
import { User } from '../models';

const router = Router();
const usersDB = () => Mongo.client.db().collection('users');

/******************************************************************************
 *                      Get All Users - "GET /api/users/all"
 ******************************************************************************/

router.get('/all', async (req: Request, res: Response) => {
    try {
        const users = await usersDB().find().toArray();
        users.map((user) => new User(user));
        res.status(OK).json({ users });
    } catch (err) {
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

/******************************************************************************
 *                       Add One - "POST /api/users/add"
 ******************************************************************************/

router.post('/add', async (req: Request, res: Response) => {
    try {
        const user = new User(req.body.user);
        if (!user) {
            return res.status(BAD_REQUEST).json({
                error: 'BAD_REQUEST'
            });
        }
        await usersDB().insertOne(user);
        return res.status(CREATED).end();
    } catch (err) {
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

/******************************************************************************
 *                       Update - "PUT /api/users/update"
 ******************************************************************************/

router.put('/update', async (req: Request, res: Response) => {
    try {
        const user = new User(req.body.user);
        if (!user) {
            return res.status(BAD_REQUEST).json({
                error: 'BAD_REQUEST'
            });
        }
        await usersDB().replaceOne({ _id: user._id }, user);
        return res.status(OK).end();
    } catch (err) {
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

/******************************************************************************
 *                    Delete - "DELETE /api/users/delete/:id"
 ******************************************************************************/

router.delete('/delete/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params as ParamsDictionary;
        await usersDB().deleteOne({ _id: Mongo.generateID(id) });
        return res.status(OK).end();
    } catch (err) {
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
