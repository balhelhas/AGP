const mongodb = require('mongodb');
const util = require('util');

import {Settings} from './app.settings';
import {Database} from './app.database';

export class Sensor {

    private settings: Settings = null;

    private handleError = (err: string, response: any, next: any) => {
    	response.send(500, err);
	    next();
    }

    private returnSensor = (id:string, response: any, next: any) => {

        Database.db.collection('sensors')
            .findOne({
                _id: id
            })
            .then((sensor) => {
                if (sensor === null) {
                    response.send(404, 'Sensor not found');
                } else {
                    response.json(sensor);
                }
                next();
            })
            .catch(err => this.handleError(err, response, next));
    }


    public createSensor = (request: any, response: any, next: any) => {
        let new_sensor;

        if(request.body !== undefined) { 
            new_sensor = request.body;
        }

        if(new_sensor === undefined) {
            response.send(400, 'No sensor data');
            return next();
        }

        Database.db.collection('sensors')
            .findOne({identificator: new_sensor.identificator})
            .then(sensor => {
                if(sensor !== null){
                    response.json({
                        msg: util.format('Sensor identificator already exist')
                    });       
                }else {              
                    Database.db.collection('sensors')
                        .insertOne(new_sensor)
                        .then(result => this.returnSensor(result.insertedId, response, next))
                        .catch(err => this.handleError(err, response, next));
                }
            })
            .catch(err => this.handleError(err, response, next));
               
    }

    public getAllSensors = (request: any, response: any, next: any) => {

        Database.db.collection('sensors')
            .find()
            .toArray()
            .then(rows => {
                response.json(rows || []);
                next();
            })
            .catch(err => this.handleError(err, response, next));
    }

    public getSensors = (request: any, response: any, next: any) => {
        let row_id = request.params.id;

        Database.db.collection('sensors')
            .find({row_id: row_id})
            .toArray()
            .then(sensors => {
                response.json(sensors || []);
                next();
            })
            .catch(err => this.handleError(err, response, next));
    }

    public getSensorsCount = (request: any, response: any, next: any) => {
        let row_id = request.params.id;

        Database.db.collection('sensors')
            .find({row_id: row_id})
            .count()
            .then(count => {
                response.json(count.toString());
                next();
            })
            .catch(err => this.handleError(err, response, next));       
    }

    public getSensor = (request: any, response: any, next: any) => {
        let id = new mongodb.ObjectID(request.params.id);
        this.returnSensor(id,response,next);
    }

    public updateSensor = (request: any, response: any, next: any) => {
        let id = new mongodb.ObjectID(request.params.id);
        let sensor = request.body;

        if (sensor === undefined) {
            response.send(400, 'No sensor data!');
            return next();
        }

        Database.db.collection('sensors')
            .findOne({ _id: sensor._id})
            .then(update => {
                delete sensor._id;
                Database.db.collection('sensors')
                    .updateOne({
                        _id: id
                    }, {
                        $set: sensor
                    })
                    .then(result => this.returnSensor(id, response, next))
                    .catch(err => this.handleError(err, response, next));
            })
            .catch(err => this.handleError(err, response, next));
    }

    public init = (server: any, settings: Settings) => {
        this.settings = settings;
        server.get(settings.prefix + 'sensors', settings.security.authorize, this.getAllSensors);
        server.get(settings.prefix + 'sensors/:id', settings.security.authorize, this.getSensors);
        server.get(settings.prefix + 'sensor/:id', settings.security.authorize, this.getSensor);
        server.get(settings.prefix + 'sensors/count/:id', settings.security.authorize, this.getSensorsCount);
        server.put(settings.prefix + 'sensor/update/:id', settings.security.authorize, this.updateSensor);
        server.post(settings.prefix + 'sensors', settings.security.authorize, this.createSensor);
        console.log("Sensors routes registered");
    };
}