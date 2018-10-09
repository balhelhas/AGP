import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { AuthService } from '../auth/auth.service';
import { LandService } from '../land/land.service';
import { GreenhouseService } from '../greenhouse/greenhouse.service';
import { SensorService } from '../sensor/sensor.service';
import { RowService } from '../row/row.service';
import { MeasureService } from '../measure/measure.service';

import { Land } from '../objects/land';
import { Greenhouse } from '../objects/greenhouse';
import { Row } from  '../objects/row';
import { Sensor } from '../objects/sensor';
import { Measure } from '../objects/measure';
import { MeasureVariables } from '../objects/measure_variables';


@Component({
  moduleId: module.id,
  selector: 'sensors_data',
  templateUrl: 'sensors_data.component.html',
  styleUrls: ['sensors_data.component.css'],
})
export class SensorsDataComponent implements OnInit{

	lands: Land[] = [];
	greenhouses: Greenhouse[] = [];
	rows: Row[] = [];
	greenhSensorRow: Row[] = [];
	greenhSensors: Sensor[] = []
	rowSensors: Sensor[] = [];
	measures: Measure[] = [];
	row_measures: Measure[] = [];
	greenhouse_measures: Measure[] = [];
	aux_array: any[] = []
	isCollapsed: boolean = false;

	constructor(private router: Router,
				private route: ActivatedRoute,
				private authService: AuthService,
				private landService: LandService,
				private greenhouseService: GreenhouseService,
				private rowService: RowService,
				private sensorService: SensorService,
				private measureService: MeasureService){}

	ngOnInit(){
		this.refreshArrays();
		let timer = Observable.timer(120000);
    	timer.subscribe(r => {
    		this.refreshArrays();
    	});
	}

	refreshArrays(){
		this.lands = [];
		this.greenhouses = [];
		this.rows = [];
		this.greenhSensorRow = [];
		this.greenhSensors = []
		this.rowSensors = [];
		this.measures = [];
		this.row_measures = [];
		this.greenhouse_measures = [];

		let getLands = new Promise((resolve, reject) =>{
			this.landService.getLands(this.authService.currentUser).subscribe(r => {
				r.forEach((land:Land) => {
					if(land.state != false){
						this.lands.push(land);
					}
				})
				resolve()
			});
		})
		getLands.then(r => {
			let getGreenhouses = new Promise((resolve, reject) => {
				this.greenhouseService.getAllGreenhouses(this.authService.currentUser).subscribe(r => {
					if(r != null){
						r.forEach((greenhouse:Greenhouse) => {
							this.aux_array.push(greenhouse);
						})
						
					}
					this.lands.forEach((land:Land) => {
						this.aux_array.forEach((greenhouse:Greenhouse) => {
							if(land._id == greenhouse.land_id){
								this.greenhouses.push(greenhouse);
							}
						})
					})
					this.aux_array = [];
					resolve();
				})
			})
			getGreenhouses.then(r => {				
				let getRows = new Promise((resolve, reject) => {
					this.rowService.getAllRows(this.authService.currentUser).subscribe(r => {
						if(r != null){
							r.forEach((row:Row) => {
								this.aux_array.push(row);
							})	
						}
						this.greenhouses.forEach((greenhouse:Greenhouse) => {
							this.aux_array.forEach((row:Row) => {
								if(greenhouse._id == row.greenhouse_id && row.name != '0'){
									this.rows.push(row);
								}
								if(greenhouse._id == row.greenhouse_id && row.name == '0'){
									this.greenhSensorRow.push(row);
								}
							})
						})
						this.aux_array = [];
						resolve();
					})
				})
				getRows.then(r => {
					let getSensors = new Promise((resolve, reject) => {
						this.sensorService.getAllSensors(this.authService.currentUser).subscribe(r => {
							if(r != null){
								r.forEach((sensor:Sensor) => {
									this.aux_array.push(sensor)
								})
							}
							this.rows.forEach(row => {

								this.aux_array.forEach(sensor => {
									if(row._id == sensor.row_id ) {
										this.rowSensors.push(sensor)
									}
									
								})
							})
							this.greenhSensorRow.forEach(row => {
								this.aux_array.forEach(sensor => {
									if(row._id == sensor.row_id ) {
										this.greenhSensors.push(sensor)
									}
								})
							})
							this.aux_array = [];
							resolve();
						})
					})
					getSensors.then(r => {
						this.rowSensors.forEach(sensor => {

							this.measureService.getRecentMeasures(this.authService.currentUser,sensor._id).subscribe(r => {
								if(r != null){
									r.forEach((measure:Measure) => {
										this.row_measures.push(measure);
										
									})
								}
							})
						})
						this.greenhSensors.forEach(sensor => {

							this.measureService.getRecentMeasures(this.authService.currentUser, sensor._id).subscribe(r => {
								if(r != null){
									r.forEach((measure:Measure) => {
										this.greenhouse_measures.push(measure);
									})
								}
							})
						})
					})
				})
			})
		})
	}

	sensorPage(sensor: Sensor){
		this.router.navigate(['/sensor', sensor._id]);
	}

}