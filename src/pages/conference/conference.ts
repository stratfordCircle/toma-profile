import { Component } from '@angular/core'; // , Output, EventEmitter
import { clientVars } from '../../environments/environment';
import { IonicPage, NavController, NavParams } from "ionic-angular";
// import { ConfDaysProcessesProvider } from "../../providers/conf-days-processes/conf-days-processes";
import { CookieService } from "ngx-cookie-service";
// import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: "page-conference",
  templateUrl: "conference.html"
})
export class ConferencePage {
  activePage: number = 1;
  totalCredits: number = 0;
  currentUser: string;
  greeting: string;
  confDays: Array<{ show: string; revealDate: Date; style: string }>;
  // MAKE ALL DATES IN THE PAST
  dayOneAvailable = new Date("May 2 2017 6:00:00");
  dayTwoAvailable = new Date("May 3 2017 6:00:00");
  dayThreeAvailable = new Date("May 4 2017 6:00:00");
  dayFourAvailable = new Date("May 5 2017 6:00:00");

  public conferenceName : string;
  
  attestationDateAvailable = new Date("May 5 2018 6:00:00");

  //currentLocalTime = new Date("May 5 2018 7:00:00");

  currentLocalTime = new Date(); //Date.now(); //1482905176396
  apiURL: string;
  constructor(
    public navCtrl: NavController,
    private cookieService: CookieService,
    public navParams: NavParams
  ) 
  {
    this.apiURL = clientVars.apiURL;
  }

  ionViewDidEnter() {

    this.conferenceName = this.navParams.get('param1');
    console.log('here goes the conference:, ' + this.conferenceName);
    this.activePage = 1;
    //console.log("ionViewDidEnter ConferencePage");

 
    //console.log('dayOneavailable: ' + this.dayOneAvailable);

//    this.cookieService.set("entryCheck", "conference", 0.02083333);

  //  if (!this.cookieService.get("tokenFB_Num")) {
      //started from conferene
    

    if (this.cookieService.get("tokenFB_Num")) {
      // IF MEMBERCLICKS AUTHENTICATED
      console.log("have cookie");

      // SRK USED ANYWHERE?
      // this.currentUser = this.cookieService.get("tokenFB_Num"); // SET THIS TO MAKE SURE IT IS THERE

      if ((this.greeting == "") || (this.greeting === undefined) ) {

        //    console.log('in check greeting block');
              let suffix = this.cookieService.get('token_suffix');
              let token_first = this.cookieService.get('token_first');
              let token_last = this.cookieService.get('token_last');
              let token_membertype = this.cookieService.get('token_membertype');
              let token_Num = this.cookieService.get('tokenFB_Num');
              let credential = this.cookieService.get('token_credential');
        
              Promise.all([suffix, token_first, token_last, token_membertype, token_Num, credential]).then((values) => {
               
                console.log('values 0' + values[5]);

                 if (values[0] == 'D.O.')
                 {
        //           console.log('greeting 1' + values[0]);
                   this.greeting = "Dr. " + values[2];
        //           console.log('greeting assigned ' + this.greeting);
                   this.cookieService.set('cme_greeting', this.greeting,  0.02083333);
                 }  
                 else
                 {
        //           console.log('greeting 2' + values[1]);
                   this.greeting = values[0] + ' ' + values[1] + ' ' + values[2] + ' - ' + 'Member Type: ' + values[3] ; //  + ' ' + MemberNumber;
                   //this.cookieService.set('cme_greeting', this.greeting,  0.02083333);
                   //window.history.replaceState(null, null, window.location.pathname);
                 }  
        
                });
            }



    } else {
      //alert('about to get token with conference in url');
      //alert("CONFERENCE.TS - no tokenFB_Num, so routing here to authorize URL - put a message here, maybe as this is a long wait");
      
      window.location.assign(this.apiURL); 
         
    }
  }

  changeDay(dayNumber) {
    this.activePage = dayNumber;
  }

  mainCMEPage () {
    //alert('this.resultsExist ' + this.resultsExist );
    //this.navCtrl.push(HomePage);
    window.location.assign("https://toma-cme.firebaseapp.com");
  }

/*   checkActive(dayNumber) {
    console.log("checkActive " + dayNumber);
    return dayNumber == this.activePage;
  }  */

 /*  returnCredits(credits){
    console.log('called returnCredits');
    this.totalCredits = credits;
  } */
}
