export class Measure {
	public _id: string;
	public sensor_id: string;
	public value: number;
	public date: Date;

	public constructor(sensor_id:string, value:number, 
						date:Date){
		this.sensor_id = sensor_id;
		this.value = value;
		this.date = date;
	}
}