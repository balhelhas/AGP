import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router'; 

@Component({
	  moduleId: module.id,
  	selector: 'app',
  	templateUrl: 'app.component.html',
})

export class AppComponent  {


	constructor(private auth: AuthService, private router: Router)
  {
  	if(sessionStorage.length != 0){          
    	auth.currentUser = JSON.parse(sessionStorage.getItem('user'));  
  	}
  }

  logout(): void {
    this.auth.logout().subscribe(r => console.log(r));
    this.router.navigate(['/']);
 	}
}
