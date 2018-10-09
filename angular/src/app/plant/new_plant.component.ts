import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { AuthService } from '../auth/auth.service';
import { PlantService } from './plant.service';
import { Plant } from '../objects/plant';


@Component({
  moduleId: module.id,
  selector: 'new_plant',
  templateUrl: 'new_plant.component.html',
  styleUrls: ['plant.component.css'],
})

export class NewPlantComponent {
	model = new Plant(this.authService.currentUser._id,'','','','');

	constructor(private router: Router,
				private route: ActivatedRoute,
				private plantService: PlantService,
				private authService: AuthService){}

	createPlant(){
		this.plantService.createPlant(this.authService.currentUser, this.model).subscribe(r => {
			if(r != null) {
				this.router.navigate(['/plants']);
			}
		})
	}

	cancelCreate(){
		this.router.navigate(['/plants']);
	}

}