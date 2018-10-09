import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { LandService } from './land.service';
import { Land } from '../objects/land';


@Component({
  moduleId: module.id,
  selector: 'lands',
  templateUrl: 'lands.component.html',
  styleUrls: ['land.component.css'],
})

export class LandsComponent implements OnInit{
	lands: Land[] = [];
	p: number = 1;

	constructor(private authService: AuthService, 
				private router: Router,
				private landService: LandService){}

	ngOnInit(){
		this.refreshLands();
	}

	refreshLands(){
		this.landService.getLands(this.authService.currentUser).subscribe(r => {
			this.lands = [];
			r.forEach((land:Land) => {
				this.lands.push(land);
			})
		});
	}

	newLand(){
		this.router.navigate(['/land/new']);
	}

}