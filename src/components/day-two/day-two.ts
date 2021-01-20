import { Component} from "@angular/core"; //, Output, EventEmitter
import {
//  AlertController,
//  IonicPage,
  NavController,
  NavParams
} from "ionic-angular";
import { ConfDaysProcessesProvider } from "../../providers/conf-days-processes/conf-days-processes";
//import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "day-two",
  templateUrl: "day-two.html"
})
export class DayTwoComponent {
  //@Output() returnCredits = new EventEmitter();

  text: string;
  //form: FormGroup;
  data: any;
  session_5: boolean = false;
  session_6: boolean = false; 
  session_7: boolean = false;
    public sessionNum = [];
  totalCredits: number = 0;

  // FIND THE COOL CODE TO USE HERE TO GRAB ALL NEEDED COOKIES AT ONCE
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public confProv: ConfDaysProcessesProvider,
    //public _FB: FormBuilder,
//    private _ALERT: AlertController,
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
    this.confProv.getRecordsForSpecifiedDay(2).then(data => {
      if (data) {
        var i = 0;
        //var k;

        console.log('no data?');

        while (data[i] !== undefined) {
          console.log("these count: " + data[i].hours);
          this.totalCredits = this.totalCredits + data[i].hours;
          if (data[i].session_number == 5) {
            this.session_5 = true;
        //    this.sessionNum[5].id = data[i].id;
          }
          if (data[i].session_number == 6) {
            this.session_6 = true;
        //    this.sessionNum[6].id = data[i].id;
          }
          if (data[i].session_number == 7) {
            this.session_7 = true;
        //    this.sessionNum[7].id = data[i].id;
          }
           i++;
        }
      } // END OF CHECK FOR DATA
    });
  }

  updateSession(checkFlag, sessionNum) {
    // FLIP FLAGS, COUNT CREDITS AND GO TO REMOTE METHOD TO UPDATE THE SESSION
    // UPDATES ANY SESSION ON THIS PAGE

    if (sessionNum === 5) {
      if (checkFlag === true) {
        checkFlag = false;
        this.totalCredits = this.totalCredits - 4.5;
      } else {
        checkFlag = true;
        this.totalCredits = this.totalCredits + 4.5;
      }
      this.session_5 = checkFlag;
    }
    if (sessionNum === 6) {
      if (checkFlag === true) {
        checkFlag = false;
        this.totalCredits = this.totalCredits - 4.25;
      } else {
        checkFlag = true;
        this.totalCredits = this.totalCredits + 4.25;
      }
      this.session_6 = checkFlag;
    }
    if (sessionNum === 7) {
      if (checkFlag === true) {
        checkFlag = false;
        this.totalCredits = this.totalCredits - 3;
      } else {
        checkFlag = true;
        this.totalCredits = this.totalCredits + 3;
      }
      this.session_7 = checkFlag;
    }

    this.confProv.updateConferenceSession(checkFlag, sessionNum);

  }
}
