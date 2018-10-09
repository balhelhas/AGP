import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { AuthService } from '../auth/auth.service';
import { LandService } from '../land/land.service';
import { GreenhouseService } from './greenhouse.service';
import { SensorService } from '../sensor/sensor.service';
import { RowService } from '../row/row.service';

import { Land } from '../objects/land';
import { Greenhouse } from '../objects/greenhouse';
import { Row } from  '../objects/row';


@Component({
  moduleId: module.id,
  selector: 'greenhouses',
  templateUrl: 'greenhouses.component.html',
  styleUrls: ['greenhouse.component.css']
})

export class GreenhousesComponent implements OnInit{
	lands: Land[] = [];
	greenhouses: Greenhouse[] = [];
	existing_greenhouses: Greenhouse[] = [];
	greenhouseNameTaken: boolean;
	p: number = 1;

	constructor(private router: Router,
				private landService: LandService,
				private authService: AuthService,
				private greenhouseService: GreenhouseService,
				private sensorService: SensorService,
				private rowService: RowService){}

	ngOnInit(){
		this.refreshArrays();
	}

	refreshArrays() {
		this.lands = [];
		this.greenhouses = [];

		let promise = new Promise((resolve, reject) =>{
			this.landService.getLands(this.authService.currentUser).subscribe(r => {
				r.forEach((land:Land) => {
					if(land.state != false){
						this.lands.push(land);
					}
				})
				resolve()
			});
		})

		promise.then(r => {
			let getGreenhouses = new Promise((resolve,reject) => {
				for(let i = 0; i < this.lands.length; i ++){
					this.greenhouseService.getGreenhouses(this.authService.currentUser,this.lands[i]._id).subscribe(r => {
						if(r != []){
							console.log(r)
							r.forEach((greenhouse:Greenhouse) => {
								this.existing_greenhouses.push(greenhouse);
								this.greenhouses.push(greenhouse);
							})
						}
					})
				}
				resolve();
			})
			
			
			
		});
	}

	onSelectLand(land:any){
		if( land != null){
			this.greenhouses = [];

			this.greenhouseService.getGreenhouses(this.authService.currentUser,land._id).subscribe(r => {
				if(r != null){
					r.forEach((greenhouse:Greenhouse) => {
						this.greenhouses.push(greenhouse);
					})
				}
			})
		}else{
			this.refreshArrays();
		}
	}


}