const mongodb = require('mongodb');
const util = require('util');

import {Settings} from './app.settings';
import {Database} from './app.database';

export class Land {

    private settings: Settings = null;

    private handleError = (err: string, response: any, next: any) => {
    	response.send(500, err);
	    next();
    }

    private returnLand = (id:string, response: any, next: any) => {
        
        Database.db.collection('lands')
            .findOne({
                _id: id
            })
            .then((land) => {
                if (land === null) {
                    response.send(404, 'Land not found');
                } else {
                    response.json(land);
                }
                next();
            })
            .catch(err => this.handleError(err, response, next));
    }

    public createLand = (request: any, response: any, next: any) => {
        let user_id;
        let new_land;

        if(request.body !== undefined) {
            user_id = request.body.user_id;   
            new_land = request.body.land;
        }

        if (user_id === undefined && new_land === undefined) {
            response.send(400, 'No land data');
            return next();
        }

        Database.db.collection('lands')
            .findOne({ name: new_land.name, owner_id: new_land.owner_id})
            .then(land => {
                if(land !== null){
                    response.json({
                        msg: util.format('Land name already taken')
                    });       
                }else {              
                    Database.db.collection('lands')
                        .insertOne(new_land)
                        .then(result => this.returnLand(result.insertedId, response, next))
                        .catch(err => this.handleError(err, response, next));
                }
            })
            .catch(err => this.handleError(err, response, next));

    }

    public getLands = (request: any, response: any, next: any) => {
        let user_id = request.params.id;

        Database.db.collection('lands')
            .find({owner_id: user_id})
            .toArray()
            .then(lands => {
                response.json(lands || []);
                next();
            })
            .catch(err => this.handleError(err, response, next));
    }

    public getLand =  (request: any, response: any, next: any) => {
        let id = new mongodb.ObjectID(request.params.id);
        this.returnLand(id, response, next);
    }
    
    public updateLand = (request: any, response: any, next: any) => {
        let id = new mongodb.ObjectID(request.params.id);
        let land = request.body;

        if (land === undefined) {
            response.send(400, 'No land data!');
            return next();
        }

        Database.db.collection('lands')
            .findOne({ _id: {$ne: id}, name: land.name, owner_id: land.owner_id})
            .then(update => {
                if(update !== null){
                    response.json({
                        msg: util.format('Land name already taken')
                    });       
                }else {
                    delete land._id;
                    Database.db.collection('lands')
                        .updateOne({
                            _id: id
                        }, {
                            $set: land
                        })
                        .then(result => this.returnLand(id, response, next))
                        .catch(err => this.handleError(err, response, next));
                }
            })
            .catch(err => this.handleError(err, response, next));
    }
    
    

    public disableLand = (request: any, response: any, next: any) => {
        let id = new mongodb.ObjectID(request.params.id);
         
        Database.db.collection('lands')
           .updateOne(
                { _id: id }, 
                { $set: {state : false} }
            )
            .then(result => this.returnLand(id, response, next))
            .catch(err => this.handleError(err, response, next));
    }

    public enableLand = (request: any, response: any, next: any) => {
        let id = new mongodb.ObjectID(request.params.id);
         
        Database.db.collection('lands')
           .updateOne(
                { _id: id }, 
                { $set: {state : true} }
            )
            .then(result => this.returnLand(id, response, next))
            .catch(err => this.handleError(err, response, next));
    }

    public init = (server: any, settings: Settings) => {
        this.settings = settings;
        server.get(settings.prefix + 'lands/:id', settings.security.authorize, this.getLands);
        server.get(settings.prefix + 'land/:id', settings.security.authorize, this.getLand);
        server.put(settings.prefix + 'land/update/:id', settings.security.authorize, this.updateLand);
        server.put(settings.prefix + 'land/disable/:id', settings.security.authorize, this.disableLand);
        server.put(settings.prefix + 'land/enable/:id', settings.security.authorize, this.enableLand);
        server.post(settings.prefix + 'lands', settings.security.authorize, this.createLand);
        console.log("Lands routes registered");
    };
}