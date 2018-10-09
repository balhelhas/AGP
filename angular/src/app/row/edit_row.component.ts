import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { RowService } from './row.service';
import { Row } from '../objects/row';


@Component({
  moduleId: module.id,
  selector: 'edit_row',
  templateUrl: 'edit_row.component.html',
  styleUrls: ['row.component.css'],
})

export class EditRowComponent implements OnInit{
	model = new Row('','');
	rowNameTaken: boolean;

	constructor(private router: Router,
				private route: ActivatedRoute,
				private rowService: RowService,
				private authService: AuthService){}

	ngOnInit(){
		this.rowService.getRow(this.authService.currentUser, this.route.snapshot.params['id']).subscribe(r => {		
			this.model = r;
		});
	}	

	editRow(){
		this.rowService.editRow(this.authService.currentUser, this.model).subscribe(r => {
			if(r['msg'] === 'Greenhouse name already taken'){
				this.rowNameTaken = true;
			}else{
				this.router.navigate(['/row', r._id]);
			}
		})
	}

	cancelEdit(){
		this.router.navigate(['/row', this.model._id]);
	}
}