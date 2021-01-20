import { ConferencePage } from './conference';
//import { ConfDaysProcessesProvider } from '../../providers/conf-days-processes/conf-days-processes';
import { ComponentsModule} from '../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    ConferencePage
//    ConfDaysProcessesProvider
//    ComponentsModule
  ],
//  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonicPageModule.forChild(ConferencePage),
    ComponentsModule
  ],
})
export class ConferencePageModule {}

/* ContactPage,
Day1Page,
Day2Page,
Day3Page,
Day4Page,
ConfDaysProcessesProvider, */

/* import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConferencePage } from './conference';

@NgModule({
  declarations: [
    ConferencePage,
  ],
  imports: [
    IonicPageModule.forChild(ConferencePage),
  ],
})
export class ConferencePageModule {}
 */