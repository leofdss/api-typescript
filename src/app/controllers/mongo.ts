import { MongoClient, ObjectId } from 'mongodb';

export class Mongo {
    public static client: MongoClient;

    public static connect(database: string, config: object): Promise<MongoClient> {
        return new Promise<MongoClient>((resolve, reject) => {
            MongoClient.connect(database, config, async (error, client) => {
                if (error) {
                    reject(error);
                } else {
                    Mongo.client = client;
                    console.log(`Database connected to "${database}"`);
                    resolve(client);
                }
            });
        });
    }

    public static disconnect(): void {
        Mongo.client.close();
    }

    public static generateID(value: string): ObjectId | null {
        let id;
        try {
            id = new ObjectId(value);
        } catch (error) {
            return error;
        }
        if (id) {
            return id;
        }
        return null;
    }

    public static convertQuery(query: any): object {
        const props = Object.getOwnPropertyNames(query) as string[];
        for (const propName of props) {
            if (Array.isArray(query[propName])) {
                for (let i = 0; i < query[propName].length; i++) {
                    if (typeof query[propName][i] === 'object') {
                        query[propName][i] = this.convertQuery(query[propName][i]);
                    }
                }
            } else if (typeof query[propName] === 'object') {
                query[propName] = this.convertQuery(query[propName]);
            } else if (propName === '_id') {
                query[propName] = Mongo.generateID(query[propName]);
            }
        }
        return query;
    }

    public static getNextId(db: any, collectionName: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            db.collection('aux.count').findAndModify(
                { _id: collectionName, field: 'id' },
                null,
                { $inc: { seq: 1 } },
                { upsert: true, new: true },
                (err: any, result: any) => {
                    if (err) {
                        if (err.code === 11000) {
                            resolve(this.getNextId(db, collectionName));
                        } else {
                            reject(err);
                        }
                    } else {
                        if (result.value && result.value.seq) {
                            resolve(result.value.seq);
                        } else {
                            resolve(result.seq);
                        }
                    }
                },
            );
        });
    }
}
