import { MeasureVariables } from './measure_variables';

export class Sensor {
	public _id: string;
	public row_id: string;
	public identificator: string;
	public measure_variable: string;
	public measure_unit: string;
	public image_path: string;
	public description: string;
	public state: boolean;

	public constructor(row_id: string, identificator:string,
						description:string, measure_variable:string){
		this.row_id = row_id;
		this.identificator = identificator;
		this.measure_variable = measure_variable;
		this.measure_unit = this.setMeasureUnit(measure_variable);
		this.image_path = this.setSensorImage(measure_variable);
		this.description = description;
		this.state = false;
	}

	setMeasureUnit(variable:string): string {
		switch (variable) {
			case MeasureVariables[MeasureVariables.Temperatura]:
				return "Cº";
			case MeasureVariables[MeasureVariables.Humidade]:
				return "%";
			case MeasureVariables[MeasureVariables.Luminosidade]:
				return "%";
			case MeasureVariables[MeasureVariables.PH]:
				return "pH";
			case MeasureVariables[MeasureVariables.Condutividade]:
				return "S/cm";
			case MeasureVariables[MeasureVariables.Litro]:
				return "l"
		}
	}

	setSensorImage(variable:string): string { 
		switch (variable) {
			case MeasureVariables[MeasureVariables.Temperatura]:
				return "images/temperature-icon.png";
			case MeasureVariables[MeasureVariables.Humidade]:
				return "images/humidity-icon.png";
			case MeasureVariables[MeasureVariables.Luminosidade]:
				return "images/luminosity-icon.png";
			case MeasureVariables[MeasureVariables.PH]:
				return "images/water-ph-icon.png";
			case MeasureVariables[MeasureVariables.Condutividade]:
				return "images/water-ce-icon.png";
			case MeasureVariables[MeasureVariables.Litro]:
				return "images/water-volume-icon.png"
		}
	}
}