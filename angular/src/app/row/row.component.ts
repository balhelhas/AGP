import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { AuthService } from '../auth/auth.service';

import { RowService } from './row.service';
import { Row } from '../objects/row';

import { PlantationService } from '../plantation/plantation.service';
import { Plantation } from '../objects/plantation';

import { SensorService } from '../sensor/sensor.service';
import { Sensor } from '../objects/sensor';

import { MeasureService } from '../measure/measure.service';
import { Measure } from '../objects/measure';


@Component({
  moduleId: module.id,
  selector: 'row',
  templateUrl: 'row.component.html',
  styleUrls: ['row.component.css'],
})

export class RowComponent implements OnInit{
	row = new Row('','');
	plantations: Plantation[] = [];
	sensors: Sensor[] = [];
	measures: Measure[] = [];
	platantion_page: number = 1;

	constructor(private router: Router,
				private route: ActivatedRoute,
				private rowService: RowService,
				private authService: AuthService,
				private plantationService: PlantationService,
				private sensorService: SensorService,
				private measureService: MeasureService){}

	ngOnInit(){
		this.refreshRow();
		
		let timer = Observable.timer(120000);
    	timer.subscribe(r => {
    		this.refreshRow();
    	});
	}

	refreshRow(){
		this.plantations = [];
		this.sensors = [];
		this.measures = [];
		
		this.rowService.getRow(this.authService.currentUser, this.route.snapshot.params['id']).subscribe(r => {		
			this.row = r;
			this.plantationService.getPlantations(this.authService.currentUser, this.row._id).subscribe(r => {
				r.forEach((plantation:Plantation) => {
					this.plantations.push(plantation);
				})
				this.plantations.forEach(plantation => {
					let date = new Date()	;
	    			let end_date = new Date(plantation.end_date.jsdate)
 	    			if(end_date < date && plantation.state == true){
	    				this.plantationService.updatePlantationState(this.authService.currentUser, plantation._id).subscribe(r => {
	    					plantation.state = false;
	    				})
	    			}
				})

			});
			this.sensorService.getSensors(this.authService.currentUser, this.row._id).subscribe(r => {
				r.forEach((sensor:Sensor) => {
					this.sensors.push(sensor);
				})
				this.sensors.forEach(sensor => {
					this.measureService.getRecentMeasures(this.authService.currentUser,sensor._id).subscribe(r => {
						r.forEach((measure:Measure) => {
							this.measures.push(measure);
						})
					})
				})
			})
		});	
	}

	editRow(){
		this.router.navigate(['/row/edit', this.row._id]);
	}

	createSensor(){
		this.router.navigate(['/sensor/new', this.row._id]);
	}

	createPlantation(){
		this.router.navigate(['/plantation/new', this.row._id]);
	}

	editPlantation(plantation:Plantation){
		this.router.navigate(['/plantation/edit', plantation._id, this.row._id]);
	}

	sensorPage(sensor_id: string){
		this.router.navigate(['/sensor', sensor_id]);
	}
}