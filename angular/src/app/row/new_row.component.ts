import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { RowService } from './row.service';
import { Row } from '../objects/row';

@Component({
  moduleId: module.id,
  selector: 'new_row',
  templateUrl: 'new_row.component.html',
  styleUrls: ['row.component.css'],
})

export class NewRowComponent {
	model = new Row(this.route.snapshot.params['id'],'');
	rowNameTaken: boolean;

	constructor(private authService: AuthService, 
				private router: Router,
				private route: ActivatedRoute,
				private rowService: RowService){}

	createRow(){
		this.rowService.createRow(this.authService.currentUser, this.model).subscribe(r => {
			if(r['msg'] === 'Row name already taken'){
				this.rowNameTaken = true;
			}else{
				this.router.navigate(['/greenhouse', r.greenhouse_id]);
			}
		});
	}

	cancelCreate(){
		this.router.navigate(['/greenhouse', this.route.snapshot.params['id']]);
	}
}