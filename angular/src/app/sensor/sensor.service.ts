import { Injectable } from '@angular/core';
import { Http,  Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { User } from '../objects/user';
import { Sensor } from '../objects/sensor';
import { ApiUrl } from '../objects/api_url'

@Injectable()
export class SensorService {
	api_url = new ApiUrl();

	constructor(private http: Http) {}

	buildHeaders(user: User): RequestOptions {
		let headers = new Headers();
		headers.append('Authorization', 'bearer ' + user.token);
		headers.append('Content-Type', 'application/json');
		return new RequestOptions({ headers: headers });
	}

	createSensor(user: User, sensor: Sensor): Observable<any> {
		let options = this.buildHeaders(user);

		return this.http.post(this.api_url.url + 'sensors', sensor, options)
			.map(response => {
				return response.json();
			})
			.catch(error => {
				console.log(error);
				return Observable.throw(error);
			});
	}

	getAllSensors(user: User): Observable<any> {
		let options = this.buildHeaders(user);
		let return_sensors: Sensor[] = [];

		return this.http.get(this.api_url.url + 'sensors', options)
			.map(response => {
				let greenhouses = response.json();
				greenhouses.forEach((sensor:Sensor) => {
					return_sensors.push(sensor);
				})
				return return_sensors;
			})
			.catch(error => {
				console.log(error);
				return Observable.throw(error);
			});
	}

	getSensors(user: User, row_id: string): Observable<any>{
		let options = this.buildHeaders(user);
		let return_sensors: Sensor[] = [];

		return this.http.get(this.api_url.url + 'sensors/'+ row_id, options)
			.map(response => {
				let sensors = response.json();
				sensors.forEach((sensor:Sensor) => {
					return_sensors.push(sensor);
				})
				return return_sensors;
			})
			.catch(error => {
				console.log(error);
				return Observable.throw(error);
			});
	}

	getSensorsCount(user: User, row_id: string): Observable<any>{
		let options = this.buildHeaders(user);

		return this.http.get(this.api_url.url + 'sensors/count/' + row_id, options)
			.map(response => {
				return response.json();
			})
			.catch(error => {
				console.log(error);
				return Observable.throw(error);
			});
	}

	getSensor(user: User, sensor_id: string): Observable<any>{
		let options = this.buildHeaders(user);

		return this.http.get(this.api_url.url + 'sensor/'+ sensor_id, options)
			.map(response => {
				return response.json();
			})
			.catch(error => {
				console.log(error);
				return Observable.throw(error);
			});
	}

	mqttCreateSensor(user: User, sensor: any): Observable<any> {
		let options = this.buildHeaders(user);

		return this.http.post(this.api_url.url + 'mqtt/new_sensor', sensor, options)
			.map(response => {
				return response.json();
			})
			.catch(error => {
				console.log(error);
				return Observable.throw(error);
			})
	}

	updateSensor(user: User, sensor: Sensor): Observable<any> {
		let options = this.buildHeaders(user);

		return this.http.put(this.api_url.url + 'sensor/update/' + sensor._id, sensor, options)
			.map(response => {
				return response.json();
			})
			.catch(error => {
				console.log(error);
				return Observable.throw(error);
			})
	}
}