import { environment} from '../environments/environment';
import firebase from 'firebase';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//import { TabsPage } from '../pages/tabs/tabs';
//import { HomePage } from '../pages/home/home';
//import { ContactPage } from '../pages/contact/contact';
//import { ProgressBarComponent } from '../components/progress-bar/progress-bar';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: string = 'HomePage'; // 'ConferencePage'; //'attestation'; //HomePage
//  orientation: string;

  //rootPage:any = HomePage; //TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
//      this.orientation = this.screenOrientation.type;
      statusBar.styleDefault();
      splashScreen.hide();
    });

    firebase.initializeApp(environment.firebase);

    console.log('test new environment vars from app.component: ' + environment.firebase.projectId);

   }
}
