import { Injectable } from '@angular/core';
import { Http,  Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { User } from '../objects/user';
import { Greenhouse } from '../objects/greenhouse';
import { ApiUrl } from '../objects/api_url'


@Injectable()
export class GreenhouseService {
	api_url = new ApiUrl();

	constructor(private http: Http) {}

	buildHeaders(user: User): RequestOptions {
		let headers = new Headers();
		headers.append('Authorization', 'bearer ' + user.token);
		headers.append('Content-Type', 'application/json');
		return new RequestOptions({ headers: headers });
	}

	createGreenhouse(user: User, greenhouse: Greenhouse): Observable<any> {
		let options = this.buildHeaders(user);

		return this.http.post(this.api_url.url + 'greenhouses', greenhouse, options)
			.map(response => {
				return response.json();
			})
			.catch(error => {
				console.log(error);
				return Observable.throw(error);
			});
	}

	getAllGreenhouses(user: User): Observable<any>{
		let options = this.buildHeaders(user);
		let return_greenhouses: Greenhouse[] = [];

		return this.http.get(this.api_url.url + 'greenhouses', options)
			.map(response => {
				let greenhouses = response.json();
				greenhouses.forEach((greenhouse:Greenhouse) => {
					return_greenhouses.push(greenhouse);
				})
				return return_greenhouses;
			})
			.catch(error => {
				console.log(error);
				return Observable.throw(error);
			});
	}

	getGreenhouses(user: User, land_id: string): Observable<any>{
		let options = this.buildHeaders(user);
		let return_greenhouses: Greenhouse[] = [];

		return this.http.get(this.api_url.url + 'greenhouses/'+ land_id, options)
			.map(response => {
				let greenhouses = response.json();
				greenhouses.forEach((greenhouse:Greenhouse) => {
					return_greenhouses.push(greenhouse);
				})
				return return_greenhouses;
			})
			.catch(error => {
				console.log(error);
				return Observable.throw(error);
			});
	}

	getGreenhouse(user: User, greenhouse_id: string): Observable<any> {
		let options = this.buildHeaders(user);

		return this.http.get(this.api_url.url + 'greenhouse/'+ greenhouse_id, options)
			.map(response => {
				return response.json();
			})
			.catch(error => {
				console.log(error);
				return Observable.throw(error);
			});
	}

	editGreenhouse(user: User, greenhouse: Greenhouse): Observable<any> {
		let options = this.buildHeaders(user);

		return this.http.put(this.api_url.url + 'greenhouse/update/'+ greenhouse._id, greenhouse, options)
			.map(response => {
				return response.json();
			})
			.catch(error => {
				console.log(error);
				return Observable.throw(error);
			});
	}
}