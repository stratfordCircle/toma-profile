import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";

// We MUST import both the firebase AND firestore modules like so
import * as firebase from "firebase";
import "firebase/firestore";
import { CookieService } from "ngx-cookie-service";
import { DatePipe } from "@angular/common";
import { SrkServicesProvider } from '../srk-services/srk-services';
import { clientVars } from './../../environments/environment';

@Injectable()
export class ConfDaysProcessesProvider {
  private _DB: any;
  public dataObj: any;
  collectionName: string; // = "POMA CME Records"; // Firebase Collection
  public currentUser: string;

  public certTestUser: string = "";

  testCounter: number = 0;
  course_variables = [];
  courses = [];

  constructor(
    public http: Http,
    private cookieService: CookieService,
    public datepipe: DatePipe,
    public srk: SrkServicesProvider //private storage: Storage,
  ) {
    this.collectionName = clientVars.cycleCollection1
    var rec;
    for (rec = 0; rec < 10; rec++) {
      this.course_variables.push({
        anything: ""
      });

      this.courses.push({
        accreditor: ""
      });
    }

//    this.cookieService.set("entryCheck", "conference", 0.02083333);
    this._DB = firebase.firestore();
    const settings = { timestampsInSnapshots: true }; //FIREBASE MADE A CHANGE TO READ TIMESTAMPS AS TIMESTAMPS INSTEAD OF AS SYSTEM DATE OBJECTS - THESE TWO LINES FORCE THE READ AS A TIMESTAMP TO PREPARE FOR THAT CHANGE WHEN FIREBASE IMPLEMENTS IT OR ELSE IT WOULD BE A BREAKING CHANGE
    this._DB.settings(settings);


    if (this.cookieService.get("tokenFB_Num")) {
      // IF MEMBERCLICKS AUTHENTICATED
      console.log("have cookie");
      //this.currentUser = this.cookieService.get("tokenFB_Num"); // SET THIS TO MAKE SURE IT IS THERE
      let checkID = this.cookieService.get('tokenFB_Num');
      this.currentUser = this.srk.decryptString(checkID);
      this.certTestUser = this.cookieService.get("certTestUser");


    } else {
//      alert("CONF-DAYS-PROCESSES - No tokenFB_Num");
    }
    //    this.currentUser = "9999999999";
  }

  getRecordsForCertificate(conferenceName, collectionName) { // for POMA CERT CREATION

    console.log('****** INSIDE GET RECORDS *******');
    console.log('collection ' + this.collectionName);
    console.log('conference Name ' + conferenceName);
    console.log('aoa_number ' + this.currentUser);

    return new Promise((resolve, reject) => {

//      console.log('conference_day ' + dayNum);


      this.certTestUser = this.cookieService.get('certTestUser');
      // alert('current user ' + this.currentUser);


      Promise.all([this.certTestUser]).then((values) => { // ??
        // alert('this.certTestUser ' + this.certTestUser);
        });
        
        if ((this.certTestUser !== "") && (this.certTestUser !== undefined) && (this.certTestUser !== "undefined"))
        {
        //  alert('really should not get in here')
          this.currentUser = this.certTestUser
        }
        else {
          var de_enc_user = this.cookieService.get("tokenFB_Num"); // SET THIS TO MAKE SURE IT IS THERE
          /* Promise.all([de_enc_user]).then((values) => { // ??
            alert('this.certTestUser ' + this.certTestUser);
           }); */
          this.currentUser = this.srk.decryptString(de_enc_user);
        //  alert('trying to set')
        }

    /*   Promise.all([this.certTestUser]).then((values) => { // ??
      // alert('this.certTestUser ' + this.certTestUser);
      });
      
      if (this.certTestUser !== "")
      {this.currentUser = this.certTestUser}
      else {
        var de_enc_user = this.cookieService.get("tokenFB_Num"); // SET THIS TO MAKE SURE IT IS THERE
        this.currentUser = this.srk.decryptString(de_enc_user);
      } */



      console.log('****** RUN QUERY *******');
      console.log('collection ' + this.collectionName);
      console.log('conference Name ' + conferenceName);
      console.log('aoa_number ' + this.currentUser);

      let query = this._DB.collection(this.collectionName);
      query = query.where("aoa_number", "==", this.currentUser);
      query = query.where("conference", "==", conferenceName);
      query = query.where("approval", "==", "Yes");
      
      /* if(dayNum !== 22) { // DON'T USE THE DAY IF WE WANT ALL CONFERENCE RECORDS FOR THE USER
        query = query.where("conference_day", "==", dayNum);
      } */

      // alert('this.currentUser ' + this.currentUser);

      query = query
        .get()
        .then(querySnapshot => {
          let obj: any = [];
          querySnapshot.forEach((doc: any) => {

            console.log('id ' + doc.id);

            obj.push({
              id: doc.id,
              conference_day: doc.data().conference_day,
              session_number: doc.data().session_number,  
              hours: doc.data().hours_approved1,  //CHANGED 6/11 - THIS MUST BE HOURS APPROVED
              credit_type: doc.data().credit_type1,
              attested: doc.data().attested
            });
          });
          console.log("end of getdocs1: " + obj.length + " returned");
          resolve(obj); // SEND BACK THE ARRAY OF OBJECTS
        })
        .catch((error: any) => {
          console.log("error for insufficient priveledges coming from here");
          // reject(error);
        });
    }); // END OF RETURN PROMISE
  } // END OF getRecordsForSpecifiedDay FUNCTION

