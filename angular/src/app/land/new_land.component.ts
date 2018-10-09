import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { LandService } from './land.service';
import { Land } from '../objects/land';


@Component({
  moduleId: module.id,
  selector: 'new_land',
  templateUrl: 'new_land.component.html',
  styleUrls: ['land.component.css'],
})

export class NewLandComponent {
	model = new Land(this.authService.currentUser._id,'','','','','');
	landNameTaken: boolean;
	zipCodePatern = "^\\d{4}-\\d{3}$"

	constructor(private authService: AuthService, 
				private router: Router,
				private landService: LandService){}

	createLand(){
		this.landService.createLand(this.authService.currentUser,this.model).subscribe(r =>{
			if(r['msg'] === 'Land name already taken'){
				this.landNameTaken = true;
			}else{
				this.router.navigateByUrl('/lands');
			}
		});
	}
}