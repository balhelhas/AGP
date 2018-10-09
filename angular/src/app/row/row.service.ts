import { Injectable } from '@angular/core';
import { Http,  Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { User } from '../objects/user';
import { Row } from '../objects/row';
import { ApiUrl } from '../objects/api_url';

@Injectable()
export class RowService {
	api_url = new ApiUrl();

	constructor(private http: Http) {}

	buildHeaders(user: User): RequestOptions {
		let headers = new Headers();
		headers.append('Authorization', 'bearer ' + user.token);
		headers.append('Content-Type', 'application/json');
		return new RequestOptions({ headers: headers });
	}

	createRow(user: User, row: Row): Observable<any> {
		let options = this.buildHeaders(user);

		return this.http.post(this.api_url.url + 'rows', row, options)
			.map(response => {
				return response.json();
			})
			.catch(error => {
				console.log(error);
				return Observable.throw(error);
			});
	}

	getAllRows(user: User): Observable<any> {
		let options = this.buildHeaders(user);
		let return_rows: Row[] = [];

		return this.http.get(this.api_url.url + 'rows', options)
			.map(response => {
				let greenhouses = response.json();
				greenhouses.forEach((row:Row) => {
					return_rows.push(row);
				})
				return return_rows;
			})
			.catch(error => {
				console.log(error);
				return Observable.throw(error);
			});
	}

	getRows(user: User, greenhouse_id: string): Observable<any>{
		let options = this.buildHeaders(user);
		let return_rows: Row[] = [];

		return this.http.get(this.api_url.url + 'rows/'+ greenhouse_id, options)
			.map(response => {
				let rows = response.json();
				rows.forEach((row:Row) => {
					return_rows.push(row);
				})
				return return_rows;
			})
			.catch(error => {
				console.log(error);
				return Observable.throw(error);
			});
	}

	getCountRows(user: User, greenhouse_id: string): Observable<any>{
		let options = this.buildHeaders(user);
		
		return this.http.get(this.api_url.url + 'rows/count/'+ greenhouse_id, options)
			.map(response => {
				return response.json();
			})
			.catch(error => {
				console.log(error);
				return Observable.throw(error);
			});
	}

	getRow(user: User, row_id: string): Observable<any> {
		let options = this.buildHeaders(user);

		return this.http.get(this.api_url.url + 'row/'+ row_id, options)
			.map(response => {
				return response.json();
			})
			.catch(error => {
				console.log(error);
				return Observable.throw(error);
			});
	}

	getSensorRow(user: User, greenhouse_id: string): Observable<any> {
		let options = this.buildHeaders(user);

		return this.http.get(this.api_url.url + 'row/sensor/'+ greenhouse_id, options)
			.map(response => {
				return response.json();
			})
			.catch(error => {
				console.log(error);
				return Observable.throw(error);
			});
	}

	editRow(user: User, row: Row): Observable<any> {
		let options = this.buildHeaders(user);

		return this.http.put(this.api_url.url + 'row/update/'+ row._id, row, options)
			.map(response => {
				return response.json();
			})
			.catch(error => {
				console.log(error);
				return Observable.throw(error);
			});
	}
}