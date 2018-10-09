const mongodb = require('mongodb');
const util = require('util');

import {Settings} from './app.settings';
import {Database} from './app.database';

export class Measure {

    private settings: Settings = null;

    private handleError = (err: string, response: any, next: any) => {
    	response.send(500, err);
	    next();
    }

    public getMeasures = (request: any, response: any, next: any) => {
        let sensor_id = request.params.id;

        Database.db.collection('measures')
            .find({sensor_id: sensor_id})
            .sort({$natural:-1})
            .toArray()
            .then(measures => {
                response.json(measures || []);
                next();
            })
            .catch(err => this.handleError(err, response, next));
    }

    public getRecentMeasures = (request: any, response: any, next: any) => {
        let sensor_id = request.params.id;
        let date = new Date();
        let dateFormated = [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('-');
        let timeFormated = [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');

        Database.db.collection('measures')
            .find({sensor_id: sensor_id})
            .sort({$natural:-1})
            .limit(1)
            .toArray()
            .then(measure => {
                if (measure === null) {
                    response.send(404, 'Measure not found');
                } else{
                    response.json(measure || []);
                }
                next();
            })
            .catch(err => this.handleError(err, response, next));
    }

    public init = (server: any, settings: Settings) => {
        this.settings = settings;
        server.get(settings.prefix + 'measures/:id', settings.security.authorize, this.getMeasures);
        server.get(settings.prefix + 'measures/recent/:id', settings.security.authorize, this.getRecentMeasures);
        console.log("Measure routes registered");
    };
}