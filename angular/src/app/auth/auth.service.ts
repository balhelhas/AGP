import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { User } from '../objects/user';
import { ApiUrl } from '../objects/api_url';


@Injectable()
export class AuthService {
    currentUser: User;
    api_url = new ApiUrl();

    constructor(private http: Http) { }

    buildHeaders(): RequestOptions {
        let headers = new Headers();
        headers.append('Authorization', 'bearer ' + this.currentUser.token);
        headers.append('Content-Type', 'application/json');

        return new RequestOptions({ headers: headers });
    }

    register(username: string, password: string, email:string,
    		 first_name:string, last_name:string, location:string,
             gender:string): Observable<string> {

        return this.http.post(this.api_url.url + 'register', { username: username, password: password, email: email, first_name: first_name, last_name: last_name, location: location, gender})
            .map(res => { return res.json(); })
            .catch(e => {
                console.log(e);
                return Observable.throw(e);
            });
    }


    login(username: string, password: string): Observable<User> {

        return this.http.post(this.api_url.url + 'login', { username: username, password: password })
            .map(res => {
                this.currentUser = <User>res.json();
                return this.currentUser;
            })
            .catch(e => {
                console.log(e);
                return Observable.of<User>(null);
            });
    }

    logout(): Observable<any> {
        let options = this.buildHeaders();

        return this.http.post(this.api_url.url + 'logout', null, options)
            .map(res => {
                res.json();
                this.currentUser = null;
                sessionStorage.clear();
                return this.currentUser;
            })
            .catch(e => {
                console.log(e);
                return Observable.throw(e);
            });
    }

    isLoggedIn(): boolean {
        if(this.currentUser == null){
            return false;
        }
        return true;
    }
}
