import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoggedGuard } from './auth/logged.guard';
import { HomeComponent }  from './home/home.component';
import { AboutComponent } from './home/about.component';
import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { UserProfileComponent } from './user/user_profile.component';
import { UserEditComponent } from './user/user_edit.component';

import { NewLandComponent } from './land/new_land.component';
import { EditLandComponent } from './land/edit_land.component';
import { LandsComponent } from './land/lands.component';
import { LandComponent } from './land/land.component';

import { NewGreenhouseComponent } from './greenhouse/new_greenhouse.component';
import { EditGreenhouseComponent } from './greenhouse/edit_greenhouse.component';
import { GreenhousesComponent } from './greenhouse/greenhouses.component';
import { GreenhouseComponent } from './greenhouse/greenhouse.component';

import { NewRowComponent } from './row/new_row.component';
import { EditRowComponent } from './row/edit_row.component';
import { RowsComponent } from './row/rows.component';
import { RowComponent } from './row/row.component';

import { NewSensorComponent } from './sensor/new_sensor.component';
import { EditSensorComponent } from './sensor/edit_sensor.component';
import { SensorsComponent } from './sensor/sensors.component';
import { SensorComponent } from './sensor/sensor.component';

import { NewPlantationComponent } from './plantation/new_plantation.component';
import { EditPlantationComponent } from './plantation/edit_plantation.component';

import { NewPlantComponent } from './plant/new_plant.component';
import { EditPlantComponent } from './plant/edit_plant.componet';
import { PlantsComponent } from './plant/plants.component';

const routes: Routes = [
  	{ path: '', redirectTo: '/login', pathMatch: 'full' },
  	{ path: 'login', component: LoginComponent },
  	{ path: 'register', component: RegisterComponent },
    { path: 'about', component: AboutComponent },
    { path: 'home', component: HomeComponent, canActivate: [LoggedGuard] },
    { path: 'profile', component: UserProfileComponent, canActivate: [LoggedGuard]},
    { path: 'user/edit', component: UserEditComponent, canActivate: [LoggedGuard]},
    { path: 'land/new', component: NewLandComponent, canActivate: [LoggedGuard] },
    { path: 'land/edit/:id', component: EditLandComponent, canActivate: [LoggedGuard] },
    { path: 'lands', component: LandsComponent, canActivate: [LoggedGuard] },
    { path: 'land/:id', component: LandComponent, canActivate: [LoggedGuard] },
    { path: 'greenhouse/new/:id', component: NewGreenhouseComponent, canActivate: [LoggedGuard] },
    { path: 'greenhouse/edit/:id', component: EditGreenhouseComponent, canActivate: [LoggedGuard] },
    { path: 'greenhouses', component: GreenhousesComponent, canActivate: [LoggedGuard] },
    { path: 'greenhouse/:id', component: GreenhouseComponent, canActivate: [LoggedGuard] },
    { path: 'row/new/:id', component: NewRowComponent, canActivate: [LoggedGuard] },
    { path: 'row/edit/:id', component: EditRowComponent, canActivate: [LoggedGuard] },
    { path: 'rows', component: RowsComponent, canActivate: [LoggedGuard] },
    { path: 'row/:id', component: RowComponent, canActivate: [LoggedGuard] },
    { path: 'sensor/new/:id', component: NewSensorComponent, canActivate: [LoggedGuard] },
    { path: 'sensor/edit/:id', component: EditSensorComponent, canActivate: [LoggedGuard] },
    { path: 'sensors', component: SensorsComponent, canActivate: [LoggedGuard] },
    { path: 'sensor/:id', component: SensorComponent, canActivate: [LoggedGuard] },
    { path: 'plantation/new/:id', component: NewPlantationComponent, canActivate: [LoggedGuard] },
    { path: 'plantation/edit/:id/:row', component: EditPlantationComponent, canActivate: [LoggedGuard]},
    { path: 'plant/new', component: NewPlantComponent, canActivate: [LoggedGuard]},
    { path: 'plant/edit/:id', component: EditPlantComponent, canActivate: [LoggedGuard]},
    { path: 'plants', component: PlantsComponent, canActivate: [LoggedGuard] }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class RoutingModule {}
