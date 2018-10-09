const MongoClient = require("mongodb").MongoClient;

export class Database {
    public static connect =  (url: string, callback: () => void ) => {
        MongoClient
            .connect(url)
            .then(database => {
                console.log('Connection established to', url);
                Database.db = database;
                callback();
            })
            .catch(console.error);
    };

    public static db: any;
}

