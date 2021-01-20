import { ErrorHandler, NgModule, Injectable, Injector, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
//import { HomePage } from '../pages/home/home';
import { HelpPage } from '../pages/help/help';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';
import { DatabaseProvider } from '../providers/database/database';
import { CookieService } from 'ngx-cookie-service';
//import { Pro } from '@ionic/pro';
import { DatePipe } from '@angular/common';
import { CmeProcessesProvider } from '../providers/cme-processes/cme-processes';
import { AppErrorHandlerProvider } from '../providers/app-error-handler/app-error-handler';
import { ComponentsModule} from '../components/components.module';
import { ConfDaysProcessesProvider } from '../providers/conf-days-processes/conf-days-processes';
import { SrkServicesProvider } from '../providers/srk-services/srk-services';

/* Pro.init('cordova plugin add cordova-plugin-ionic --save --variable APP_ID=060d2d13 --variable CHANNEL_NAME=master', {
  appVersion: "3.1.0"
});  */

@Injectable()
export class MyErrorHandler implements ErrorHandler {
  ionicErrorHandler: IonicErrorHandler;

  constructor(injector: Injector) {
    try {
      this.ionicErrorHandler = injector.get(IonicErrorHandler);
    } catch(e) {
      console.log('general ERROR: ' + e);
      // Unable to get the IonicErrorHandler provider, ensure 
      // IonicErrorHandler has been added to the providers list below
    }
  }

  handleError(err: any): void {
    // Pro.monitoring.handleNewError(err);
    // Remove this if you want to disable Ionic's auto exception handling in development mode.
    // this.ionicErrorHandler && this.ionicErrorHandler.handleError(err);
  }
} 

@NgModule({
  declarations: [
    MyApp,
    HelpPage
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    BrowserModule,
    HttpModule,
    ComponentsModule,
    //Day1Page,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelpPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CookieService,
    DatePipe,
  /*  { provide: ErrorHandler, useClass: AppErrorHandlerProvider }, */
    DatabaseProvider,
    CmeProcessesProvider,
    AppErrorHandlerProvider,
    ConfDaysProcessesProvider,
    SrkServicesProvider
  ]
})
export class AppModule {}
