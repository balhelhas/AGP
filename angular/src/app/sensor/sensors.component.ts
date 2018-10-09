import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';

import { LandService } from '../land/land.service';
import { Land } from '../objects/land';

import { GreenhouseService } from '../greenhouse/greenhouse.service';
import { Greenhouse } from '../objects/greenhouse';

import { RowService } from '../row/row.service';
import { Row } from '../objects/row';

import { SensorService } from '../sensor/sensor.service';
import { Sensor } from '../objects/sensor';

@Component({
  moduleId: module.id,
  selector: 'sensors',
  templateUrl: 'sensors.component.html',
  styleUrls: ['sensor.component.css']
})

export class SensorsComponent implements OnInit{
	lands: Land[] = [];
	greenhouses: Greenhouse[] = [];
	rows: Row[] = [];
	sensors: Sensor[] = [];
	selectedLand: Land = null;
	selectedGreenhouse: Greenhouse = null;
	filteredGreenhouses: Greenhouse[] = [];
	filteredRows: Row[] = [];
	filteredSensors: Sensor[] = [];
	p: number = 1;

	constructor(private route: ActivatedRoute,
				private router: Router,
				private authService: AuthService,
				private landService: LandService,
				private greenhouseService: GreenhouseService,
				private rowService: RowService,
				private sensorService: SensorService){ }

	ngOnInit(){
		this.refreshArrays();
	}

	refreshArrays(){
		this.lands = [];
		this.greenhouses = [];
		this.rows = [];
		this.sensors = [];
		this.filteredSensors = [];

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
				let auxArray: any[] = [];
				this.greenhouseService.getAllGreenhouses(this.authService.currentUser).subscribe(r => {
					if(r != null){
						r.forEach((greenhouse:Greenhouse) => {
							auxArray.push(greenhouse);
						})					
					}
					this.lands.forEach((land:Land) => {
						auxArray.forEach((greenhouse:Greenhouse) => {
							if(land._id == greenhouse.land_id){
								this.greenhouses.push(greenhouse);
							}
						})
					})
					auxArray = [];
					resolve();
				})
			})

			getGreenhouses.then(r => {				
				let getRows = new Promise((resolve, reject) =>{
					let auxArray: any[] = [];
					this.rowService.getAllRows(this.authService.currentUser).subscribe(r => {
						if(r != null){
							r.forEach((row:Row) => {
								auxArray.push(row);
							})
						}
						this.greenhouses.forEach((greenhouse:Greenhouse) => {
							auxArray.forEach((row:Row) => {
								if(greenhouse._id == row.greenhouse_id){
									this.rows.push(row);
								}
							})
						})
						auxArray = [];
						resolve();
					})
				})

				getRows.then(r => {
					this.rows.forEach(row => {
						this.sensorService.getSensors(this.authService.currentUser, row._id).subscribe(r => {
							r.forEach((sensor:Sensor) => {
								this.sensors.push(sensor);
								this.filteredSensors.push(sensor);
							})
						})
					})
				})
			})

			
		})
	}

	onSelectLand(land:any){
		if(land != null){
			this.sensors = []

			this.selectedLand = land;

			this.filteredGreenhouses = this.greenhouses.filter(greenhouse => greenhouse.land_id == land._id);
			
			let getRows = new Promise((resolve,reject) => {
				this.rows = [];
				let auxRows: Row[] = [];
				this.rowService.getAllRows(this.authService.currentUser).subscribe(r => {
					r.forEach((row:Row) => {
						auxRows.push(row);
					})
					this.filteredGreenhouses.forEach(greenhouse => {
						auxRows.forEach(row => {
							if(greenhouse._id == row.greenhouse_id){
								this.rows.push(row);
							}
						})
					})
					resolve();
				})
				
				
			})

			getRows.then(r => {
				this.rows.forEach(row => {
					this.sensorService.getSensors(this.authService.currentUser,row._id).subscribe(r => {
						r.forEach((sensor:Sensor) => {
							this.sensors.push(sensor);
						})
					})
				})
			})
		}else {
			this.selectedLand = null;
			this.refreshArrays()
		}	
	}

	onSelectGreenhouse(greenhouse:any){
		if(greenhouse != null){
			this.filteredSensors = []

			this.selectedGreenhouse = greenhouse;

			this.filteredRows = this.rows.filter(row => row.greenhouse_id == greenhouse._id)
			
			this.filteredRows.forEach(row => {
				this.sensorService.getSensors(this.authService.currentUser,row._id).subscribe(r => {
					r.forEach((sensor:Sensor) => {
						this.filteredSensors.push(sensor)
					})
				})
			})
			
		}else{
			this.filteredSensors = []

			this.selectedGreenhouse = null;

			this.filteredGreenhouses = this.greenhouses.filter(greenhouse => greenhouse.land_id == this.selectedLand._id);
			
			let getRows = new Promise((resolve,reject) => {
				this.rows = [];
				let auxRows: Row[] = [];
				this.rowService.getAllRows(this.authService.currentUser).subscribe(r => {
					r.forEach((row:Row) => {
						auxRows.push(row);
					})
					this.filteredGreenhouses.forEach(greenhouse => {
						auxRows.forEach(row => {
							if(greenhouse._id == row.greenhouse_id){
								this.rows.push(row);
							}
						})
					})
					resolve();
				})			
			})

			getRows.then(r => {
				this.rows.forEach(row => {
					this.sensorService.getSensors(this.authService.currentUser,row._id).subscribe(r => {
						r.forEach((sensor:Sensor) => {
							this.filteredSensors.push(sensor)
						})
					})
				})
			})
		}
	}

	onSelectRow(row:any){
		if(row != null){
			this.filteredSensors = [];

			this.sensorService.getSensors(this.authService.currentUser,row._id).subscribe(r => {
				r.forEach((sensor:Sensor) => {
					this.filteredSensors.push(sensor);
				})
			})
		}else{
			this.filteredSensors = [];

			this.filteredRows = this.rows.filter(row => row.greenhouse_id == this.selectedGreenhouse._id)
			
			this.filteredRows.forEach(row => {
				this.sensorService.getSensors(this.authService.currentUser,row._id).subscribe(r => {
					r.forEach((sensor:Sensor) => {
						this.filteredSensors.push(sensor);
					})
				})
			})
		}
	}
	
}