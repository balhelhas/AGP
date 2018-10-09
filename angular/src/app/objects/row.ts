export class Row {
	public _id: string;
	public greenhouse_id: string;
	public name: string;

	public constructor(greenhouse_id:string, name:string){
		this.greenhouse_id = greenhouse_id;
		this.name = name;
	}
}