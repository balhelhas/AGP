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
  selector: 'edit_sensor',
  templateUrl: 'edit_sensor.component.html',
  styleUrls: ['sensor.component.css'],
})

export class EditSensorComponent implements OnInit{
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
		this.sensorService.getSensor(this.authService.currentUser, this.route.snapshot.params['id']).subscribe(r => {
			if(r != null){
				this.model = r;
			}
		})
	}

	private editSensor(){
		this.sensorService.updateSensor(this.authService.currentUser, this.model).subscribe(r => {
			if(r['msg'] === 'Sensor identificator already exist'){
				this.sensorIdentificatorTaken = true;
			}else{
				this.sensorService.mqttCreateSensor(this.authService.currentUser,r).subscribe(r => {
					if(r != null){
						this.router.navigate(['/sensor', this.route.snapshot.params['id']]);
					}
				});
			}
		})
	}

	private cancelEdit(){
		this.router.navigate(['/sensor', this.route.snapshot.params['id']]);
	}

}