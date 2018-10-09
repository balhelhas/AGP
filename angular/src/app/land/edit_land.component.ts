import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { LandService } from './land.service';
import { Land } from '../objects/land';


@Component({
  moduleId: module.id,
  selector: 'edit_land',
  templateUrl: 'edit_land.component.html',
  styleUrls: ['land.component.css'],
})

export class EditLandComponent implements OnInit{
	model = new Land('','','','','','');
	landNameTaken: boolean;

	constructor(private router: Router,
				private route: ActivatedRoute,
				private landService: LandService,
				private authService: AuthService){}

	ngOnInit(){
		this.landService.getLand(this.authService.currentUser, this.route.snapshot.params['id']).subscribe(r => {		
			this.model = r;
		});
	}	

	editLand(){
		this.landService.updateLand(this.authService.currentUser, this.model).subscribe(r => {
			if(r['msg'] === 'Land name already taken'){
				this.landNameTaken = true;
			}else{
				this.router.navigate(['/land', this.model._id]);
			}
		})
	}

	cancelEdit(){
		this.router.navigate(['/land', this.model._id]);
	}
}