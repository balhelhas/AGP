import { Component } from '@angular/core';
import { Router } from '@angular/router'; 


import { AuthService } from './auth.service';
import { User }    from '../objects/user';


@Component({
  moduleId: module.id,
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})

export class LoginComponent {
    model = new User('', '', '', '', '', '', '');
    loginFailed: boolean;

    constructor(private authService: AuthService, 
                private router: Router) {}

    login(){
        this.loginFailed = false;
        this.authService.login(this.model.username,this.model.password).subscribe(loggedInUser => {
            if (loggedInUser) {
                this.loginFailed = false;
                sessionStorage.setItem('user', JSON.stringify(loggedInUser));
                this.router.navigateByUrl('/home');
            } else {
                this.loginFailed = true;
            }
        });
    }
}
