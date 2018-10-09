import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IMyDpOptions, IMyDateModel} from 'mydatepicker';

import { AuthService } from '../auth/auth.service';
import { PlantationService } from './plantation.service';
import { Plantation } from '../objects/plantation';
import { PlantService } from '../plant/plant.service';
import { Plant } from '../objects/plant'

@Component({
  moduleId: module.id,
  selector: 'edit_plantation',
  templateUrl: 'edit_plantation.component.html'
})

export class EditPlantationComponent implements OnInit{
	model = new Plantation(this.route.snapshot.params['row'],null,null);
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
		this.plantationService.getPlantation(this.authService.currentUser, this.route.snapshot.params['id']).subscribe(r => {
			this.model = r;
		})


		this.plantService.getPlants(this.authService.currentUser).subscribe(r => {
			r.forEach((plant:Plant) => {
				this.plants.push(plant);
			})
		})
	}

	editPlantation() {
		this.plantationService.updatePlantation(this.authService.currentUser, this.model).subscribe(r => {
			this.router.navigate(['/row', this.route.snapshot.params['row']]);
		});
	}

	cancelCreate(){
		this.router.navigate(['/row', this.route.snapshot.params['row']]);
	}

	onStartDateChanged(event: IMyDateModel) {
		this.model.start_date = event.jsdate;
		if(this.model.end_date <= this.model.start_date && this.model.end_date != null){
			this.wrongDates = true;
		}else{
			this.wrongDates = false;
		}
	}

	onEndDateChanged(event: IMyDateModel) {
		this.model.end_date = event.jsdate;
		if(this.model.end_date <= this.model.start_date && this.model.start_date != null && this.model.end_date != null){
			this.wrongDates = true;
		}else{
			this.wrongDates = false;
		}

	}

	onSelectPlants(plants: any){
		this.model.plants_produced = this.plantation_plants;
	}


}