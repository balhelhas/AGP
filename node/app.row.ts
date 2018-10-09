const mongodb = require('mongodb');
const util = require('util');

import {Settings} from './app.settings';
import {Database} from './app.database';

export class Row {

    private settings: Settings = null;

    private handleError = (err: string, response: any, next: any) => {
    	response.send(500, err);
	    next();
    }

    private returnRow = (id:string, response: any, next: any) => {

        Database.db.collection('rows')
            .findOne({
                _id: id
            })
            .then((row) => {
                if (row === null) {
                    response.send(404, 'Row not found');
                } else {
                    response.json(row);
                }
                next();
            })
            .catch(err => this.handleError(err, response, next));
    }


    public createRow = (request: any, response: any, next: any) => {
        let new_row;

        if(request.body !== undefined) { 
            new_row = request.body;
        }

        if (new_row === undefined) {
            response.send(400, 'No row data');
            return next();
        }

        Database.db.collection('rows')
            .findOne({ name: new_row.name, greenhouse_id: new_row.greenhouse_id})
            .then(row => {
                if(row !== null){
                    response.json({
                        msg: util.format('Row name already taken')
                    });       
                }else {              
                    Database.db.collection('rows')
                        .insertOne(new_row)
                        .then(result => this.returnRow(result.insertedId, response, next))
                        .catch(err => this.handleError(err, response, next));
                }
            })
            .catch(err => this.handleError(err, response, next));
    }

    public getAllRows = (request: any, response: any, next: any) => {

        Database.db.collection('rows')
            .find()
            .toArray()
            .then(rows => {
                response.json(rows || []);
                next();
            })
            .catch(err => this.handleError(err, response, next));
    }

    public getRows = (request: any, response: any, next: any) => {
        let greenhouse_id = request.params.id;

        Database.db.collection('rows')
            .find({greenhouse_id: greenhouse_id})
            .toArray()
            .then(rows => {
                response.json(rows || []);
                next();
            })
            .catch(err => this.handleError(err, response, next));
    }

    public getCountRows = (request: any, response: any, next: any) => {
        let greenhouse_id = request.params.id;

        Database.db.collection('rows')
            .find({greenhouse_id: greenhouse_id, name: {$ne: '0'}})
            .count()
            .then(rows => {
                response.json(rows.toString());
                next();
            })
            .catch(err => this.handleError(err, response, next));
    }


    public getRow = (request: any, response: any, next: any) => {
        let id = new mongodb.ObjectID(request.params.id);
        this.returnRow(id, response, next);
    }

    public getSensorRow = (request: any, response: any, next: any) => {
        let greenhouse_id = request.params.id;

        Database.db.collection('rows')
            .findOne({greenhouse_id: greenhouse_id, name: '0'})
            .then((row) => {
                if (row === null) {
                    response.send(404, 'Row not found');
                } else {
                    response.json(row);
                }
                next();
            })
            .catch(err => this.handleError(err, response, next));
    }

    public updateRow = (request: any, response: any, next: any) => {
        let id = new mongodb.ObjectID(request.params.id);
        let row = request.body;

        if (row === undefined) {
            response.send(400, 'No land data!');
            return next();
        }

        Database.db.collection('rows')
            .findOne({ _id: {$ne: id}, name: row.name, greenhouse_id: row.greenhouse_id})
            .then(update => {
                if(update !== null){
                    response.json({
                        msg: util.format('Row name already taken')
                    });       
                }else {
                    delete row._id;
                    Database.db.collection('rows')
                        .updateOne({
                            _id: id
                        }, {
                            $set: row
                        })
                        .then(result => this.returnRow(id, response, next))
                        .catch(err => this.handleError(err, response, next));
                }
            })
            .catch(err => this.handleError(err, response, next));
    }

    public init = (server: any, settings: Settings) => {
        this.settings = settings;
        server.get(settings.prefix + 'rows', settings.security.authorize, this.getAllRows);
        server.get(settings.prefix + 'rows/:id', settings.security.authorize, this.getRows);
        server.get(settings.prefix + 'row/:id', settings.security.authorize, this.getRow);
        server.get(settings.prefix + 'rows/count/:id', settings.security.authorize, this.getCountRows);
        server.get(settings.prefix + 'row/sensor/:id', settings.security.authorize, this.getSensorRow);
        server.put(settings.prefix + 'row/update/:id', settings.security.authorize, this.updateRow);
        server.post(settings.prefix + 'rows', settings.security.authorize, this.createRow);
        console.log("Rows routes registered");
    };
}