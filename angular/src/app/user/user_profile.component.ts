import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { User } from '../objects/user';
import { UserService } from './user.service';

@Component({
  moduleId: module.id,
  selector: 'user_profile',
  templateUrl: 'user_profile.component.html',
  styleUrls: ['user.component.css'],
})


export class UserProfileComponent implements OnInit{
	user: User;
	password: string;
	new: string;
	confirmation: string;
	notCorrectPassword: boolean = false;
	passwordChanged: boolean = true;

	constructor(private router: Router,
				private route: ActivatedRoute,
				private authService: AuthService,
				private userService: UserService){}

	ngOnInit(){
		this.user = this.authService.currentUser;
	}

	changePassword(){
		this.userService.changePassword(this.user,this.password,this.new).subscribe(r => {
			if(r['msg'] === 'Not the correct password') {
				this.notCorrectPassword = true;
			}else{
				this.passwordChanged = true;
				this.password = '';
				this.new = '';
				this.confirmation = '';
			}
		})
	}

	editUser(){
		this.router.navigate(['user/edit']);
	}
}