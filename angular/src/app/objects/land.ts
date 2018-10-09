export class Land {
	public _id: string;
	public owner_id: string;
	public name: string;
	public address: string;
	public zip_code: string;
	public location: string;
	public description: string;
	public state: boolean;
		

	public constructor(owner_id:string, name:string, 
						address:string, zip_code:string,
						location:string, description:string){
		this.owner_id = owner_id;
		this.name = name;
		this.address = address;
		this.zip_code = zip_code;
		this.location = location;
		this.description = description;
		this.state = true;
	}
}