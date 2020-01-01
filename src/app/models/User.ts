import { ObjectId } from 'mongodb';

export interface IUser {
    _id?: ObjectId | null;
    name: string;
    email: string;
    date: Date;
}

export class User implements IUser {
    // tslint:disable-next-line: variable-name
    public _id?: ObjectId | null;
    public name: string;
    public email: string;
    public date: Date;

    constructor({ _id, name, email, date }: any) {
        this._id = this.generateID(_id);
        this.name = String(name) || '';
        this.email = String(email) || '';
        this.date = this.generateDate(date);
    }

    private generateDate(value: string): Date {
        if (value) {
            return new Date(value);
        }
        return new Date();
    }

    private generateID(value: string): ObjectId {
        try {
            if (value) {
                value = String(value);
                return new ObjectId(value);
            }
            return new ObjectId();
        } catch (error) {
            return new ObjectId();
        }
    }
}
