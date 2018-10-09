import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';

import { PlantService } from '../plant/plant.service';
import { Plant } from '../objects/plant';

@Component({
  moduleId: module.id,
  selector: 'plants',
  templateUrl: 'plants.component.html',
  styleUrls: ['plant.component.css'],
})

export class PlantsComponent implements OnInit{
	plants: Plant[] = [];
	p: number = 1;

	constructor(private route: ActivatedRoute,
				private router: Router,
				private authService: AuthService,
				private plantService: PlantService){}


	ngOnInit(){
		this.refreshArrays();
	}

	refreshArrays(){
		this.plants = [];

		this.plantService.getPlants(this.authService.currentUser).subscribe(r => {
			r.forEach((plant:Plant) => {
				this.plants.push(plant);
			})
		})
	}

	editPlant(editPlant: Plant){
		this.router.navigate(['/plant/edit', editPlant._id]);
	}

	deletePlant(deletePlant: Plant){
		this.plantService.deletePlant(this.authService.currentUser,deletePlant._id).subscribe(r => {
			this.refreshArrays();
		})
	}
}