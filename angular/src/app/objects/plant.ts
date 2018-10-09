export class Plant {
	public _id: string;
	public user_id: string;
	public popular_name: string;
	public scientific_name: string;
	public color: string;
	public description: string;

	public constructor(user_id: string, popular_name:string, scientific_name:string, color:string, description: string){
		this.user_id = user_id;
		this.popular_name = popular_name;
		this.scientific_name = scientific_name;
		this.color = color;
		this.description = description;
	}
}
