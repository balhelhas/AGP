import { Injectable } from '@angular/core';
import { Http,  Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { User } from '../objects/user';
import { Measure } from '../objects/measure';
import { ApiUrl } from '../objects/api_url'

@Injectable()
export class MeasureService {

	api_url = new ApiUrl();

	constructor(private http: Http) {}

	buildHeaders(user: User): RequestOptions {
		let headers = new Headers();
		headers.append('Authorization', 'bearer ' + user.token);
		headers.append('Content-Type', 'application/json');
		return new RequestOptions({ headers: headers });
	}

	getMeasures(user: User, sensor_id: string): Observable<any>{
		let options = this.buildHeaders(user);
		let return_measures: Measure[] = [];
		
		return this.http.get(this.api_url.url + 'measures/'+ sensor_id, options)
			.map(response => {
				let measures = response.json();
				measures.forEach((measure:Measure) =>{
					return_measures.push(measure);
				});
				return return_measures;
			})
			.catch(e => {
				console.log(e);
				return Observable.throw(e);
			})
	}

	getRecentMeasures(user:User, sensor_id:string): Observable<any>{
		let options = this.buildHeaders(user);
		let return_measures: Measure[] = [];
		
		return this.http.get(this.api_url.url + 'measures/recent/'+ sensor_id, options)
			.map(response => {
				let measures = response.json();
				measures.forEach((measure:Measure) =>{
					return_measures.push(measure);
				});
				return return_measures;
			})
			.catch(e => {
				console.log(e);
				return Observable.throw(e);
			})
	}

}