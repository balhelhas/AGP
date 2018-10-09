const mqtt = require('mqtt');
const mongodb = require('mongodb');
const util = require('util');
import {Database} from './app.database';
import {Settings} from './app.settings';
import {Sensor} from '../angular/src/app/objects/sensor';
import {Measure} from '../angular/src/app/objects/measure';


export class MosquittoClient{
	
	public client: any;

	private settings: Settings = null;

    private handleError = (err: string, response: any, next: any) => {
    	response.send(500, err);
	    next();
    }

    private newSensor = (request: any, response: any, next: any) => {
    	let new_sensor;

    	if(request.body !== undefined){
    		new_sensor = request.body;
    	}

    	if(new_sensor === undefined){
    		response.send(400, 'No sensor data');
            return next();
    	}

    	this.client.subscribe(new_sensor.identificator);
    	response.json(new_sensor)
    	next();
    }

	public init (server: any, settings: Settings) {

		setTimeout(() => {
			this.sensors = [];
		
			this.client = mqtt.connect({port:1883, host: 'localhost', keepalive: 10000});

			Database.db.collection('sensors')
				.find()
				.toArray()
				.then(sensors =>{
					this.client.on('connect', () =>{
						this.sensors.forEach((sensor:Sensor) => {
							this.client.subscribe(sensor.identificator);
						})
					})

				});

			this.client.on('message', (topic:any, message:any) =>{
				Database.db.collection('sensors')
					.find()
					.toArray()
					.then(sensors => {
						sensors.forEach((sensor:Sensor) =>{
							if(sensor.identificator == topic){
								let date = new Date();
								let measure = new Measure(sensor._id.toString(),message.toString(),date);
								console.log(sensor._id)
								if(!sensor.state){
									Database.db.collection('sensors')
									.updateOne({_id:sensor._id},{$set: {state:true}})
									.then(
										Database.db.collection('measures')
	                        				.insertOne(measure)
	                        		);
								}else{
									Database.db.collection('measures')
	                    				.insertOne(measure)
								}	
							}
						})
					})		
			})

			this.settings = settings;
			server.post(settings.prefix + 'mqtt/new_sensor', settings.security.authorize, this.newSensor);
			console.log("Mqtt routes registered")
		},1000);
		
	}
}