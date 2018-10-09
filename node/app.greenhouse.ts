const mongodb = require('mongodb');
const util = require('util');

import {Settings} from './app.settings';
import {Database} from './app.database';

export class Greenhouse {

    private settings: Settings = null;

    private handleError = (err: string, response: any, next: any) => {
    	response.send(500, err);
	    next();
    }

    private returnGreenhouse = (id:string, response: any, next: any) => {

        Database.db.collection('greenhouses')
            .findOne({
                _id: id
            })
            .then((greenhouse) => {
                if (greenhouse === null) {
                    response.send(404, 'Greenhouse not found');
                } else {
                    response.json(greenhouse);
                }
                next();
            })
            .catch(err => this.handleError(err, response, next));
    }


    public createGreenhouse = (request: any, response: any, next: any) => {
        let new_greenhouse;

        if(request.body !== undefined) { 
            new_greenhouse = request.body;
        }

        if(new_greenhouse === undefined) {
            response.send(400, 'No greenhouse data');
            return next();
        }

        Database.db.collection('greenhouses')
            .findOne({ name: new_greenhouse.name, land_id: new_greenhouse.land_id})
            .then(greenhouse => {
                if(greenhouse !== null){
                    response.json({
                        msg: util.format('Greenhouse name already taken')
                    });       
                }else {              
                    Database.db.collection('greenhouses')
                        .insertOne(new_greenhouse)
                        .then(result => this.returnGreenhouse(result.insertedId, response, next))
                        .catch(err => this.handleError(err, response, next));
                }
            })
            .catch(err => this.handleError(err, response, next));
    }

    public getGreenhouses = (request: any, response: any, next: any) => {
        let land_id = request.params.id;

        Database.db.collection('greenhouses')
            .find({land_id: land_id})
            .toArray()
            .then(greenhouses => {
                response.json(greenhouses || []);
                next();
            })
            .catch(err => this.handleError(err, response, next));
    }

    public getAllGreenhouses = (request: any, response: any, next: any) => {

        Database.db.collection('greenhouses')
            .find()
            .toArray()
            .then(greenhouses => {
                response.json(greenhouses || []);
                next();
            })
            .catch(err => this.handleError(err, response, next));
    }

    public getGreenhouse = (request: any, response: any, next: any) => {
        let id = new mongodb.ObjectID(request.params.id);
        this.returnGreenhouse(id, response, next);
    }

    public updateGreenhouse = (request: any, response: any, next: any) => {
        let id = new mongodb.ObjectID(request.params.id);
        let greenhouse = request.body;

        if (greenhouse === undefined) {
            response.send(400, 'No land data!');
            return next();
        }

        Database.db.collection('greenhouses')
            .findOne({ _id: {$ne: id}, name: greenhouse.name, land_id: greenhouse.land_id})
            .then(update => {
                if(update !== null){
                    response.json({
                        msg: util.format('Greenhouse name already taken')
                    });       
                }else {
                    delete greenhouse._id;
                    Database.db.collection('greenhouses')
                        .updateOne({
                            _id: id
                        }, {
                            $set: greenhouse
                        })
                        .then(result => this.returnGreenhouse(id, response, next))
                        .catch(err => this.handleError(err, response, next));
                }
            })
            .catch(err => this.handleError(err, response, next));
    }

    public init = (server: any, settings: Settings) => {
        this.settings = settings;
        server.get(settings.prefix + 'greenhouses/:id', settings.security.authorize, this.getGreenhouses);
        server.get(settings.prefix + 'greenhouse/:id', settings.security.authorize, this.getGreenhouse);
        server.get(settings.prefix + 'greenhouses', settings.security.authorize, this.getAllGreenhouses);        
        server.put(settings.prefix + 'greenhouse/update/:id', settings.security.authorize, this.updateGreenhouse);
        server.post(settings.prefix + 'greenhouses', settings.security.authorize, this.createGreenhouse);
        console.log("Greenhouses routes registered");
    };
}