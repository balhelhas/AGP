import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { AuthService } from '../auth/auth.service';
import { PlantService } from './plant.service';
import { Plant } from '../objects/plant';


@Component({
  moduleId: module.id,
  selector: 'edit_plant',
  templateUrl: 'edit_plant.component.html',
  styleUrls: ['plant.component.css'],
})

export class EditPlantComponent implements OnInit{
	model = new Plant('','','','','');

	constructor(private router: Router,
				private route: ActivatedRoute,
				private plantService: PlantService,
				private authService: AuthService){}

	ngOnInit(){
		this.plantService.getPlant(this.authService.currentUser,this.route.snapshot.params['id']).subscribe(r => {
			this.model = r;
		})
	}

	editPlant(){
		this.plantService.updatePlant(this.authService.currentUser, this.model).subscribe(r => {
			if(r != null) {
				this.router.navigate(['/plants']);
			}
		})
	}

	cancelEdit(){
		this.router.navigate(['/plants']);
	}

}