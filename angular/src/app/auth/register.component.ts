import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { User }    from '../objects/user';

@Component({
  moduleId: module.id,
  selector: 'register',
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.css'],
})

export class RegisterComponent {
    usernamePattern = "^[a-zA-Z0-9]*$";
    mailPattern = "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$";
    model = new User('', '', '', '', '', '', '');
    usernameTaken: boolean;
    emailTaken: boolean;

    constructor(private authService: AuthService, private router: Router) {}

    register() {
        this.authService.register(this.model.username, this.model.password, 
                                    this.model.email, this.model.first_name,
                                    this.model.last_name, this.model.location, 
                                    this.model.gender).subscribe(r => {
            if (r['msg'] === 'Username already exists') {
                this.usernameTaken = true;
            } else if (r['msg'] === 'Email already in use') {
                this.emailTaken = true;
            } else {
                this.router.navigateByUrl('/login');
            }
        });
    }

}
