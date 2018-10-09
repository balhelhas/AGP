import { Injectable } from '@angular/core';
import { Http,  Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { User } from '../objects/user';
import { Plant } from '../objects/plant';
import { ApiUrl } from '../objects/api_url';

@Injectable()
export class PlantService {
	api_url = new ApiUrl();

	constructor(private http: Http) {}

	buildHeaders(user: User): RequestOptions {
		let headers = new Headers();
		headers.append('Authorization', 'bearer ' + user.token);
		headers.append('Content-Type', 'application/json');
		return new RequestOptions({ headers: headers });
	}

	createPlant(user: User, plant: Plant): Observable<any> {
		let options = this.buildHeaders(user);

		return this.http.post(this.api_url.url + 'plants', plant, options)
			.map(response => {
				return response.json();
			})
			.catch(error => {
				console.log(error);
				return Observable.throw(error);
			});
	}

	getPlants(user: User): Observable<any>{
		let options = this.buildHeaders(user);
		let return_plants: Plant[] = [];

		return this.http.get(this.api_url.url + 'plants/' + user._id , options)
			.map(response => {
				let species = response.json();
				species.forEach((plant:Plant) => {
					return_plants.push(plant);
				})
				return return_plants;
			})
			.catch(error => {
				console.log(error);
				return Observable.throw(error);
			});
	}

	getPlant(user: User, plant_id: string): Observable<any>{
		let options = this.buildHeaders(user);

		return this.http.get(this.api_url.url + 'plant/'+ plant_id, options)
			.map(response => {
				return response.json();
			})
			.catch(error => {
				console.log(error);
				return Observable.throw(error);
			});
	}

	updatePlant(user: User, plant: Plant): Observable<any>{
		let options = this.buildHeaders(user);

		return this.http.put(this.api_url.url + 'plant/update/'+ plant._id, plant, options)
			.map(response => {
				return response.json();
			})
			.catch(error => {
				console.log(error);
				return Observable.throw(error);
			});
	}

	deletePlant(user: User, plant_id: string): Observable<any>{
		let options = this.buildHeaders(user);

		return this.http.delete(this.api_url.url + 'plant/delete/'+ plant_id, options)
			.map(response => {
				return response.json();
			})
			.catch(error => {
				console.log(error);
				return Observable.throw(error);
			});
	}

}