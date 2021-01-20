import { Component } from "@angular/core"; //, Output, EventEmitter
import {
  AlertController,
  //IonicPage,
  NavController,
  NavParams
} from "ionic-angular";
import { ConfDaysProcessesProvider } from "../../providers/conf-days-processes/conf-days-processes";
//import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "day-three",
  templateUrl: "day-three.html"
})
export class DayThreeComponent {
  //@Output() returnCredits = new EventEmitter();

  text: string;
  //form: FormGroup;
  data: any;
  session_8: boolean = false;
  session_9: boolean = false; // FIRST OPTIONAL COURSE
  session_10: boolean = false;
  public sessionNum = [];
  totalCredits: number = 0;

  // FIND THE COOL CODE TO USE HERE TO GRAB ALL NEEDED COOKIES AT ONCE
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public confProv: ConfDaysProcessesProvider,
    //public _FB: FormBuilder,
    private _ALERT: AlertController,
    public cookieService: CookieService
  ) {
 
    var rec;
    for (rec = 0; rec < 10; rec++) {
      this.sessionNum.push({
        id: "none"
      });
    }
    //alert('checking for token ***');

    let loggedIn = this.cookieService.get("tokenFB_Num");

    if (loggedIn) {
    //alert('we have the token');
      this.getTodaysRecords();
    }
  }

  // CAN THIS BE MOVED TO THE CONF DAYS FUNCTION? - TAKE IN THE DAY?
  getTodaysRecords(): void {
    this.confProv.getRecordsForSpecifiedDay(3).then(data => {
      if (data) {
        var i = 0;
//        var k;

        console.log('no data?');

        while (data[i] !== undefined) {
          console.log("these count: " + data[i].hours);
          this.totalCredits = this.totalCredits + data[i].hours;
          if (data[i].session_number == 8) {
            this.session_8 = true;
          //  this.sessionNum[8].id = data[i].id;
          }
          if (data[i].session_number == 9) {
            this.session_9 = true;
          //  this.sessionNum[9].id = data[i].id;
          }
          if (data[i].session_number == 10) {
            this.session_10 = true;
          //  this.sessionNum[10].id = data[i].id;
          }
          i++;
        }
      } // END OF CHECK FOR DATA
    });
  }

  updateSession(checkFlag, sessionNum) {
    // FLIP FLAGS, COUNT CREDITS AND GO TO REMOTE METHOD TO UPDATE THE SESSION
    // UPDATES ANY SESSION ON THIS PAGE

    console.log('sessionNum ' + sessionNum);
    console.log('checkFlag ' + checkFlag);
    console.log('this.session_8 ' + this.session_8);
    console.log('this.session_9 ' + this.session_9);
    console.log('this.session_10 ' + this.session_10);

    if (sessionNum === 8) {
      if (checkFlag === true) {
        checkFlag = false;
        this.totalCredits = this.totalCredits - 4.5;
      } else {
        checkFlag = true;
        this.totalCredits = this.totalCredits + 4.5;
      }
      this.session_8 = checkFlag;
    }
    if (sessionNum === 9) {
      if (checkFlag === true) {

        checkFlag = false;
        this.totalCredits = this.totalCredits - 3.75;
      } else {
        if (this.session_10 === true)
        {
          this.displayConcurrentSessionsAlert('This session is concurrent with the optional course: OMM Workshop.');
          return false;
        }

        checkFlag = true;
        this.totalCredits = this.totalCredits + 3.75;
      }
      this.session_9 = checkFlag;
    }
    if (sessionNum === 10) {
      if (checkFlag === true) {

        checkFlag = false;
        this.totalCredits = this.totalCredits - 3;
      } else {
        if (this.session_9 === true)
        {
          this.displayConcurrentSessionsAlert('This session is concurrent with the course: Sports Medicine & Orthopedics.');
          return false;
        }

        checkFlag = true;
        this.totalCredits = this.totalCredits + 3;
      }
      this.session_10 = checkFlag;
    }
   
    this.confProv.updateConferenceSession(checkFlag, sessionNum);

  }


  displayConcurrentSessionsAlert(title      : string) : void
{
let alert : any     = this._ALERT.create({
title      : title,
buttons    : [{
text      : 'Got It!'
}]
});
alert.present();
}

}
