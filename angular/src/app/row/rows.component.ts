import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { AuthService } from '../auth/auth.service';
import { LandService } from '../land/land.service';
import { GreenhouseService } from '../greenhouse/greenhouse.service';
import { RowService } from './row.service';

import { Land } from '../objects/land';
import { Greenhouse } from '../objects/greenhouse';
import { Row } from '../objects/row';


@Component({
  moduleId: module.id,
  selector: 'rows',
  templateUrl: 'rows.component.html',
  styleUrls: ['row.component.css']
})

export class RowsComponent implements OnInit{
	lands: Land[] = [];
	greenhouses: Greenhouse[] = [];
	rows: Row[] = [];
	existing_rows: Row[] = [];
	model = new Row('','');
	rowNameTaken: boolean;
	selectedLand: Land = null;
	selectedGreenhouses: Greenhouse[] = [];
	p: number = 1;

	constructor(private router: Router,
				private landService: LandService,
				private authService: AuthService,
				private greenhouseService: GreenhouseService,
				private rowService: RowService){}

	ngOnInit(){
		this.refreshArrays();
	}

	refreshArrays() {
		this.lands = [];
		this.greenhouses = [];
		this.rows = [];
		this.existing_rows = [];
		
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
				this.greenhouses.forEach(greenhouse => {
					this.rowService.getRows(this.authService.currentUser, greenhouse._id).subscribe(r => {
						if( r != null){
							r.forEach((row:Row) => {
								if (row.name !== '0'){
									this.existing_rows.push(row);
									this.rows.push(row);
								}
							})
						}
					})
				})
			})
		});
	}

	onSelectLand(land:any){
		if(land != null){
			this.rows = [];

			this.selectedLand = land;

			this.selectedGreenhouses = this.greenhouses.filter(greenhouse => greenhouse.land_id == land._id);

			this.selectedGreenhouses.forEach(greenhouse => {
				this.rowService.getRows(this.authService.currentUser, greenhouse._id).subscribe(r => {
					r.forEach((row:Row) => {
						if (row.name !== '0'){
							this.rows.push(row);
						}
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
			this.rows = [];
			
			this.rowService.getRows(this.authService.currentUser, greenhouse._id).subscribe(r => {
				r.forEach((row:Row) => {
					if (row.name !== '0'){
						this.rows.push(row);
					}
				})
			})
		}else{
			this.rows = [];

			this.selectedGreenhouses = this.greenhouses.filter(greenhouse => greenhouse.land_id == this.selectedLand._id);

			this.selectedGreenhouses.forEach(greenhouse => {
				this.rowService.getRows(this.authService.currentUser, greenhouse._id).subscribe(r => {
					r.forEach((row:Row) => {
						if (row.name !== '0'){
							this.rows.push(row);
						}
					})
				})
			})
		}

			
	}
}