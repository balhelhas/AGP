import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RoutingModule } from './routing.module';

//###### EXTERNAL MODULES ######
import { MyDatePickerModule } from 'mydatepicker';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AccordionModule } from 'ngx-bootstrap';
import { CarouselModule } from 'ngx-bootstrap';
import { ChartModule } from 'angular2-highcharts';


//###### APP MAIN COMPONENTS ######
import { AppComponent }  from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './home/about.component';
import { SensorsDataComponent } from './visualization/sensors_data.component';
import { UserProfileComponent } from './user/user_profile.component';
import { UserEditComponent } from './user/user_edit.component';
import { UserService } from './user/user.service';

//###### AUTHENTICATION: COMPONENTS && SERVICE ######
import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { AuthService } from './auth/auth.service';
import { LoggedGuard } from './auth/logged.guard';

//###### LAND: COMPONENTS && SERVICE ######
import { NewLandComponent } from './land/new_land.component';
import { EditLandComponent } from './land/edit_land.component';
import { LandsComponent } from './land/lands.component';
import { LandComponent } from './land/land.component';
import { LandService } from './land/land.service';

//###### GREENHOUSE: COMPONETS && SERVICE ######
import { NewGreenhouseComponent } from './greenhouse/new_greenhouse.component';
import { EditGreenhouseComponent } from './greenhouse/edit_greenhouse.component';
import { GreenhousesComponent } from './greenhouse/greenhouses.component';
import { GreenhouseComponent } from './greenhouse/greenhouse.component';
import { GreenhouseService } from './greenhouse/greenhouse.service';

//###### ROW: COMPONENTS && SERVICE ######
import { NewRowComponent } from './row/new_row.component';
import { EditRowComponent } from './row/edit_row.component';
import { RowsComponent } from './row/rows.component';
import { RowComponent } from './row/row.component';
import { RowService } from './row/row.service';

//###### SENSOR: COMPONENTS && SERVICE ######
import { NewSensorComponent } from './sensor/new_sensor.component';
import { EditSensorComponent } from './sensor/edit_sensor.component';
import { SensorsComponent } from './sensor/sensors.component';
import { SensorComponent } from './sensor/sensor.component';
import { SensorService } from './sensor/sensor.service';

//###### MEASURE: SERVICE ######
import { MeasureService } from './measure/measure.service';

//###### PLANTATION: COMPONENTS && SERVICE ######
import { NewPlantationComponent } from './plantation/new_plantation.component';
import { EditPlantationComponent } from './plantation/edit_plantation.component';
import { PlantationService } from './plantation/plantation.service';


//###### PLANT: COMPONENTS && SERVICE ######
import { NewPlantComponent } from './plant/new_plant.component';
import { EditPlantComponent } from './plant/edit_plant.componet';
import { PlantsComponent } from './plant/plants.component';
import { PlantService } from './plant/plant.service';

//###### WEATHER: COMPONENT && SERVICE ######
import { WeatherComponent } from './weather/weather.component';
import { WeatherService } from './weather/weather.service';

@NgModule({
  imports: [ 
  	BrowserModule,
  	FormsModule,
  	HttpModule,
  	RoutingModule,
    MyDatePickerModule,
    NgxPaginationModule,
    NgbModule.forRoot(),
    AccordionModule.forRoot(),
    CarouselModule.forRoot(),
    ChartModule.forRoot(require('highcharts'))
  ],
  declarations: [ 
  	AppComponent,
    HomeComponent,
    AboutComponent,
    SensorsDataComponent,
    UserProfileComponent,
    UserEditComponent,
  	LoginComponent,
  	RegisterComponent,
    NewLandComponent,
    EditLandComponent,
    LandsComponent,
    LandComponent,
    NewGreenhouseComponent,
    EditGreenhouseComponent,
    GreenhousesComponent,
    GreenhouseComponent,
    NewRowComponent,
    EditRowComponent,
    RowsComponent,
    RowComponent,
    NewSensorComponent,
    EditSensorComponent,
    SensorsComponent,
    SensorComponent,
    NewPlantationComponent,
    EditPlantationComponent,
    NewPlantComponent,
    EditPlantComponent,
    PlantsComponent,
    WeatherComponent
  ],
  providers: [
  	AuthService,
  	LoggedGuard,
    LandService,
    GreenhouseService,
    RowService,
    SensorService,
    MeasureService,
    PlantationService,
    PlantService,
    WeatherService,
    UserService  
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
