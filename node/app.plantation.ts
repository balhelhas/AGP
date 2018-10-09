const mongodb = require('mongodb');
const util = require('util');

import {Settings} from './app.settings';
import {Database} from './app.database';

export class Plantation {

    private settings: Settings = null;

    private handleError = (err: string, response: any, next: any) => {
    	response.send(500, err);
	    next();
    }

    private returnPlantation = (id:string, response: any, next: any) => {

        Database.db.collection('plantations')
            .findOne({
                _id: id
            })
            .then((plantation) => {
                if (plantation === null) {
                    response.send(404, 'Row not found');
                } else {
                    response.json(plantation);
                }
                next();
            })
            .catch(err => this.handleError(err, response, next));
    }


    public createPlantation = (request: any, response: any, next: any) => {
        let new_plantation;

        if(request.body !== undefined) { 
            new_plantation = request.body;
        }

        if (new_plantation === undefined) {
            response.send(400, 'No row data');
            return next();
        }

              
        Database.db.collection('plantations')
            .insertOne(new_plantation)
            .then(result => this.returnPlantation(result.insertedId, response, next))
            .catch(err => this.handleError(err, response, next));
    }

    public getPlantations = (request: any, response: any, next: any) => {
        let row_id = request.params.id;

        Database.db.collection('plantations')
            .find({row_id: row_id})
            .toArray()
            .then(rows => {
                response.json(rows || []);
                next();
            })
            .catch(err => this.handleError(err, response, next));
    }

    public getPlantation = (request: any, response: any, next: any) => {
        let id = new mongodb.ObjectID(request.params.id);
        this.returnPlantation(id,response,next);
    }

    public updatePlantation = (request: any, response: any, next: any) => {
        let id = new mongodb.ObjectID(request.params.id);
        let plantation = request.body;

        if (plantation === undefined) {
            response.send(400, 'No plantation data!');
            return next();
        }

        Database.db.collection('plantations')
            .findOne({ _id: plantation._id})
            .then(update => {
                delete plantation._id;
                Database.db.collection('plantations')
                    .updateOne({
                        _id: id
                    }, {
                        $set: plantation
                    })
                    .then(result => this.returnPlantation(id, response, next))
                    .catch(err => this.handleError(err, response, next));
            })
            .catch(err => this.handleError(err, response, next));
    }


    public updatePlantationState = (request: any, response: any, next: any) => {
        let id = new mongodb.ObjectID(request.params.id);
        
        Database.db.collection('plantations')
            .updateOne({
                _id: id
            }, {
                $set: { state: false}
            })
            .then(result => this.returnPlantation(id, response, next))
            .catch(err => this.handleError(err, response, next));
    }

    public init = (server: any, settings: Settings) => {
        this.settings = settings;
        server.get(settings.prefix + 'plantations/:id', settings.security.authorize, this.getPlantations);
        server.get(settings.prefix + 'plantation/:id', settings.security.authorize, this.getPlantation);
        server.put(settings.prefix + 'plantation/update/:id', settings.security.authorize, this.updatePlantation);
        server.put(settings.prefix + 'plantation/state/:id', settings.security.authorize, this.updatePlantationState);
        server.post(settings.prefix + 'plantations', settings.security.authorize, this.createPlantation);
        console.log("Plantation routes registered");
    };
}