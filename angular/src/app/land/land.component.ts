import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { LandService } from './land.service';
import { Land } from '../objects/land';
import { GreenhouseService } from '../greenhouse/greenhouse.service';
import { Greenhouse } from '../objects/greenhouse';
import { RowService } from '../row/row.service';
import { Count } from '../objects/count';
import { SensorService } from '../sensor/sensor.service';
import { WeatherComponent } from '../weather/weather.component'

@Component({
  moduleId: module.id,
  selector: 'land',
  templateUrl: 'land.component.html',
  styleUrls: ['land.component.css'],
})


export class LandComponent implements OnInit{
	land_id: string = this.route.snapshot.params['id'];
	land = new Land('','','','','','');
	greenhouses: Greenhouse[] = [];
	countRows: Count[] = []
	countSensors: Count[] = []

	constructor(private router: Router,
				private route: ActivatedRoute,
				private landService: LandService,
				private greenhouseService: GreenhouseService,
				private authService: AuthService,
				private rowService: RowService,
				private sensorService: SensorService){}

	ngOnInit(){
		this.refreshLand();
		this.refreshGreenhouses();
	}

	refreshLand(){
		this.landService.getLand(this.authService.currentUser, this.land_id).subscribe(r => {		
			this.land = r;
		});
	}

	refreshGreenhouses(){
		this.greenhouseService.getGreenhouses(this.authService.currentUser,this.land_id).subscribe(r => {
			this.greenhouses = [];
			r.forEach((greenhouse:Greenhouse) => {
				this.greenhouses.push(greenhouse);
			})
			this.greenhouses.forEach(greenhouse => {
				this.rowService.getCountRows(this.authService.currentUser,greenhouse._id).subscribe(r => {
					let count = new Count(greenhouse._id,r);
					this.countRows.push(count)
				})
				this.rowService.getRows(this.authService.currentUser,greenhouse._id).subscribe(r => {
					let countSensors = 0;
					let count = new Count(greenhouse._id,'');
					r.forEach((row:any) => {
						this.sensorService.getSensorsCount(this.authService.currentUser,row._id).subscribe(r =>{
							countSensors += parseInt(r);
							count.count = countSensors.toString();
						})
					})
					this.countSensors.push(count)
				})
				
				
			})
		})
	}

	disableLand(){
		this.landService.disableLand(this.authService.currentUser,this.land).subscribe(r => {
			this.refreshLand();
		});
	}

	enableLand(){
		this.landService.enableLand(this.authService.currentUser,this.land).subscribe(r => {
			this.refreshLand();
		});
	}

	editLand(){
		this.router.navigate(['/land/edit', this.land_id]);
	}

	createGreenhouse(){
		this.router.navigate(['/greenhouse/new', this.land_id]);
	}

	editGreenhouse(greenhouse:Greenhouse){
		this.router.navigate(['/greenhouse/edit', greenhouse._id]);
	}
}