  getRecordsForClinicalAssembly() { // for POMA CERT CREATION
    return new Promise((resolve, reject) => {

     /*  console.log('collection ' + this.conferenceName);
      console.log('aoa_number ' + this.currentUser);
      console.log('conference_day ' + dayNum);
 */

      this.certTestUser = this.cookieService.get('certTestUser');
      // alert('current user ' + this.currentUser);

      Promise.all([this.certTestUser]).then((values) => { // ??
      // alert('this.certTestUser ' + this.certTestUser);
      });
      
      if (this.certTestUser !== "")
      {this.currentUser = this.certTestUser}
      else {
        var de_enc_user = this.cookieService.get("tokenFB_Num"); // SET THIS TO MAKE SURE IT IS THERE
        this.currentUser = this.srk.decryptString(de_enc_user);
      }

      let query = this._DB.collection(this.collectionName);
      query = query.where("aoa_number", "==", this.currentUser);
      query = query.where("conference", "==", "63rd MidWinter Conference");
      //query = query.where("approved", "==", "Yes");
      
      /* if(dayNum !== 22) { // DON'T USE THE DAY IF WE WANT ALL CONFERENCE RECORDS FOR THE USER
        query = query.where("conference_day", "==", dayNum);
      } */

      query = query
        .get()
        .then(querySnapshot => {
          let obj: any = [];
          querySnapshot.forEach((doc: any) => {

          //  console.log('id ' + doc.id);

            obj.push({
              id: doc.id,
              conference_day: doc.data().conference_day,
              session_number: doc.data().session_number,  
              hours: doc.data().hours_approved1,  //CHANGED 6/11 - THIS MUST BE HOURS APPROVED
              credit_type: doc.data().credit_type1,
              attested: doc.data().attested
            });
          });
          console.log("end of getdocs2: " + obj.length + " returned");
          resolve(obj); // SEND BACK THE ARRAY OF OBJECTS
        })
        .catch((error: any) => {
          console.log("error for insufficient priveledges coming from here");
          // reject(error);
        });
    }); // END OF RETURN PROMISE
  } 

  // WRITTEN TO CREATE TOTALS FOR EACH CONFERENCE DAY
   getRecordsForSpecifiedDay(dayNum) {
    return new Promise((resolve, reject) => {

     /*  console.log('collection ' + this.conferenceName);
      console.log('aoa_number ' + this.currentUser);
      console.log('conference_day ' + dayNum);
 */
      let query = this._DB.collection(this.collectionName);
      query = query.where("aoa_number", "==", this.currentUser);
      
      if(dayNum !== 22) { // DON'T USE THE DAY IF WE WANT ALL CONFERENCE RECORDS FOR THE USER
        query = query.where("conference_day", "==", dayNum);
      }

      query = query
        .get()
        .then(querySnapshot => {
          let obj: any = [];
          querySnapshot.forEach((doc: any) => {

            console.log('id ' + doc.id);

            obj.push({
              id: doc.id,
              conference_day: doc.data().conference_day,
              session_number: doc.data().session_number,  
              hours: doc.data().hours1,
              credit_type: doc.data().credit_type1,
              attested: doc.data().attested
            });
          });
          console.log("end of getdocs3: " + obj.length + " returned");
          resolve(obj); // SEND BACK THE ARRAY OF OBJECTS
        })
        .catch((error: any) => {
          console.log("error for insufficient priveledges coming from here");
          // reject(error);
        });
    }); // END OF RETURN PROMISE
  } // END OF getRecordsForSpecifiedDay FUNCTION

  getDocumentIds(sessionNum) {
    return new Promise((resolve, reject) => {
      let query = this._DB.collection("POMA CME Records");
      query = query.where("aoa_number", "==", this.currentUser);
      if (sessionNum !== 222) {
      query = query.where("session_number", "==", sessionNum);
      }
      query = query
        .get()
        .then(querySnapshot => {
          let obj: any = [];
          querySnapshot.forEach((doc: any) => {
            obj.push({
              id: doc.id
            });
          });
          console.log("end of getdocs4: " + obj.length + " returned");
          resolve(obj); // SEND BACK THE ARRAY OF OBJECTS
        })
        .catch((error: any) => {
          console.log("error for insufficient priveledges coming from here");
          // reject(error);
        });
    }); // END OF RETURN PROMISE
  } // END OF getDocumentIds FUNCTION

