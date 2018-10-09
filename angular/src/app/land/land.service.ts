import { Injectable }    from '@angular/core';
import { Http,  Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { User } from '../objects/user';
import { Land } from '../objects/land';
import { ApiUrl } from '../objects/api_url'

@Injectable()
export class LandService {

	api_url = new ApiUrl();

	constructor(private http: Http) {}

	buildHeaders(user: User): RequestOptions {
		let headers = new Headers();
		headers.append('Authorization', 'bearer ' + user.token);
		headers.append('Content-Type', 'application/json');
		return new RequestOptions({ headers: headers });
	}

	createLand(user: User, land: Land): Observable<any> {
		let options = this.buildHeaders(user);

		return this.http.post(this.api_url.url + 'lands',  {land: land, user_id: user._id}, options)
			.map(response => {
				return response.json();
			})
			.catch(error => {
				console.log(error);
				return Observable.throw(error);
			});
	}

	getLands(user: User): Observable<any>{
		let options = this.buildHeaders(user);
		let return_lands: Land[] = [];
		
		return this.http.get(this.api_url.url + 'lands/'+ user._id, options)
			.map(response => {
				let lands = response.json();
				lands.forEach((land:Land) =>{
					return_lands.push(land);
				});
				return return_lands;
			})
			.catch(e => {
				console.log(e);
				return Observable.throw(e);
			})
	}

	getLand(user: User, land_id: string): Observable<any>{
		let options = this.buildHeaders(user);
		
		return this.http.get(this.api_url.url + 'land/'+land_id, options)
			.map(response => {
				return response.json();
			})
			.catch(e => {
				console.log(e);
				return Observable.throw(e);
			})
	}

	disableLand(user: User, land: Land): Observable<any> {
		let options = this.buildHeaders(user);

		return this.http.put(this.api_url.url + 'land/disable/'+land._id, null, options)
			.map(response => {
				return response.json();
			})
			.catch(e => {
				console.log(e);
				return Observable.throw(e);
			})
	}

	enableLand(user: User, land: Land): Observable<any> {
		let options = this.buildHeaders(user);

		return this.http.put(this.api_url.url + 'land/enable/'+land._id, null, options)
			.map(response => {
				return response.json();
			})
			.catch(e => {
				console.log(e);
				return Observable.throw(e);
			})
	}

	updateLand(user: User, land: Land): Observable<any> {
		let options = this.buildHeaders(user);

		return this.http.put(this.api_url.url + 'land/update/'+land._id, land, options)
			.map(response => {
				return response.json();
			})
			.catch(e => {
				console.log(e);
				return Observable.throw(e);
			})
	}

}