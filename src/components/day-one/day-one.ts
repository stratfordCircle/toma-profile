import { Component } from "@angular/core"; //, Output, EventEmitter
import {
  AlertController,
//  IonicPage,
  NavController,
  NavParams
} from "ionic-angular";
import { ConfDaysProcessesProvider } from "../../providers/conf-days-processes/conf-days-processes";
//import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "day-one",
  templateUrl: "day-one.html"
})
export class DayOneComponent {
  //@Output() returnCredits = new EventEmitter();

  text: string;
  //form: FormGroup;
  data: any;
  session_1: boolean = false;
  session_2: boolean = false; // FIRST OPTIONAL COURSE
  session_3: boolean = false;
  session_4: boolean = false;
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
    this.confProv.getRecordsForSpecifiedDay(1).then(data => {
      if (data) {
        var i = 0;
//        var k;

        console.log('no data?');

        while (data[i] !== undefined) {
          console.log("these count: " + data[i].hours);
          this.totalCredits = this.totalCredits + data[i].hours;
          if (data[i].session_number == 1) {
            this.session_1 = true;
        //    this.sessionNum[1].id = data[i].id;
          }
          if (data[i].session_number == 2) {
            this.session_2 = true;
        //    this.sessionNum[2].id = data[i].id;
          }
          if (data[i].session_number == 3) {
            this.session_3 = true;
        //    this.sessionNum[3].id = data[i].id;
          }
          if (data[i].session_number == 4) {
            this.session_4 = true;
        //    this.sessionNum[4].id = data[4].id;
          }
          i++;
        }
      } // END OF CHECK FOR DATA
    });
  }

  updateSession(checkFlag, sessionNum) {
    // FLIP FLAGS, COUNT CREDITS AND GO TO REMOTE METHOD TO UPDATE THE SESSION
    // UPDATES ANY SESSION ON THIS PAGE

    if (sessionNum === 1) {
      if (checkFlag === true) {
        checkFlag = false;
        this.totalCredits = this.totalCredits - 3;
      } else {
        if (this.session_2 === true)
        {
          this.displayConcurrentSessionsAlert('This session is concurrent with the optional course: Basic Life Support for Physicians.');
          return false;
        }
        checkFlag = true;
        this.totalCredits = this.totalCredits + 3;
      }
      this.session_1 = checkFlag;
    }
    if (sessionNum === 2) {
      if (checkFlag === true) {
        checkFlag = false;
        this.totalCredits = this.totalCredits - 3;
      } else {
        if (this.session_1 === true)
        {
          this.displayConcurrentSessionsAlert('This session is concurrent with the Opening Session.');
          return false;
        }
        checkFlag = true;
        this.totalCredits = this.totalCredits + 3;
      }
      this.session_2 = checkFlag;
    }
    if (sessionNum === 3) {
      if (checkFlag === true) {
        checkFlag = false;
        this.totalCredits = this.totalCredits - 5;
      } else {
        checkFlag = true;
        this.totalCredits = this.totalCredits + 5;
      }
      this.session_3 = checkFlag;
    }
    if (sessionNum === 4) {
      if (checkFlag === true) {
        checkFlag = false;
        this.totalCredits = this.totalCredits - 3;
      } else {
        checkFlag = true;
        this.totalCredits = this.totalCredits + 3;
      }
      this.session_4 = checkFlag;
    }

    console.log('session 3: ' + this.session_3);

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