  updateConferenceSession(checkFlag, sessionNum) {
    if (checkFlag === false) {
      this.deleteRecordsForSession(this.collectionName, sessionNum);
    } else {

     var conferenceDay;
     var conferenceDate;

        if (sessionNum <= 4) {
          conferenceDay = 1;
          conferenceDate = new Date("2018-05-02T00:00:00".replace(/-/g, '\/').replace(/T.+/, ''));
        }
        if (sessionNum >= 5 && sessionNum <= 7) {
          conferenceDay = 2;
          conferenceDate = new Date("2018-05-03T00:00:00".replace(/-/g, '\/').replace(/T.+/, ''));
        }
        if (sessionNum >= 8 && sessionNum <= 10) {
          conferenceDay = 3;
          conferenceDate = new Date("2018-05-04T00:00:00".replace(/-/g, '\/').replace(/T.+/, ''));
        }
        if (sessionNum >= 11 && sessionNum <= 12) {
          conferenceDay = 4;
          conferenceDate = new Date("2018-05-05T00:00:00".replace(/-/g, '\/').replace(/T.+/, ''));
        }               

      if (sessionNum === 1) {
        let lecture_Quantity = 5; // NUMBER OF LECTURES IN THIS SESSION

        this.course_variables[0].credit_type1 = "1A";
        this.course_variables[0].hours1 = 0.5;
        this.course_variables[0].description = "Clinical Assembly Grand Opening & Introductions";
        this.course_variables[1].credit_type1 = "OP_1A";
        this.course_variables[1].hours1 = 0.5;
        this.course_variables[1].description = "Combating the Opioid & Heroin Crisis in Pennsylvania";
        this.course_variables[2].credit_type1 = "PS_1A";
        this.course_variables[2].hours1 = 0.75;
        this.course_variables[2].description = "The Federal Approach to Pain Management";
        this.course_variables[3].credit_type1 = "OP_1A";
        this.course_variables[3].hours1 = 1.0;
        this.course_variables[3].description = "Physicians in the Crosshairs: To Treat or Not to Treat Pain";
        this.course_variables[4].credit_type1 = "1A";
        this.course_variables[4].hours1 = 0.25;
        this.course_variables[4].description = "POMA Clinical Writing Contest Awards Presentation";

        for (let counter = 0; counter < lecture_Quantity; counter++) {
          this.createRecordsForSession(
            conferenceDay,
            lecture_Quantity,
            conferenceDate,
            this.course_variables[counter],
            counter,
            sessionNum,
            checkFlag
          );
        }
      }

      if (sessionNum === 2) {
        let lecture_Quantity = 1;

        this.course_variables[0].credit_type1 = "PS_1A";
        this.course_variables[0].hours1 = 3.00;
        this.course_variables[0].description = "Basic Life Support for Physicians";

        for (let counter = 0; counter < lecture_Quantity; counter++) {
          this.createRecordsForSession(
            conferenceDay,
            lecture_Quantity,
            conferenceDate,
            this.course_variables[counter],
            counter,
            sessionNum,
            checkFlag
          );
        }
      }      

      if (sessionNum === 3) {
        let lecture_Quantity = 6;

        this.course_variables[0].credit_type1 = "1A";
        this.course_variables[0].hours1 = 1.00;
        this.course_variables[0].description = "Cancer & the Heart 2018";
        this.course_variables[1].credit_type1 = "1A";
        this.course_variables[1].hours1 = 1.00;
        this.course_variables[1].description = "Carotid Artery Disease Management";
        this.course_variables[2].credit_type1 = "1A";
        this.course_variables[2].hours1 = 0.25;
        this.course_variables[2].description = "Osteopathic Comment in Cardiology";
        this.course_variables[3].credit_type1 = "1A";
        this.course_variables[3].hours1 = 1.00;
        this.course_variables[3].description = "Atrial Fibrillation Update";
        this.course_variables[4].credit_type1 = "1A";
        this.course_variables[4].hours1 = 0.75;
        this.course_variables[4].description = "Left Atrial Appendage Occlusion";
        this.course_variables[5].credit_type1 = "1A";
        this.course_variables[5].hours1 = 1.00;
        this.course_variables[5].description = "LVAD & Other Devices in Cardiothoracic Surgery";

        for (let counter = 0; counter < lecture_Quantity; counter++) {
          this.createRecordsForSession(
            conferenceDay,
            lecture_Quantity,
            conferenceDate,
            this.course_variables[counter],
            counter,
            sessionNum,
            checkFlag
          );
        }
      }

      if (sessionNum === 4) {
        let lecture_Quantity = 1;

        this.course_variables[0].credit_type1 = "1B";
        this.course_variables[0].hours1 = 3.00;
        this.course_variables[0].description = "Audiovisual Self Study";

        for (let counter = 0; counter < lecture_Quantity; counter++) {
          this.createRecordsForSession(
            conferenceDay,
            lecture_Quantity,
            conferenceDate,
            this.course_variables[counter],
            counter,
            sessionNum,
            checkFlag
          );
        }
      } 
      
      if (sessionNum === 5) {
        let lecture_Quantity = 7;

        this.course_variables[0].credit_type1 = "1A";
        this.course_variables[0].hours1 = 1.00;
        this.course_variables[0].description = "Famous People with Diabetes";
        this.course_variables[1].credit_type1 = "1A";
        this.course_variables[1].hours1 = .75;
        this.course_variables[1].description = "Assessing Current Trends in Diabetes";
/*         this.course_variables[2].credit_type1 = "1A";
        this.course_variables[2].hours1 = .5;
        this.course_variables[2].description = "Endocrinology Panel Discussion"; */
        this.course_variables[3].credit_type1 = "1A";
        this.course_variables[3].hours1 = .25;
        this.course_variables[3].description = "Osteopathic Comment in Endocrinology";
        this.course_variables[4].credit_type1 = "1A";
        this.course_variables[4].hours1 = 0.75;
        this.course_variables[4].description = "Thyroid Concerns for the Primary Care Provider";
        this.course_variables[5].credit_type1 = "1A";
        this.course_variables[5].hours1 = 0.75;
        this.course_variables[5].description = "Pharmacologic & Surgical Treatment for Obesity";
        this.course_variables[6].credit_type1 = "1A";
        this.course_variables[6].hours1 = 0.75;
        this.course_variables[6].description = "Endocrinology Panel Discussion";

        for (let counter = 0; counter < lecture_Quantity; counter++) {
          this.createRecordsForSession(
            conferenceDay,
            lecture_Quantity,
            conferenceDate,
            this.course_variables[counter],
            counter,
            sessionNum,
            checkFlag
          );
        }
      }

      if (sessionNum === 6) {
        let lecture_Quantity = 5;

        this.course_variables[0].credit_type1 = "PS_1A";
        this.course_variables[0].hours1 = 1.00;
        this.course_variables[0].description = "First Line Antibiotic Choices for Common Infections";
        this.course_variables[1].credit_type1 = "PS_1A";
        this.course_variables[1].hours1 = 1.00;
        this.course_variables[1].description = "Missing the Mark: Missed Opportunities for Screening";
        this.course_variables[2].credit_type1 = "1A";
        this.course_variables[2].hours1 = 0.25;
        this.course_variables[2].description = "Osteopathic Comment in Primary Care";
        this.course_variables[3].credit_type1 = "1A";
        this.course_variables[3].hours1 = 1.00;
        this.course_variables[3].description = "Controversies in Prostate Screening";
        this.course_variables[4].credit_type1 = "1A";
        this.course_variables[4].hours1 = 1.00;
        this.course_variables[4].description = "Dermatology Pearls for Primary Care";


        for (let counter = 0; counter < lecture_Quantity; counter++) {
          this.createRecordsForSession(
            conferenceDay,
            lecture_Quantity,
            conferenceDate,
            this.course_variables[counter],
            counter,
            sessionNum,
            checkFlag
          );
        }
      }


        if (sessionNum === 7) {
        let lecture_Quantity = 1;

        this.course_variables[0].credit_type1 = "1B";
        this.course_variables[0].hours1 = 3.00;
        this.course_variables[0].description = "Audiovisual Self Study";

        for (let counter = 0; counter < lecture_Quantity; counter++) {
          this.createRecordsForSession(
            conferenceDay,
            lecture_Quantity,
            conferenceDate,
            this.course_variables[counter],
            counter,
            sessionNum,
            checkFlag
          );
        }
      } 

      if (sessionNum === 8) {
        let lecture_Quantity = 5;

        this.course_variables[0].credit_type1 = "1A";
        this.course_variables[0].hours1 = 1.00;
        this.course_variables[0].description = "Caring for the Medically Complex Pediatric Patient";
        this.course_variables[1].credit_type1 = "1A";
        this.course_variables[1].hours1 = 1.00;
        this.course_variables[1].description = "TBI & Adolescent Sleep: The Hows and Whys and What to Dos";
        this.course_variables[2].credit_type1 = "1A";
        this.course_variables[2].hours1 = 1.00;
        this.course_variables[2].description = "Pediatric Gastroenterology";
        this.course_variables[3].credit_type1 = "1A";
        this.course_variables[3].hours1 = 1.00;
        this.course_variables[3].description = "Anxiety Disorders in Children & Adolescents";
        this.course_variables[4].credit_type1 = "1A";
        this.course_variables[4].hours1 = .5;
        this.course_variables[4].description = "2018 Top Publications in Pediatric Osteopathy";


        for (let counter = 0; counter < lecture_Quantity; counter++) {
          this.createRecordsForSession(
            conferenceDay,
            lecture_Quantity,
            conferenceDate,
            this.course_variables[counter],
            counter,
            sessionNum,
            checkFlag
          );
        }
      }

      if (sessionNum === 9) {
        let lecture_Quantity = 5;

        this.course_variables[0].credit_type1 = "1A";
        this.course_variables[0].hours1 = 1.00;
        this.course_variables[0].description = "Advances in Osteoarthritis";
        this.course_variables[1].credit_type1 = "1A";
        this.course_variables[1].hours1 = 1.00;
        this.course_variables[1].description = "Common Issues in the Female Athlete";
        this.course_variables[2].credit_type1 = "1A";
        this.course_variables[2].hours1 = 0.25;
        this.course_variables[2].description = "Common Orthopedic Problems Encountered in the Office";
        this.course_variables[3].credit_type1 = "1A";
        this.course_variables[3].hours1 = 1.00;
        this.course_variables[3].description = "Concussions";
        this.course_variables[4].credit_type1 = "1A";
        this.course_variables[4].hours1 = 1.00;
        this.course_variables[4].description = "Common Pediatric Problems in the Office";


        for (let counter = 0; counter < lecture_Quantity; counter++) {
          this.createRecordsForSession(
            conferenceDay,
            lecture_Quantity,
            conferenceDate,
            this.course_variables[counter],
            counter,
            sessionNum,
            checkFlag
          );
        }
      }
      if (sessionNum === 10) {
        let lecture_Quantity = 1;

        this.course_variables[0].credit_type1 = "1A";
        this.course_variables[0].hours1 = 3.00;
        this.course_variables[0].description = "OMM Workshop";

        for (let counter = 0; counter < lecture_Quantity; counter++) {
          this.createRecordsForSession(
            conferenceDay,
            lecture_Quantity,
            conferenceDate,
            this.course_variables[counter],
            counter,
            sessionNum,
            checkFlag
          );
        }
      }      

      if (sessionNum === 11) {
        let lecture_Quantity = 5;

        this.course_variables[0].credit_type1 = "OP_1A";
        this.course_variables[0].hours1 = 1.00;
        this.course_variables[0].description = "A Community Response to the Opioid Epidemic";
        this.course_variables[1].credit_type1 = "PS_1A";
        this.course_variables[1].hours1 = 1.00;
        this.course_variables[1].description = "Providing Patient Care by Caring for the Doc";
        this.course_variables[2].credit_type1 = "PS_1A";
        this.course_variables[2].hours1 = 0.25;
        this.course_variables[2].description = "Electronic Health Care: Now and in the Future";
        this.course_variables[3].credit_type1 = "PS_1A";
        this.course_variables[3].hours1 = 1.00;
        this.course_variables[3].description = "Cross-generational Communication";
        this.course_variables[4].credit_type1 = "1A";
        this.course_variables[4].hours1 = 1.00;
        this.course_variables[4].description = "Medical Marijuana: What They Did not Teach Us in School.";


        for (let counter = 0; counter < lecture_Quantity; counter++) {
          this.createRecordsForSession(
            conferenceDay,
            lecture_Quantity,
            conferenceDate,
            this.course_variables[counter],
            counter,
            sessionNum,
            checkFlag
          );
        }
      }

      if (sessionNum === 12) {
        let lecture_Quantity = 3;

        this.course_variables[0].credit_type1 = "1A"; // OPTIONALLY CA_1A
        this.course_variables[0].hours1 = 2.00;
        this.course_variables[0].description = "Recognizing & Reporting Child Abuse in Pennsylvania";
        this.course_variables[1].credit_type1 = "PS_1A";
        this.course_variables[1].hours1 = 1.00;
        this.course_variables[1].description = "Harassment and the #MeToo Era";
        this.course_variables[2].credit_type1 = "PS_1A";
        this.course_variables[2].hours1 = 1.00;
        this.course_variables[2].description = "Florida Licensure Law Update";
       

        for (let counter = 0; counter < lecture_Quantity; counter++) {
          this.createRecordsForSession(
            conferenceDay,
            lecture_Quantity,
            conferenceDate,
            this.course_variables[counter],
            counter,
            sessionNum,
            checkFlag
          );
        }
      }


    }
  }
  
