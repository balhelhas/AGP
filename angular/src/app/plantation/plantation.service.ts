import { Injectable } from '@angular/core';
import { Http,  Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { User } from '../objects/user';
import { Plantation } from '../objects/plantation';
import { ApiUrl } from '../objects/api_url'

@Injectable()
export class PlantationService {
	api_url = new ApiUrl();

	constructor(private http: Http) {}

	buildHeaders(user: User): RequestOptions {
		let headers = new Headers();
		headers.append('Authorization', 'bearer ' + user.token);
		headers.append('Content-Type', 'application/json');
		return new RequestOptions({ headers: headers });
	}

	createPlantation(user: User, plantation: Plantation): Observable<any> {
		let options = this.buildHeaders(user);

		return this.http.post(this.api_url.url + 'plantations', plantation, options)
			.map(response => {
				return response.json();
			})
			.catch(error => {
				console.log(error);
				return Observable.throw(error);
			});
	}

	getPlantations(user: User, row_id: string): Observable<any>{
		let options = this.buildHeaders(user);
		let return_plantations: Plantation[] = [];
		
		return this.http.get(this.api_url.url + 'plantations/'+ row_id, options)
			.map(response => {
				let plantations = response.json();
				plantations.forEach((plantation:Plantation) =>{
					return_plantations.push(plantation);
				});
				return return_plantations;
			})
			.catch(e => {
				console.log(e);
				return Observable.throw(e);
			})
	}

	getPlantation(user: User, plantation_id: string): Observable<any>{
		let options = this.buildHeaders(user);
		
		
		return this.http.get(this.api_url.url + 'plantation/'+ plantation_id, options)
			.map(response => {
				return response.json();
			})
			.catch(e => {
				console.log(e);
				return Observable.throw(e);
			})
	}

	updatePlantation(user: User, plantation: Plantation): Observable<any>{
		let options = this.buildHeaders(user);

		return this.http.put(this.api_url.url + 'plantation/update/'+ plantation._id, plantation, options)
			.map(response => {
				return response.json();
			})
			.catch(e => {
				console.log(e);
				return Observable.throw(e);
			})
	}

	updatePlantationState(user: User, plantation_id: string): Observable<any>{
		let options = this.buildHeaders(user);

		return this.http.put(this.api_url.url + 'plantation/state/'+ plantation_id, '', options)
			.map(response => {
				return response.json();
			})
			.catch(e => {
				console.log(e);
				return Observable.throw(e);
			})
	}

}