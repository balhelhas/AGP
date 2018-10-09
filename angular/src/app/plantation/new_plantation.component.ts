import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IMyDpOptions, IMyDateModel} from 'mydatepicker';

import { AuthService } from '../auth/auth.service';

import { PlantationService } from './plantation.service';
import { Plantation } from '../objects/plantation';

import { PlantService } from '../plant/plant.service';
import { Plant } from '../objects/plant';

@Component({
  moduleId: module.id,
  selector: 'new_plantation',
  templateUrl: 'new_plantation.component.html',
  styleUrls: ['plantation.component.css']
})

export class NewPlantationComponent implements OnInit{
	model = new Plantation(this.route.snapshot.params['id'],null,null);
	myDatePickerOptions: IMyDpOptions = { dateFormat: 'dd-mm-yyyy' };
	wrongDates: boolean = false;
	plants: Plant[] = [];
	plantation_plants: Plant[] = [];

	constructor(private route: ActivatedRoute,
				private router: Router,
				private authService: AuthService,
				private plantationService: PlantationService,
				private plantService: PlantService){}

	ngOnInit(){
		this.plantService.getPlants(this.authService.currentUser).subscribe(r => {
			r.forEach((plant:Plant) => {
				this.plants.push(plant);
			})
		})
	}

	createPlantation(){
		if(!this.wrongDates){
			this.plantationService.createPlantation(this.authService.currentUser, this.model).subscribe(r => {
				this.router.navigate(['/row', this.route.snapshot.params['id']]);
			});
		}
	}

	cancelCreate(){
		this.router.navigate(['/row', this.route.snapshot.params['id']]);
	}

	onStartDateChanged(event: IMyDateModel) {
		this.model.start_date = event;
		if(this.model.end_date != null && this.model.end_date.jsdate <= this.model.start_date.jsdate){
			this.wrongDates = true;
		}else{
			this.wrongDates = false;
		}
	}

	onEndDateChanged(event: IMyDateModel) {
		this.model.end_date = event;
		if(this.model.start_date != null && this.model.end_date != null && this.model.end_date.jsdate <= this.model.start_date.jsdate ){
			this.wrongDates = true;
		}else{
			this.wrongDates = false;
		}

	}

	onSelectPlants(plants: any){
		this.model.plants_produced = this.plantation_plants;
	}

}