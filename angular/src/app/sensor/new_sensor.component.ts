import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { AuthService } from '../auth/auth.service';
import { SensorService } from './sensor.service';
import { Sensor } from '../objects/sensor';
import { RowService } from '../row/row.service';
import { Row } from '../objects/row';
import { MeasureVariables } from '../objects/measure_variables'

@Component({
  moduleId: module.id,
  selector: 'new_sensor',
  templateUrl: 'new_sensor.component.html',
  styleUrls: ['sensor.component.css'],
})

export class NewSensorComponent implements OnInit{
	model = new Sensor('','','','');
	sensorIdentificatorTaken: boolean;
	insert_row: Row;
	measureVariables = MeasureVariables;

	constructor(private router: Router,
				private route: ActivatedRoute,
				private sensorService: SensorService,
				private authService: AuthService,
				private rowService: RowService){}

	ngOnInit() {
		this.rowService.getRow(this.authService.currentUser,this.route.snapshot.params['id']).subscribe(r => {
			this.insert_row = r;
		})
	}

	private createSensor(){
		let new_sensor = new Sensor(this.route.snapshot.params['id'],this.model.identificator,this.model.description,this.model.measure_variable);
		this.sensorService.createSensor(this.authService.currentUser, new_sensor).subscribe(r => {
			if(r['msg'] === 'Sensor identificator already exist'){
				this.sensorIdentificatorTaken = true;
			}else{
				this.sensorService.mqttCreateSensor(this.authService.currentUser,r).subscribe(r => {
					if(r != null){
						if(this.insert_row.name == '0'){
							this.router.navigate(['/greenhouse', this.insert_row.greenhouse_id]);
						}
						else{
							this.router.navigate(['/row', this.insert_row._id]);
						}
					}
				});
			}
		})
	}

	private cancelCreate(){
		if(this.insert_row.name == '0'){
			this.router.navigate(['/greenhouse', this.insert_row.greenhouse_id]);
		}
		else{
			this.router.navigate(['/row', this.insert_row._id]);
		}
	}

}