  createRecordsForSession(
    conferenceDay: Number,
    lecture_Quantity: Number,
    conferenceDate: Date,
    course_variablesTest: any,
    counter: number,
    sessionNum: number,
    checkFlag: boolean
  ) {


    let date_created = new Date();
    let localtestCreate = date_created.toLocaleString();
    let date_created_local = new Date(localtestCreate.replace(/-/g, '\/'));

    this.courses[counter].accreditor = "POMA";
    this.courses[counter].aoa_number = this.currentUser;
    this.courses[counter].approval = "";
    this.courses[counter].approval_reason = "";
    this.courses[counter].ce_date = conferenceDate;
    this.courses[counter].created_by = this.currentUser;
    this.courses[counter].date_created = date_created_local;
    this.courses[counter].date_entered = date_created_local;
    this.courses[counter].credit_type1 = this.course_variables[counter].credit_type1;
    this.courses[counter].hours1 = this.course_variables[counter].hours1;
    this.courses[counter].description = this.course_variables[counter].description;
    this.courses[counter].conference_day = conferenceDay;
    this.courses[counter].session = sessionNum;
    this.courses[counter].supporting_doc = "";
    this.courses[counter].created_by_process = "user";
    this.courses[counter].conference = "Clinical Assembly 2018";
    this.createAndPopulateDocument(
      this.collectionName,
      checkFlag,
      sessionNum,
      this.courses[counter]
    );
  }

