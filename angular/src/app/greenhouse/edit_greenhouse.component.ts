import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { GreenhouseService } from './greenhouse.service';
import { Greenhouse } from '../objects/greenhouse';


@Component({
  moduleId: module.id,
  selector: 'edit_greenhouse',
  templateUrl: 'edit_greenhouse.component.html',
  styleUrls: ['greenhouse.component.css'],
})

export class EditGreenhouseComponent implements OnInit{
	model = new Greenhouse('','');
	greenhouseNameTaken: boolean;

	constructor(private router: Router,
				private route: ActivatedRoute,
				private greenhouseService: GreenhouseService,
				private authService: AuthService){}

	ngOnInit(){
		this.greenhouseService.getGreenhouse(this.authService.currentUser, this.route.snapshot.params['id']).subscribe(r => {		
			this.model = r;
		});
	}	

	editGreenhouse(){
		this.greenhouseService.editGreenhouse(this.authService.currentUser, this.model).subscribe(r => {
			if(r['msg'] === 'Greenhouse name already taken'){
				this.greenhouseNameTaken = true;
			}else{
				this.router.navigate(['/greenhouse', this.model._id]);
			}
		})
	}

	cancelEdit(){
		this.router.navigate(['/greenhouse', this.model._id]);
	}
}