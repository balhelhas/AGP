import { Injectable } from '@angular/core';
import { Http,  Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { User } from '../objects/user';
import { ApiUrl } from '../objects/api_url';

@Injectable()
export class UserService {
	api_url = new ApiUrl();

	constructor(private http: Http) {}

	buildHeaders(user: User): RequestOptions {
		let headers = new Headers();
		headers.append('Authorization', 'bearer ' + user.token);
		headers.append('Content-Type', 'application/json');
		return new RequestOptions({ headers: headers });
	}

	changePassword(user: User, password: string, new_password: string){
		let options = this.buildHeaders(user);

		return this.http.put(this.api_url.url + 'pw_change/' + user._id, {password: password, new_password: new_password}, options)
			.map(response => {
				return response.json();
			})
			.catch(error => {
				console.log(error);
				return Observable.throw(error);
			});
	}

	editUser(user: User, modelUser: User){
		let options = this.buildHeaders(user);
		
		return this.http.put(this.api_url.url + 'user/edit', modelUser, options)
			.map(response => {
				return response.json();
			})
			.catch(error => {
				console.log(error);
				return Observable.throw(error);
			});
	}
	
}