  // TO USE THE MERGE FOR UPDATES, NEED TO KNOW THE FULL PATH TO THE DOCUMENT
  createAndPopulateDocument(
    collectionObj: string,
    //    session_id: string, // LOOK AT GETTING RID OF THIS SESSION ID
    flag: boolean,
    sessionNum: number,
    dataObj: any
  ): Promise<any> {
    //    console.log("what is session id?: " + session_id);
//    console.log("what is flag?: " + flag);
//    console.log("what is collection Obj?: " + collectionObj);

    if (flag === true) {
//      console.log("flag is true");

      return new Promise((resolve, reject) => {
        this._DB
          .collection(collectionObj)
          .add(dataObj)
          .then((data: any) => {
            resolve(data);
          })
          .catch((error: any) => {
            reject(error);
          });
      });
    }
  }

  createRecordsForPOFPSsession(
    //conferenceDay : Number,
    ce_date : Date,
    aoa_number : String, 
    credit_type1 : String,
    hours1 : Number
    ) 
     {

    let counter = 0;
    let date_created = new Date();
    let localtestCreate = date_created.toLocaleString();
    let date_created_local = new Date(localtestCreate.replace(/-/g, '\/'));

    // CONFERENCE VARIABLES FOR ALL MEMBERS
    this.courses[counter].accreditor = "POMA";
    this.courses[counter].approval = "Yes";
    this.courses[counter].approval_reason = "";
    this.courses[counter].created_by = "9999999999";
    this.courses[counter].date_created = date_created_local;
    this.courses[counter].date_entered = date_created_local;
    this.courses[counter].supporting_doc = "";
    this.courses[counter].created_by_process = "admin";
    this.courses[counter].conference = "POFPS 43rd Annual CME Symposium";

    // SESSION / MEMBER SPECIFIC VARIABLES  
    this.courses[counter].credit_type1 = credit_type1;
    this.courses[counter].ce_date = ce_date;
    this.courses[counter].aoa_number = aoa_number;
    this.courses[counter].credit_type1 = credit_type1;
    this.courses[counter].hours1 = hours1;
    this.courses[counter].hours_approved1 = hours1;
    this.courses[counter].description = "POFPS 43rd Annual CME Symposium"
    
    this.createAndPopulatePOFPSdocument(
      this.collectionName, // Collection Name - refactor var name
      this.courses[counter]
    );
  }

   // TO USE THE MERGE FOR UPDATES, NEED TO KNOW THE FULL PATH TO THE DOCUMENT
   createAndPopulatePOFPSdocument(
    collectionObj: string,
    dataObj: any
  ): Promise<any> {

      return new Promise((resolve, reject) => {
        this._DB
          .collection(collectionObj)
          .add(dataObj)
          .then((data: any) => {
            resolve(data);
          })
          .catch((error: any) => {
            reject(error);
          });
      });
    
  }

  deleteRecordsForSession(collectionObj: string, sessionNum: number) {
    // DELETE ALL DOCUMENTS FROM THIS SESSION
    this.getDocumentIds(sessionNum).then(data => {
      if (data) {
        var i = 0;

        while (data[i] !== undefined) {
          let session_id = data[i].id;

          // return new Promise((resolve, reject) => {
          this._DB
            .collection(collectionObj)
            .doc(session_id)
            .delete();

          //  .then((obj: any) => {
          //     resolve(obj);
          //   })
          //   .catch((error: any) => {
          //   reject(error);
          //     console.log("Error deleting record: ", error.message);
          //   });
          //});
          i++;
        }
      }
    });
  }


