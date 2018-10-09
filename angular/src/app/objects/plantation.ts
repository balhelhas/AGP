import { Plant } from './plant';

export class Plantation {
	public _id: string;
	public row_id: string;
	public start_date: any;
	public end_date: any;
	public plants_produced: Plant[]; 
	public state: boolean;

	public constructor(row_id:string, start_date:any, 
						end_date:any){
		this.row_id = row_id;
		this.start_date = start_date;
		this.end_date = end_date;
		this.plants_produced = [];
		this.state = true;
	}
}