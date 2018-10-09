import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { GreenhouseService } from './greenhouse.service';
import { Greenhouse } from '../objects/greenhouse';
import { RowService } from '../row/row.service';
import { Row } from  '../objects/row';

@Component({
  moduleId: module.id,
  selector: 'new_greenhouse',
  templateUrl: 'new_greenhouse.component.html',
  styleUrls: ['greenhouse.component.css'],
})

export class NewGreenhouseComponent{
	model = new Greenhouse(this.route.snapshot.params['id'],'');
	greenhouseNameTaken: boolean;

	constructor(private authService: AuthService, 
				private router: Router,
				private route: ActivatedRoute,
				private greenhouseService: GreenhouseService,
				private rowService: RowService){}

	createGreenhouse(){
		this.greenhouseService.createGreenhouse(this.authService.currentUser, this.model).subscribe(r => {
			if(r['msg'] === 'Greenhouse name already taken'){
				this.greenhouseNameTaken = true;
			}else{
				let sensor_row = new Row(r._id,'0');
				this.rowService.createRow(this.authService.currentUser, sensor_row).subscribe(r => {
					this.router.navigate(['/land', this.route.snapshot.params['id']]);
				});
			}
		});
	}

	cancelCreate(){
		this.router.navigate(['/land', this.route.snapshot.params['id']]);
	}
	
}