const mongodb = require('mongodb');
const util = require('util');

import {Settings} from './app.settings';
import {Database} from './app.database';

export class Plant {

    private settings: Settings = null;

    private handleError = (err: string, response: any, next: any) => {
    	response.send(500, err);
	    next();
    }

    private returnPlant = (id:string, response: any, next: any) => {

        Database.db.collection('plants')
            .findOne({
                _id: id
            })
            .then((plant) => {
                if (plant === null) {
                    response.send(404, 'Plant not found');
                } else {
                    response.json(plant);
                }
                next();
            })
            .catch(err => this.handleError(err, response, next));
    }


    public createPlant = (request: any, response: any, next: any) => {
        let new_plant;

        if(request.body !== undefined) { 
            new_plant = request.body;
        }

        if(new_plant === undefined) {
            response.send(400, 'No plant data');
            return next();
        }
                   
        Database.db.collection('plants')
            .insertOne(new_plant)
            .then(result => this.returnPlant(result.insertedId, response, next))
            .catch(err => this.handleError(err, response, next));                   
    }



    public getPlants = (request: any, response: any, next: any) => {
        let id = request.params.id;

        Database.db.collection('plants')
            .find({user_id: id})
            .toArray()
            .then(plants => {
                response.json(plants || []);
                next();
            })
            .catch(err => this.handleError(err, response, next));
    }


    public getPlant = (request: any, response: any, next: any) => {
        let id = new mongodb.ObjectID(request.params.id);
        this.returnPlant(id, response, next);
    }

    public updatePlant = (request: any, response: any, next: any) => {
        let id = new mongodb.ObjectID(request.params.id);
        let plant = request.body;

        if (plant === undefined) {
            response.send(400, 'No plant data!');
            return next();
        }

        delete plant._id;
        Database.db.collection('plants')
            .updateOne({
                _id: id
            }, {
                $set: plant
            })
            .then(result => this.returnPlant(id, response, next))
            .catch(err => this.handleError(err, response, next));
    }

    public deletePlant = (request: any, response: any, next: any) => {
        var id = new mongodb.ObjectID(request.params.id);
       
        Database.db.collection('plants')
            .deleteOne({
                _id: id
            })
            .then(result => {
                if (result.deletedCount === 1) {
                    response.json({
                        msg: util.format('Plant deleted')
                    });
                } else {
                    response.send(404, 'No plant found');
                }
                next();
            })
            .catch(err => this.handleError(err, response, next));
    }

    public init = (server: any, settings: Settings) => {
        this.settings = settings;
        server.get(settings.prefix + 'plants/:id', settings.security.authorize, this.getPlants);
        server.get(settings.prefix + 'plant/:id', settings.security.authorize, this.getPlant);
        server.put(settings.prefix + 'plant/update/:id', settings.security.authorize, this.updatePlant);
        server.post(settings.prefix + 'plants', settings.security.authorize, this.createPlant);
        server.del(settings.prefix + 'plant/delete/:id', settings.security.authorize, this.deletePlant);
        console.log("Plants routes registered");
    };
}