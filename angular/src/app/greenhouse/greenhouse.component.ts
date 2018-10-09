import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { AuthService } from '../auth/auth.service';
import { GreenhouseService } from './greenhouse.service';
import { Greenhouse } from '../objects/greenhouse';
import { Sensor } from '../objects/sensor';
import { SensorService } from '../sensor/sensor.service';
import { RowService } from '../row/row.service';
import { Row } from '../objects/row';
import { Measure } from '../objects/measure';
import { MeasureService } from '../measure/measure.service';
import { Count } from '../objects/count';
import { MeasureVariables } from '../objects/measure_variables'

@Component({
  moduleId: module.id,
  selector: 'greenhouse',
  templateUrl: 'greenhouse.component.html',
  styleUrls: ['greenhouse.component.css'],
})

export class GreenhouseComponent implements OnInit{
	greenhouse = new Greenhouse('','');
	greenhouseSensors: Sensor[] = [];
	rows: Row[] = [];
	measures: Measure[] = [];
	countSensors: Count[] = [];
	measureVariables = MeasureVariables;

	constructor(private router: Router,
				private route: ActivatedRoute,
				private greenhouseService: GreenhouseService,
				private authService: AuthService,
				private rowService: RowService,
				private sensorService: SensorService,
				private measureService: MeasureService){}

	ngOnInit(){
		this.refreshGreenhouse();
		let timer = Observable.timer(120000);
    	timer.subscribe(r => {
    		console.log('fez refresh')
    		this.refreshGreenhouse();
    	});	
	}

	refreshGreenhouse(){
		this.greenhouseSensors = [];
		this.rows = [];
		this.countSensors = [];

		this.greenhouseService.getGreenhouse(this.authService.currentUser, this.route.snapshot.params['id']).subscribe(r => {		
			this.greenhouse = r;
		});

		this.rowService.getSensorRow(this.authService.currentUser,this.route.snapshot.params['id']).subscribe(r => {
			this.sensorService.getSensors(this.authService.currentUser, r._id).subscribe(r => {
				r.forEach((sensor:Sensor) => {
					this.greenhouseSensors.push(sensor);
				})
				this.greenhouseSensors.forEach(sensor => {
					this.measureService.getRecentMeasures(this.authService.currentUser,sensor._id).subscribe(r => {
						r.forEach((measure:Measure) => {
							this.measures.push(measure);

						})
					})
				})
			})
		});

		this.rowService.getRows(this.authService.currentUser,this.route.snapshot.params['id']).subscribe(r => {
			this.rows = [];
			this.countSensors = [];
			r.forEach((row:Row) => {
				if(row.name !== '0'){
					this.rows.push(row);	
					this.sensorService.getSensorsCount(this.authService.currentUser,row._id).subscribe(r =>{
						let count = new Count(row._id,r);
						this.countSensors.push(count)
					})	
				}
			})
		})

	}

	editGreenhouse(){
		this.router.navigate(['/greenhouse/edit', this.greenhouse._id]);
	}

	createSensor(){
		this.rowService.getSensorRow(this.authService.currentUser,this.route.snapshot.params['id']).subscribe(r => {
			this.router.navigate(['/sensor/new', r._id]);
		});
	}

	createRow(){
		this.router.navigate(['/row/new', this.greenhouse._id]);
	}

	editRow(row:Row){
		this.router.navigate(['/row/edit', row._id]);
	}

	sensorPage(sensor_id: string){
		this.router.navigate(['/sensor', sensor_id]);
	}
}