export class User {
	public _id: string;
	public username: string;
	public password: string;
	public email: string;
	public first_name: string;
	public last_name: string;
	public location: string;
	public gender: string;
	public token: string;

	public constructor(username:string, password:string,
						email:string, first_name:string,
						last_name:string, location:string,
						gender:string){
		this.username = username;
		this.password = password;
		this.email = email;
		this.first_name = first_name;
		this.last_name = last_name;
		this.location = location;
		this.gender = gender;
		
	}
}