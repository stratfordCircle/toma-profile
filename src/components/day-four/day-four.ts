import { Component } from "@angular/core"; //, Output, EventEmitter
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
  selector: "day-four",
  templateUrl: "day-four.html"
})
export class DayFourComponent {
  //@Output() returnCredits = new EventEmitter();

  text: string;
  //form: FormGroup;
  data: any;
  session_11: boolean = false;
  session_12: boolean = false; // FIRST OPTIONAL COURSE
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
    this.confProv.getRecordsForSpecifiedDay(4).then(data => {
      if (data) {
        var i = 0;
        //var k;

        console.log('this.session_11 ' + this.session_11);
        console.log('this.session_12 ' + this.session_12);

        while (data[i] !== undefined) {
          console.log("these count: " + data[i].hours);
          this.totalCredits = this.totalCredits + data[i].hours;
          if (data[i].session_number == 11) {
            this.session_11 = true;
        //    this.sessionNum[11].id = data[i].id;
          }
          if (data[i].session_number == 12) {
            this.session_12 = true;
        //   this.sessionNum[12].id = data[i].id;
          }
          i++;
        }
      } // END OF CHECK FOR DATA
    });
  }

  updateSession(checkFlag, sessionNum) {
    // FLIP FLAGS, COUNT CREDITS AND GO TO REMOTE METHOD TO UPDATE THE SESSION
    // UPDATES ANY SESSION ON THIS PAGE

    if (sessionNum === 11) {
      if (checkFlag === true) {
        checkFlag = false;
        this.totalCredits = this.totalCredits - 5;
      } else {
        checkFlag = true;
        this.totalCredits = this.totalCredits + 5;
      }
      this.session_11 = checkFlag;
    }
    if (sessionNum === 12) {
      if (checkFlag === true) {
        checkFlag = false;
        this.totalCredits = this.totalCredits - 4;
      } else {
        checkFlag = true;
        this.totalCredits = this.totalCredits + 4;
      }
      this.session_12 = checkFlag;
    }
    
    this.confProv.updateConferenceSession(checkFlag, sessionNum);

  }
}