  // CALLED ONLY WHEN IMPORTING AND CONVERTING SESSION FORMAT RECORDS FROM GOOGLE SHEETS
  updateConferenceConversionSession(aoa_number, sessionNum) {

    //  COMING FROM -- CME-PROCESSES - CHECK FOR DUPLICATE THERE

    /*     if (checkFlag === false) {
      this.deleteRecordsForSession(this.conferenceName, sessionNum);
    } else { 
      */

     var conferenceDay;
     var conferenceDate;

        if (sessionNum <= 4) {
          conferenceDay = 1;

          conferenceDate = new Date("2018-05-02T00:00:00".replace(/-/g, '\/').replace(/T.+/, ''));
          //console.log('day 1: ' + conferenceDate);

        }

        if (sessionNum >= 5 && sessionNum <= 7) {
          conferenceDay = 2;
          conferenceDate = new Date("2018-05-03T00:00:00".replace(/-/g, '\/').replace(/T.+/, ''));
        }

        if (sessionNum >= 8 && sessionNum <= 10) {
          conferenceDay = 3;
          conferenceDate = new Date("2018-05-04T00:00:00".replace(/-/g, '\/').replace(/T.+/, ''));
        }

        if (sessionNum >= 11 && sessionNum <= 12) {
          conferenceDay = 4;
          conferenceDate = new Date("2018-05-05T00:00:00".replace(/-/g, '\/').replace(/T.+/, ''));
        }               

      if (sessionNum === 1) {
        let lecture_Quantity = 5; // NUMBER OF LECTURES IN THIS SESSION

        this.course_variables[0].credit_type1 = "1A";
        this.course_variables[0].hours1 = 0.5;
        this.course_variables[0].hours_approved1 = 0.5;
        this.course_variables[0].description = "Clinical Assembly Grand Opening & Introductions";
        this.course_variables[1].credit_type1 = "OP_1A";
        this.course_variables[1].hours1 = 0.5;
        this.course_variables[1].hours_approved1 = 0.5;
        this.course_variables[1].description = "Combating the Opioid & Heroin Crisis in Pennsylvania";
        this.course_variables[2].credit_type1 = "PS_1A";
        this.course_variables[2].hours1 = 0.75;
        this.course_variables[2].hours_approved1 = 0.75;
        this.course_variables[2].description = "The Federal Approach to Pain Management";
        this.course_variables[3].credit_type1 = "OP_1A";
        this.course_variables[3].hours1 = 1.0;
        this.course_variables[3].hours_approved1 = 1.0;
        this.course_variables[3].description = "Physicians in the Crosshairs: To Treat or Not to Treat Pain";
        this.course_variables[4].credit_type1 = "1A";
        this.course_variables[4].hours1 = 0.25;
        this.course_variables[4].hours_approved1 = 0.25;
        this.course_variables[4].description = "POMA Clinical Writing Contest Awards Presentation";

        for (let counter = 0; counter < lecture_Quantity; counter++) {
          this.createConversionRecordsForSession(
            conferenceDay,
            lecture_Quantity,
            conferenceDate,
            this.course_variables[counter],
            counter,
            sessionNum,
            aoa_number
          );
        }
      }

      if (sessionNum === 2) {
        let lecture_Quantity = 1;

        this.course_variables[0].credit_type1 = "PS_1A";
        this.course_variables[0].hours1 = 3.00;
        this.course_variables[0].hours_approved1 = 3.00;
        this.course_variables[0].description = "Basic Life Support for Physicians";

        for (let counter = 0; counter < lecture_Quantity; counter++) {
          this.createConversionRecordsForSession(
            conferenceDay,
            lecture_Quantity,
            conferenceDate,
            this.course_variables[counter],
            counter,
            sessionNum,
            aoa_number
          );
        }
      }      

      if (sessionNum === 3) {
        let lecture_Quantity = 6;

        this.course_variables[0].credit_type1 = "1A";
        this.course_variables[0].hours1 = 1.00;
        this.course_variables[0].hours_approved1 = 1.00;
        this.course_variables[0].description = "Cancer & the Heart 2018";
        this.course_variables[1].credit_type1 = "1A";
        this.course_variables[1].hours1 = 1.00;
        this.course_variables[1].hours_approved1 = 1.00;
        this.course_variables[1].description = "Carotid Artery Disease Management";
        this.course_variables[2].credit_type1 = "1A";
        this.course_variables[2].hours1 = 0.25;
        this.course_variables[2].hours_approved1 = 0.25;
        this.course_variables[2].description = "Osteopathic Comment in Cardiology";
        this.course_variables[3].credit_type1 = "1A";
        this.course_variables[3].hours1 = 1.00;
        this.course_variables[3].hours_approved1 = 1.00;
        this.course_variables[3].description = "Atrial Fibrillation Update";
        this.course_variables[4].credit_type1 = "1A";
        this.course_variables[4].hours1 = 0.75;
        this.course_variables[4].hours_approved1 = 0.75;
        this.course_variables[4].description = "Left Atrial Appendage Occlusion";
        this.course_variables[5].credit_type1 = "1A";
        this.course_variables[5].hours1 = 1.00;
        this.course_variables[5].hours_approved1 = 1.00;
        this.course_variables[5].description = "LVAD & Other Devices in Cardiothoracic Surgery";

        for (let counter = 0; counter < lecture_Quantity; counter++) {
          this.createConversionRecordsForSession(
            conferenceDay,
            lecture_Quantity,
            conferenceDate,
            this.course_variables[counter],
            counter,
            sessionNum,
            aoa_number
          );
        }
      }

      if (sessionNum === 4) {
        let lecture_Quantity = 1;

        this.course_variables[0].credit_type1 = "1B";
        this.course_variables[0].hours1 = 3.00;
        this.course_variables[0].hours_approved1 = 3.00;
        this.course_variables[0].description = "Audiovisual Self Study";

        for (let counter = 0; counter < lecture_Quantity; counter++) {
          this.createConversionRecordsForSession(
            conferenceDay,
            lecture_Quantity,
            conferenceDate,
            this.course_variables[counter],
            counter,
            sessionNum,
            aoa_number
          );
        }
      } 
      
      if (sessionNum === 5) {
        let lecture_Quantity = 6; // FRONT END OF THIS LOOKS LIKE SEVEN SESSIONS TO MIRROR THE PAPER FORM, BUT 6 ARE WRITTEN TO THE DB - WITH THE SAME NUMBER OF OVERALL CREDITS

        this.course_variables[0].credit_type1 = "1A";
        this.course_variables[0].hours1 = 1.00;
        this.course_variables[0].hours_approved1 = 1.00;
        this.course_variables[0].description = "Famous People with Diabetes";
        this.course_variables[1].credit_type1 = "1A";
        this.course_variables[1].hours1 = .75;
        this.course_variables[1].hours_approved1 = .75;
        this.course_variables[1].description = "Assessing Current Trends in Diabetes";
        this.course_variables[2].credit_type1 = "1A";
        this.course_variables[2].hours1 = .25;
        this.course_variables[2].hours_approved1 = .25;
        this.course_variables[2].description = "Osteopathic Comment in Endocrinology";
        this.course_variables[3].credit_type1 = "1A";
        this.course_variables[3].hours1 = 0.75;
        this.course_variables[3].hours_approved1 = 0.75;
        this.course_variables[3].description = "Thyroid Concerns for the Primary Care Provider";
        this.course_variables[4].credit_type1 = "1A";
        this.course_variables[4].hours1 = 0.75;
        this.course_variables[4].hours_approved1 = 0.75;
        this.course_variables[4].description = "Pharmacologic & Surgical Treatment for Obesity";
        this.course_variables[5].credit_type1 = "1A";
        this.course_variables[5].hours1 = 1.00;
        this.course_variables[5].hours_approved1 = 1.00;
        this.course_variables[5].description = "Endocrinology Panel Discussion"; // THIS IS BROKEN OUT INTO TWO LECTURES ON THE FRONT END - TOTAL CREDITS ARE ALL THE SAME

        for (let counter = 0; counter < lecture_Quantity; counter++) {
          this.createConversionRecordsForSession(
            conferenceDay,
            lecture_Quantity,
            conferenceDate,
            this.course_variables[counter],
            counter,
            sessionNum,
            aoa_number
          );
        }
      }

      if (sessionNum === 6) {
        let lecture_Quantity = 5;

        this.course_variables[0].credit_type1 = "PS_1A";
        this.course_variables[0].hours1 = 1.00;
        this.course_variables[0].hours_approved1 = 1.00;
        this.course_variables[0].description = "First Line Antibiotic Choices for Common Infections";
        this.course_variables[1].credit_type1 = "PS_1A";
        this.course_variables[1].hours1 = 1.00;
        this.course_variables[1].hours_approved1 = 1.00;
        this.course_variables[1].description = "Missing the Mark: Missed Opportunities for Screening";
        this.course_variables[2].credit_type1 = "1A";
        this.course_variables[2].hours1 = 0.25;
        this.course_variables[2].hours_approved1 = 0.25;
        this.course_variables[2].description = "Osteopathic Comment in Primary Care";
        this.course_variables[3].credit_type1 = "1A";
        this.course_variables[3].hours1 = 1.00;
        this.course_variables[3].hours_approved1 = 1.00;
        this.course_variables[3].description = "Controversies in Prostate Screening";
        this.course_variables[4].credit_type1 = "1A";
        this.course_variables[4].hours1 = 1.00;
        this.course_variables[4].hours_approved1 = 1.00;
        this.course_variables[4].description = "Dermatology Pearls for Primary Care";


        for (let counter = 0; counter < lecture_Quantity; counter++) {
          this.createConversionRecordsForSession(
            conferenceDay,
            lecture_Quantity,
            conferenceDate,
            this.course_variables[counter],
            counter,
            sessionNum,
            aoa_number
          );
        }
      }


        if (sessionNum === 7) {
        let lecture_Quantity = 1;

        this.course_variables[0].credit_type1 = "1B";
        this.course_variables[0].hours1 = 3.00;
        this.course_variables[0].hours_approved1 = 3.00;
        this.course_variables[0].description = "Audiovisual Self Study";

        for (let counter = 0; counter < lecture_Quantity; counter++) {
          this.createConversionRecordsForSession(
            conferenceDay,
            lecture_Quantity,
            conferenceDate,
            this.course_variables[counter],
            counter,
            sessionNum,
            aoa_number
          );
        }
      } 

      if (sessionNum === 8) {
        let lecture_Quantity = 5;

        this.course_variables[0].credit_type1 = "1A";
        this.course_variables[0].hours1 = 1.00;
        this.course_variables[0].hours_approved1 = 1.00;
        this.course_variables[0].description = "Caring for the Medically Complex Pediatric Patient";
        this.course_variables[1].credit_type1 = "1A";
        this.course_variables[1].hours1 = 1.00;
        this.course_variables[1].hours_approved1 = 1.00;
        this.course_variables[1].description = "TBI & Adolescent Sleep - The Hows and Whys and What to Dos";
        this.course_variables[2].credit_type1 = "1A";
        this.course_variables[2].hours1 = 1.00;
        this.course_variables[2].hours_approved1 = 1.00;
        this.course_variables[2].description = "Pediatric Gastroenterology";
        this.course_variables[3].credit_type1 = "1A";
        this.course_variables[3].hours1 = 1.00;
        this.course_variables[3].hours_approved1 = 1.00;
        this.course_variables[3].description = "Anxiety Disorders in Children & Adolescents";
        this.course_variables[4].credit_type1 = "1A";
        this.course_variables[4].hours1 = .5;
        this.course_variables[4].hours_approved1 = .5;
        this.course_variables[4].description = "2018 Top Publications in Pediatric Osteopathy";


        for (let counter = 0; counter < lecture_Quantity; counter++) {
          this.createConversionRecordsForSession(
            conferenceDay,
            lecture_Quantity,
            conferenceDate,
            this.course_variables[counter],
            counter,
            sessionNum,
            aoa_number
          );
        }
      }

      if (sessionNum === 9) {
        let lecture_Quantity = 5;

        this.course_variables[0].credit_type1 = "1A";
        this.course_variables[0].hours1 = 0.75;
        this.course_variables[0].hours_approved1 = 0.75;
        this.course_variables[0].description = "Advances in Osteoarthritis";
        this.course_variables[1].credit_type1 = "1A";
        this.course_variables[1].hours1 = 0.75;
        this.course_variables[1].hours_approved1 = 0.75;
        this.course_variables[1].description = "Common Issues in the Female Athlete";
        this.course_variables[2].credit_type1 = "1A";
        this.course_variables[2].hours1 = 0.75;
        this.course_variables[2].hours_approved1 = 0.75;
        this.course_variables[2].description = "Common Orthopedic Problems Encountered in the Office";
        this.course_variables[3].credit_type1 = "1A";
        this.course_variables[3].hours1 = 0.75;
        this.course_variables[3].hours_approved1 = 0.75;
        this.course_variables[3].description = "Concussions";
        this.course_variables[4].credit_type1 = "1A";
        this.course_variables[4].hours1 = 0.75;
        this.course_variables[4].hours_approved1 = 0.75;
        this.course_variables[4].description = "Common Pediatric Problems in the Office";


        for (let counter = 0; counter < lecture_Quantity; counter++) {
          this.createConversionRecordsForSession(
            conferenceDay,
            lecture_Quantity,
            conferenceDate,
            this.course_variables[counter],
            counter,
            sessionNum,
            aoa_number
          );
        }
      }
      if (sessionNum === 10) {
        let lecture_Quantity = 1;

        this.course_variables[0].credit_type1 = "1A";
        this.course_variables[0].hours1 = 3.00;
        this.course_variables[0].hours_approved1 = 3.00;
        this.course_variables[0].description = "OMM Workshop";

        for (let counter = 0; counter < lecture_Quantity; counter++) {
          this.createConversionRecordsForSession(
            conferenceDay,
            lecture_Quantity,
            conferenceDate,
            this.course_variables[counter],
            counter,
            sessionNum,
            aoa_number
          );
        }
      }      

      if (sessionNum === 11) {
        let lecture_Quantity = 5;

        this.course_variables[0].credit_type1 = "OP_1A";
        this.course_variables[0].hours1 = 1.00;
        this.course_variables[0].hours_approved1 = 1.00;
        this.course_variables[0].description = "A Community Response to the Opioid Epidemic";
        this.course_variables[1].credit_type1 = "PS_1A";
        this.course_variables[1].hours1 = 1.00;
        this.course_variables[1].hours_approved1 = 1.00;
        this.course_variables[1].description = "Providing Patient Care by Caring for the Doc";
        this.course_variables[2].credit_type1 = "PS_1A";
        this.course_variables[2].hours1 = 1.00;
        this.course_variables[2].hours_approved1 = 1.00;
        this.course_variables[2].description = "Electronic Health Care: Now and in the Future";
        this.course_variables[3].credit_type1 = "PS_1A";
        this.course_variables[3].hours1 = 1.00;
        this.course_variables[3].hours_approved1 = 1.00;
        this.course_variables[3].description = "Cross-generational Communication";
        this.course_variables[4].credit_type1 = "1A";
        this.course_variables[4].hours1 = 1.00;
        this.course_variables[4].hours_approved1 = 1.00;
        this.course_variables[4].description = "Medical Marijuana: What They Did not Teach Us in School.";


        for (let counter = 0; counter < lecture_Quantity; counter++) {
          this.createConversionRecordsForSession(
            conferenceDay,
            lecture_Quantity,
            conferenceDate,
            this.course_variables[counter],
            counter,
            sessionNum,
            aoa_number
          );
        }
      }

      if (sessionNum === 12) {
        let lecture_Quantity = 3;

        this.course_variables[0].credit_type1 = "1A"; // CA_1A - // temporary change - for members who checked off CA on their attestation form, but were not on the match list from the vendor
        this.course_variables[0].hours1 = 2.00;
        this.course_variables[0].hours_approved1 = 2.00;
        this.course_variables[0].description = "Recognizing & Reporting Child Abuse in Pennsylvania";
        this.course_variables[1].credit_type1 = "PS_1A";
        this.course_variables[1].hours1 = 1.00;
        this.course_variables[1].hours_approved1 = 1.00;
        this.course_variables[1].description = "Harassment and the #MeToo Era";
        this.course_variables[2].credit_type1 = "PS_1A";
        this.course_variables[2].hours1 = 1.00;
        this.course_variables[2].hours_approved1 = 1.00;
        this.course_variables[2].description = "Florida Licensure Law Update";
       

        for (let counter = 0; counter < lecture_Quantity; counter++) {
          this.createConversionRecordsForSession(
            conferenceDay,
            lecture_Quantity,
            conferenceDate,
            this.course_variables[counter],
            counter,
            sessionNum,
            aoa_number
          );
        }
      }


//    }
  }
  
