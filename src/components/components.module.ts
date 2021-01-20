import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { DayOneComponent } from './day-one/day-one';
import { DayTwoComponent } from './day-two/day-two';
import { DayThreeComponent } from './day-three/day-three';
import { DayFourComponent } from './day-four/day-four';
import { SummaryComponent } from './summary/summary';
import { PofpsCertComponent } from './pofps-cert/pofps-cert';

@NgModule({
	declarations: [
    DayOneComponent,
    DayTwoComponent,
    DayThreeComponent,
    DayFourComponent,
    SummaryComponent,
    PofpsCertComponent
    ],
	imports: [IonicModule],
	exports: [
    DayOneComponent,
    DayTwoComponent,
    DayThreeComponent,
    DayFourComponent,
    SummaryComponent,
    PofpsCertComponent
    ]
})
export class ComponentsModule {}
