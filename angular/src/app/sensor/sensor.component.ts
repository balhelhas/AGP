import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';


import { AuthService } from '../auth/auth.service';

import { SensorService } from '../sensor/sensor.service';
import { Sensor } from '../objects/sensor';

import { MeasureService } from '../measure/measure.service';
import { Measure } from '../objects/measure';

import { GraphData } from '../objects/graph_data'


@Component({
  moduleId: module.id,
  selector: 'sensor',
  templateUrl: 'sensor.component.html',
  styleUrls: ['sensor.component.css'],
})

export class SensorComponent implements OnInit{
	sensor = new Sensor('','','',null);
	measures: Measure[] = [];
	p: number = 1;
	options: any;
	graphDataArray: any[] = [];

	constructor(private route: ActivatedRoute,
				private router: Router,
				private authService: AuthService,
				private sensorService: SensorService,
				private measureService: MeasureService){

	}

	ngOnInit(){
		this.refreshSensor();
		let timer = Observable.timer(120000);
    	timer.subscribe(r => {
    		this.refreshSensor();
    	});
	}

	refreshSensor(){
		this.measures = [];
		this.graphDataArray = [];

		this.sensorService.getSensor(this.authService.currentUser,this.route.snapshot.params['id']).subscribe(r => {
			this.sensor = r;
			this.measureService.getMeasures(this.authService.currentUser,this.sensor._id).subscribe(r => {
				r.forEach((measure:Measure) => {
					this.measures.push(measure);
				})

				this.measures.forEach(measure => {
					let data: any[] = [];
					let date = new Date(measure.date)
					data.push(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
					data.push(Number(measure.value));
					this.graphDataArray.push(data);
				})
				if(this.sensor.measure_unit == 'S/cm'){
					this.options = {
						chart: {
			        		height: 400,
			        		width: 500
			    		},
			    		title: {
					        text: 'Medições de '+ this.sensor.measure_variable
					    },
				        xAxis: {type: 'datetime', title: {text: 'Data'}, dateTimeLabelFormats:{month: '%b %e, %Y'}},
				        yAxis: { title: {text: this.sensor.measure_variable+'(micro'+this.sensor.measure_unit+')'}},
			            series: [{
			            	name: this.sensor.identificator,
			               data: this.graphDataArray
			           	}]
			       	};
				}else{
					this.options = {
						chart: {
			        		height: 400,
			        		width: 500
			    		},
			    		title: {
					        text: 'Medições de '+ this.sensor.measure_variable
					    },
				        xAxis: {type: 'datetime', title: {text: 'Data da medição'}, dateTimeLabelFormats:{month: '%b %e, %Y'}},
				        yAxis: { title: {text: this.sensor.measure_variable+' ('+this.sensor.measure_unit+')'}},
			            series: [{
			            	name: this.sensor.identificator,
			               data: this.graphDataArray
			           	}]
			       	};
				}

			});

		})
	}

	editSensor(){
		this.router.navigate(['/sensor/edit', this.sensor._id]);
	}
}