  createConversionRecordsForSession(
    conferenceDay: Number,
    lecture_Quantity: Number,
    conferenceDate: Date,
    course_variables: any,
    counter: number,
    sessionNum: number,
    aoa_number: number
  ) {

    this.currentUser = '9999999999';
    let date_created = new Date();
    let localtestCreate = date_created.toLocaleString();
    let date_created_local = new Date(localtestCreate.replace(/-/g, '\/'));

    //alert('date created with slashe: ' + testDate);

    console.log('conferenceDate coming in: ' + conferenceDate);

/*     let temp_ce_date = conferenceDate.toLocaleString();

    let ce_date_localtime = new Date(temp_ce_date.replace(/-/g, '\/'));
    
    console.log('temp_ce_date: ' + temp_ce_date);
    console.log('ce_date localized: ' + ce_date_localtime); */

    this.courses[counter].accreditor = "POMA";
    this.courses[counter].aoa_number = aoa_number;
    this.courses[counter].approval = "Yes"; // SET DEFAULT APPROVAL 
    this.courses[counter].approval_reason = "";
    this.courses[counter].ce_date = conferenceDate;
    this.courses[counter].created_by = this.currentUser;
    this.courses[counter].date_created = date_created_local;
    this.courses[counter].date_entered = date_created_local;
    this.courses[counter].credit_type1 = this.course_variables[counter].credit_type1;
    this.courses[counter].hours1 = this.course_variables[counter].hours1;
    this.courses[counter].hours_approved1 = this.course_variables[counter].hours_approved1;
    this.courses[counter].description = this.course_variables[counter].description;
    this.courses[counter].conference_day = conferenceDay;
    this.courses[counter].session = sessionNum;
    this.courses[counter].supporting_doc = "";
    this.courses[counter].created_by_process = "system";
    this.courses[counter].conference = "Clinical Assembly 2018";
    this.createAndPopulateDocument(
      this.collectionName,
      true, // checkFlag+
      sessionNum,
      this.courses[counter]
    );
  }




}
