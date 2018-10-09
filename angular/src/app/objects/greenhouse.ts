export class Greenhouse {
	public _id: string;
	public land_id: string;
	public name: string;

	public constructor(land_id:string, name:string){
		this.land_id = land_id;
		this.name = name;

	}
}

