import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { User }    from '../objects/user';
import { UserService } from './user.service';

@Component({
  moduleId: module.id,
  selector: 'user_edit',
  templateUrl: 'user_edit.component.html',
  styleUrls: ['user.component.css'],
})

export class UserEditComponent implements OnInit {
    mailPattern = "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$";
    user = new User('', '', '', '', '', '', '');
    emailTaken: boolean;

    constructor(private authService: AuthService, private router: Router,
                private route: ActivatedRoute, private userService: UserService) {}

    ngOnInit() {
        this.user = this.authService.currentUser;
    }

    editUser() {
       this.userService.editUser(this.authService.currentUser, this.user).subscribe(r => {
           if(r != null){
               if (r['msg'] === 'Email already in use') {
                   this.emailTaken = true;
               }else {
                   this.authService.currentUser = this.user;
                   this.router.navigate(['/profile']); 
               }
               
           }
       })
    }

}
