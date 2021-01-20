import { DatePipe } from '@angular/common';
import { AlertController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../database/database';
import { Http } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
// We MUST import both the firebase AND firestore modules like so
import * as firebase from "firebase";
import "firebase/firestore";
//import { File } from "@ionic-native/file";
import { CookieService } from 'ngx-cookie-service';
import { ConfDaysProcessesProvider } from "../conf-days-processes/conf-days-processes";
//import { noUndefined } from '@angular/compiler/src/util';
//import { isUndefined } from 'ionic-angular/util/util';
import { SrkServicesProvider } from '../srk-services/srk-services';
import { clientVars } from './../../environments/environment';

@Injectable()
export class CmeProcessesProvider {

  _COLL = clientVars.cycleCollection1;
  private _DB: any;
  private cmeRecords: any;
  private _CONTENT: any;

  courses = [];

  constructor(public http: Http, private cookieService: CookieService,
    private _DBP: DatabaseProvider,
    public confProv: ConfDaysProcessesProvider,
    public datepipe: DatePipe, private _ALERT: AlertController,
    public srk: SrkServicesProvider) {
    
    this._DB = firebase.firestore();

    const settings = { timestampsInSnapshots: true }; //FIREBASE MADE A CHANGE TO READ TIMESTAMPS AS TIMESTAMPS INSTEAD OF AS SYSTEM DATE OBJECTS - THESE TWO LINES FORCE THE READ AS A TIMESTAMP TO PREPARE FOR THAT CHANGE WHEN FIREBASE IMPLEMENTS IT OR ELSE IT WOULD BE A BREAKING CHANGE
    this._DB.settings(settings);

    this.courses.push({ // instantiate
      accreditor: ""
    });

  }

  loginFB() {

    return new Promise((resolve, reject) => {
      let checkID = this.cookieService.get('tokenFB_Num');

      let temp_password = parseInt(this.srk.decryptString(checkID));

      // srk console.log('temp_password inside loginFB: ' + temp_password);
      let temp_password2 = parseInt(this.cookieService.get('p_id'));
      // srk console.log('temp_password2 - Profile ID: ' + temp_password2);
      let temp_password3 = temp_password * temp_password2;
      // srk console.log('temp_password3: ' + temp_password3);

      //let temp_password3 =     57277 * 1003780062;

      let password = temp_password3.toString();

      if (password.length > 10) {
        password = password.substring(0, 9);
      }


      // CAN CHANGE THE AOA NUMBER HERE TO IMITATE A MEMBER
      // 57277 - Dr. Battistella
      // Dr. Battistella - profile id - 1003780062
      // my profile id - 1003682710
      // generated password: 574935106

      console.log('attempting auTOMAted login');

      let email = temp_password + "@txosteo.org"; //active_member_email;

      // let email = this.cookieService.get("token_email");

      // console.log('final email and password: ' + email + '/' + password);

      /*   FROM JORGE JBRAT
      Refactor Authentication:
  Since Firebase 5 the function `createUserWithEmailAndPassword()` stopped returning a User object, it now returns a UserCredential object that has the user object inside, so if you were doing something like this:
  this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(user => {
    console.log(user);
  });
  You'll need to change it to something like
  
  this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(userCredential => {
    console.log(userCredential.user);
  }); */


  // something else to consider: from 11/12/18
  // Note from end of emails with Bear: Right. Check out the Federated Identity and Identity Pools for that. It's a weird process of validating on your site (or wherever) and then w/ AWS by registering, etc. It cd be overkill for what you're doing since the typical point of that is to then give them AWS access to stuff.

      firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
          this.cookieService.set('fireBase_login', "true", 0.02083333);
          resolve(true);
        })
        .catch((error) => {
          console.error('login error ' + error);
          reject(error);
        });
    });
  }

  registerFB() {

    return new Promise((resolve, reject) => {

      // let temp_password = parseInt(this.cookieService.get('tokenFB_Num'));

      let checkID = this.cookieService.get('tokenFB_Num');
      let temp_password = parseInt(this.srk.decryptString(checkID));

      // SRK *** SRK *** - could pull something else here to make a unique password if we decide to use fake AOA Number

      // console.log('temp_password inside register: ' + temp_password);

      let temp_password2 = parseInt(this.cookieService.get('p_id'));
      let temp_password3 = temp_password * temp_password2;
      let password = temp_password3.toString();

      // console.log('INSIDE OF REGISTER');

      if (password.length > 10) {
        password = password.substring(0, 9);
      }

      // console.log('password inside register: ' + password);

      // email address for firebase auth will always be the aoa number with the poma extension and a password based on the id math

      let email = temp_password + "@txosteo.org";

      // Can create new users with their system email as desired - no reason to manufacture the email and the password
      // also, seems we could switch to this any time - even could remove all users as their records would still be there 
      // under a directory named for their aoa number
      // let email = this.cookieService.get("token_email");

      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => {
          this.cookieService.set('fireBase_login', "true", 0.02083333);
          resolve(true);
        })
        .catch((error: any) => {
      // console.error('registation error: ' + error);
          reject(error);
        });

    });

  }



  convertAttestationSheets() {

    let sheetId = "1LnX9QfVeF0zuSmnaYqZ-IrylW6U0P-xMqO-JW-3CS78";

    let url =
      "https://spreadsheets.google.com/feeds/list/" +
      sheetId +
      "/od6/public/values?alt=json";

    let x = 0;
    this.http
      .get(url)
      .map(res => res.json()) // . .json() )
      .subscribe(data => {

        var dataLengthCheck = data.feed.entry;
        var dataLength = dataLengthCheck.length;

        if (dataLength > 0) {
          this.displayAlert('Database Import', 'You are converting the attestation records of ' + dataLength + ' members from Google Sheets into your database.');
        }

        while (x < dataLength) {
          console.log('converting records for member ' + x);

          /*                 let ce_date = data.feed.entry[x]["gsx$cedate"]["$t"];
                          //console.log('ce date ' + ce_date);
                          //let date_entered = data.feed.entry[x]["gsx$dateentered"]["$t"];
                          let accreditor = data.feed.entry[x]["gsx$accreditor"]["$t"];
                          //console.log('accreditor ' + accreditor);
                          
                          let description = data.feed.entry[x]["gsx$description"]["$t"];
            
                          let credit_type1 = data.feed.entry[x]["gsx$credittype1"]["$t"]; */

          let aoa_number = data.feed.entry[x]["gsx$aoanumber"]["$t"];

          // RUN CHECK FOR DUPLICATE AOA NUMBER HERE?
          // CHECK TO SEE IF AOA_NUM IS DUPLICATE BEFORE EXECUTING (IF IN CLINICAL ASSEMBLY COLLECTION, OMIT)
          //                 console.log('aoa number ' + aoa_number);

          let sessioncheck_1 = data.feed.entry[x]["gsx$one"]["$t"];
          if (sessioncheck_1 === 'X') { this.confProv.updateConferenceConversionSession(aoa_number, 1); }
          let sessioncheck_2 = data.feed.entry[x]["gsx$two"]["$t"];
          if (sessioncheck_2 === 'X') { this.confProv.updateConferenceConversionSession(aoa_number, 2); }
          let sessioncheck_3 = data.feed.entry[x]["gsx$three"]["$t"];
          if (sessioncheck_3 === 'X') { this.confProv.updateConferenceConversionSession(aoa_number, 3); }
          let sessioncheck_4 = data.feed.entry[x]["gsx$four"]["$t"];
          if (sessioncheck_4 === 'X') { this.confProv.updateConferenceConversionSession(aoa_number, 4); }
          let sessioncheck_5 = data.feed.entry[x]["gsx$five"]["$t"];
          if (sessioncheck_5 === 'X') { this.confProv.updateConferenceConversionSession(aoa_number, 5); }
          let sessioncheck_6 = data.feed.entry[x]["gsx$six"]["$t"];
          if (sessioncheck_6 === 'X') { this.confProv.updateConferenceConversionSession(aoa_number, 6); }
          let sessioncheck_7 = data.feed.entry[x]["gsx$seven"]["$t"];
          if (sessioncheck_7 === 'X') { this.confProv.updateConferenceConversionSession(aoa_number, 7); }
          let sessioncheck_8 = data.feed.entry[x]["gsx$eight"]["$t"];
          if (sessioncheck_8 === 'X') { this.confProv.updateConferenceConversionSession(aoa_number, 8); }
          let sessioncheck_9 = data.feed.entry[x]["gsx$nine"]["$t"];
          if (sessioncheck_9 === 'X') { this.confProv.updateConferenceConversionSession(aoa_number, 9); }
          let sessioncheck_10 = data.feed.entry[x]["gsx$ten"]["$t"];
          if (sessioncheck_10 === 'X') { this.confProv.updateConferenceConversionSession(aoa_number, 10); }
          let sessioncheck_11 = data.feed.entry[x]["gsx$eleven"]["$t"];
          if (sessioncheck_11 === 'X') { this.confProv.updateConferenceConversionSession(aoa_number, 11); }
          let sessioncheck_12 = data.feed.entry[x]["gsx$twelve"]["$t"];
          if (sessioncheck_12 === 'X') { this.confProv.updateConferenceConversionSession(aoa_number, 12); }

          x++;
        }

      });

  }

  importFirebasefromGoogleSheets() {
    // NO SPECIAL CREDENTIALS NEEDED FOR THIS - JUST OPEN A SHEET TO THE WORLD AND REPLACE THE ID
    // let sheetId = "1HukIuiUh6RbP40rFUkWxLrXdk66SBbBau2XBsNdmPlw"; // the "dig it" sheet
    // let sheetId = "1YGJJjMfU7-S-JcTk3EDToI2PB3roiSs82ALvE8SCV3I"; // test

    console.log('calling correct IMPORT 1_26_2020');

    var credit_type2;
    var hours2;
    var hours_approved2;
    var credit_type3;
    var hours3;
    var hours_approved3;

    let sheetId = "1LnX9QfVeF0zuSmnaYqZ-IrylW6U0P-xMqO-JW-3CS78"; 
    
    //https://spreadsheets.google.com/feeds/list/1LnX9QfVeF0zuSmnaYqZ-IrylW6U0P-xMqO-JW-3CS78/od6/public/values?alt=json


    let url =
      "https://spreadsheets.google.com/feeds/list/" +
      sheetId +
      "/od6/public/values?alt=json";

    //https://docs.google.com/spreadsheets/d/e/2PACX-1vR2tK0GbkDDNyHuF8GSwMlJPrRieWVzU3mL3QN6TbfBX7S1iFuaYKMKeWZgzNTxAJjd86GohitZJDD1/pubhtml

    //https://spreadsheets.google.com/feeds/list/1HukIuiUh6RbP40rFUkWxLrXdk66SBbBau2XBsNdmPlw/od6/public/values?alt=json

    //          console.log('inside insert');

    let x = 0;
    this.http
      .get(url)
      .map(res => res.json()) // . .json() )
      .subscribe(data => {

        console.log('json data ' + JSON.stringify(data));
        // console.log('length ' + data.feed.length);
        // console.log('rows: ' + data.feed.ROWS);

        var dataLengthCheck = data.feed.entry;
        var dataLength = dataLengthCheck.length;
        console.log('length? ' + dataLength);

        if (dataLength > 0) {
          this.displayAlert('Database Import', 'You are importing ' + dataLength + ' records from Google Sheets into your database.');
          //              alert('You are about to import ' + dataLength + ' records from Google Sheets into your database.');

        }

        while (x < dataLength) {
          //x = 1; // COMMENT THIS OUT TO PREVENT FROM RUNNING

          //    console.log(x);

          console.log('starting');

          let ce_date = data.feed.entry[x]["gsx$cedate"]["$t"];
                          console.log('ce date ' + ce_date);
          //let date_entered = data.feed.entry[x]["gsx$dateentered"]["$t"];
          let accreditor = data.feed.entry[x]["gsx$accreditor"]["$t"];
          //                console.log('accreditor ' + accreditor);

          let session = parseInt(data.feed.entry[x]["gsx$session"]["$t"]);

          let other = data.feed.entry[x]["gsx$other"]["$t"];
          console.log('other ' + other);

          //              console.log('session ' + session);                                

          let description = data.feed.entry[x]["gsx$description"]["$t"];
          //                console.log('description ' + description);                


          let credit_type1 = data.feed.entry[x]["gsx$credittype1"]["$t"];
          let hours1 = data.feed.entry[x]["gsx$hours1"]["$t"];
          let hours_approved1 = data.feed.entry[x]["gsx$hoursapproved1"]["$t"];

          let tempTestExists2 = data.feed.entry[x]["gsx$credittype2"]["$t"];
          if ((tempTestExists2 !== undefined) && (tempTestExists2 !== 'undefined')) {

            credit_type2 = data.feed.entry[x]["gsx$credittype2"]["$t"];
            hours2 = data.feed.entry[x]["gsx$hours2"]["$t"];
            hours_approved2 = data.feed.entry[x]["gsx$hoursapproved2"]["$t"];

          }
          else {
            credit_type2 = ""; hours2 = ""; hours_approved2 = "";
          }


          let tempTestExists3 = data.feed.entry[x]["gsx$credittype3"]["$t"];
          if ((tempTestExists3 !== undefined) && (tempTestExists3 !== 'undefined')) {

            credit_type3 = data.feed.entry[x]["gsx$credittype3"]["$t"];
            hours3 = data.feed.entry[x]["gsx$hours3"]["$t"];
            hours_approved3 = data.feed.entry[x]["gsx$hoursapproved3"]["$t"];

          }
          else {
            credit_type3 = ""; hours3 = ""; hours_approved3 = "";
          }

          let aoa_number = data.feed.entry[x]["gsx$aoanumber"]["$t"];
          let approval = data.feed.entry[x]["gsx$approval"]["$t"];

          approval = approval.charAt(0).toUpperCase() + approval.slice(1).toLowerCase();

          let approval_reason = data.feed.entry[x]["gsx$denialreason"]["$t"];

          let conference = data.feed.entry[x]["gsx$conference"]["$t"];

          //let createdByProcess = data.feed.entry[x]["gsx$createprocess"]["$t"];
          //console.log('approval_reason ' + approval_reason);


          console.log('aoa number: ' + aoa_number)

          x++;

          //  }

          //let createdByUser = this.cookieService.get('tokenFB_Num'); // CHANGE THIS TO USE THE COOKIE WHEN INTEGRATED WITH LARGER PROJECT
          //let createdByProcess = "user"; // WHEN IMPORTED FROM GOOGLE SHEET, THIS WILL BE SET AS 'system'

          let checkID = this.cookieService.get('tokenFB_Num');
          let createdByUser = this.srk.decryptString(checkID);

          let date_created = new Date();
          let localtestCreate = date_created.toLocaleString(); // toLocaleString gets us a local date when we're using a machine-created date
          let date_created_local = new Date(localtestCreate.replace(/-/g, '\/'));

          //  alert('date created with slashe: ' + testDate);

          let temp_ce_date = ce_date.toLocaleString();
          let ce_date_localtime = new Date(temp_ce_date.replace(/-/g, '\/'));


          /*    let dtCreated = new Date();
             let date_entered = new Date();
        */
          // CREATES RECORD WITH RANDOM, UNIQUE _DOC ID
          this._CONTENT = {
            ce_date: ce_date_localtime,
            date_entered: date_created_local, // when creating this as a mass import, set date entered to system date
            accreditor: accreditor,
            session: session,
            other: other,
            description: description,
            credit_type1: credit_type1,
            hours1: hours1,
            hours_approved1: hours_approved1,
            credit_type2: credit_type2,
            hours2: hours2,
            hours_approved2: hours_approved2,
            credit_type3: credit_type3,
            hours3: hours3,
            hours_approved3: hours_approved3,
            //delivery_method: delivery_method,
            supporting_doc: "",
            aoa_number: aoa_number,
            approval: approval,
            approval_reason: approval_reason,
            conference: conference, //"Clinical Assembly 2018" // NEEDS TO BE AVAILABLE FOR BOTH SETS OF IMPORTS - ALL THREE... 
            created_by: createdByUser,
            created_by_process: 'system',
            date_created: date_created_local,

          };

          this._DB
          .collection(this._COLL)
  //        .collection('TEST')
            .add(this._CONTENT);

        }

      });
  }

  updateFirebasefromGoogleSheets() {

    console.log('update from sheets');

    var credit_type2;
    var hours2;
    var hours_approved2;
    var credit_type3;
    var hours3;
    var hours_approved3;

    let sheetId = "1LnX9QfVeF0zuSmnaYqZ-IrylW6U0P-xMqO-JW-3CS78";

    let url =
      "https://spreadsheets.google.com/feeds/list/" +
      sheetId +
      "/od6/public/values?alt=json";

    let x = 0;
    this.http
      .get(url)
      .map(res => res.json()) // . .json() )
      .subscribe(data => {


        var dataLengthCheck = data.feed.entry;
        var dataLength = dataLengthCheck.length;
        console.log('length? ' + dataLength);

        let testForUpdateID = data.feed.entry[x]["gsx$recordid"]["$t"];

        console.log('testForUpdateID ' + testForUpdateID);

        if (testForUpdateID.length === 0) {
          alert('WARNING: RECORD IDs are required. You are attempting an update so each record needs the unique id from the database.');
          return;
        }

        if (testForUpdateID === undefined) {
          console.log('undefined');
        }

        if (dataLength > 0) {
          this.displayAlert('Database Import', 'You are updating ' + dataLength + ' records into your database using Google Sheets data.');
          //              alert('You are about to import ' + dataLength + ' records from Google Sheets into your database.');
        }

        while (x < dataLength) {
          //x = 1; // COMMENT THIS OUT TO PREVENT FROM RUNNING

          //    console.log(x);

          console.log('starting');

          let ce_date = data.feed.entry[x]["gsx$cedate"]["$t"];
          //                console.log('ce date ' + ce_date);
          //let date_entered = data.feed.entry[x]["gsx$dateentered"]["$t"];
          let accreditor = data.feed.entry[x]["gsx$accreditor"]["$t"];
          //                console.log('accreditor ' + accreditor);

          let session = parseInt(data.feed.entry[x]["gsx$session"]["$t"]);

          let other = data.feed.entry[x]["gsx$other"]["$t"];
          //              console.log('session ' + session);                                

          let description = data.feed.entry[x]["gsx$description"]["$t"];
          //                console.log('description ' + description);                

          

          let credit_type1 = data.feed.entry[x]["gsx$credittype1"]["$t"];
          let hours1 = data.feed.entry[x]["gsx$hours1"]["$t"];
          let hours_approved1 = data.feed.entry[x]["gsx$hoursapproved1"]["$t"];

          let tempTestExists2 = data.feed.entry[x]["gsx$credittype2"]["$t"];
          if ((tempTestExists2 !== undefined) && (tempTestExists2 !== 'undefined')) {

            credit_type2 = data.feed.entry[x]["gsx$credittype2"]["$t"];
            hours2 = data.feed.entry[x]["gsx$hours2"]["$t"];
            hours_approved2 = data.feed.entry[x]["gsx$hoursapproved2"]["$t"];

          }
          else {
            credit_type2 = ""; hours2 = ""; hours_approved2 = "";
          }


          let tempTestExists3 = data.feed.entry[x]["gsx$credittype2"]["$t"];
          if ((tempTestExists3 !== undefined) && (tempTestExists3 !== 'undefined')) {

            credit_type3 = data.feed.entry[x]["gsx$credittype3"]["$t"];
            hours3 = data.feed.entry[x]["gsx$hours3"]["$t"];
            hours_approved3 = data.feed.entry[x]["gsx$hoursapproved3"]["$t"];

          }
          else {
            credit_type3 = ""; hours3 = ""; hours_approved3 = "";
          }

          let aoa_number = data.feed.entry[x]["gsx$aoanumber"]["$t"];
          let approval = data.feed.entry[x]["gsx$approval"]["$t"];

          approval = approval.charAt(0).toUpperCase() + approval.slice(1).toLowerCase();

          let approval_reason = data.feed.entry[x]["gsx$denialreason"]["$t"];

          //let createdByProcess = data.feed.entry[x]["gsx$createprocess"]["$t"];
          //console.log('approval_reason ' + approval_reason);

          let conference = data.feed.entry[x]["gsx$conference"]["$t"];
          let record_id = data.feed.entry[x]["gsx$recordid"]["$t"];

          let supporting_doc = data.feed.entry[x]["gsx$supportingdocuments"]["$t"]; // if updating supporting_doc, google sheet format should be: "https://firebasestorage.googleapis.com/v0/b/poma-cme-57533.appspot.com/o/177881%2FBLS%202018-2020.pdf?alt=media&token=9febd5cc-477a-4368-b65b-a4c3f47909bc"|

          x++;

          //  }

          //let createdByUser = this.cookieService.get('tokenFB_Num'); // CHANGE THIS TO USE THE COOKIE WHEN INTEGRATED WITH LARGER PROJECT
          //let createdByProcess = "user"; // WHEN IMPORTED FROM GOOGLE SHEET, THIS WILL BE SET AS 'system'

          let checkID = this.cookieService.get('tokenFB_Num');
          let createdByUser = this.srk.decryptString(checkID);

          let date_created = new Date();
          let localtestCreate = date_created.toLocaleString(); // toLocaleString gets us a local date when we're using a machine-created date
          let date_created_local = new Date(localtestCreate.replace(/-/g, '\/'));

          //  alert('date created with slashe: ' + testDate);

          let temp_ce_date = ce_date.toLocaleString();
          let ce_date_localtime = new Date(temp_ce_date.replace(/-/g, '\/'));

          /* this._DB
          .updateDocument(this._COLL, record_id, {
            ce_date: ce_date_localtime,
            //date_entered: new Date(this.date_entered),
            accreditor: accreditor,
            credit_type1: credit_type1,
            hours1: hours1,
            hours_approved1: hours_approved1,
            credit_type2: this.credit_type2,
            hours2: hours2,
            hours_approved2: hours_approved2,
            credit_type3: this.credit_type3,
            hours3: hours3,
            hours_approved3: hours_approved3,
            description: description,
            supporting_doc: supporting_doc,
            aoa_number: this.aoa_number,
            approval: approval,
            approval_reason: approval_reason,
            created_by: this.created_by,
            created_by_process: this.created_by_process,
            date_created: date_created_local
    }) */
          /*      updateDocument(collectionObj : string,
                 docID         : string,
                 dataObj       : any) : Promise<any>
         {
         return new Promise((resolve, reject) =>
         {
          this._DB
          .collection(collectionObj)
          .doc(docID)
          .update(dataObj)
          .then((obj : any) =>
          {
             resolve(obj);
          })
          .catch((error : any) =>
          {
             reject(error);
          });
         });
         } */

          //}

          // CREATES RECORD WITH RANDOM, UNIQUE _DOC ID
          this._DBP
            .updateDocument(this._COLL, record_id, {
              ce_date: ce_date_localtime,
              date_entered: date_created_local, // when creating this as a mass import, set date entered to system date
              accreditor: accreditor,
              session: session,
              other: other,
              description: description,
              credit_type1: credit_type1,
              hours1: hours1,
              hours_approved1: hours_approved1,
              credit_type2: credit_type2,
              hours2: hours2,
              hours_approved2: hours_approved2,
              credit_type3: credit_type3,
              hours3: hours3,
              hours_approved3: hours_approved3,
              //delivery_method: delivery_method,
              supporting_doc: supporting_doc,
              aoa_number: aoa_number,
              approval: approval,
              approval_reason: approval_reason,
              created_by: createdByUser,
              created_by_process: 'system',
              date_created: date_created_local,
              conference: conference // NEEDS TO BE AVAILABLE FOR BOTH SETS OF IMPORTS - ALL THREE... 
            });

          /*  this._DB
           .collection('POMA CME Records') //.collection(this._COLL)
           .add(this._CONTENT); */

        }

      });
  }

  /*   update :-)

    this._DB
    .updateDocument(this._COLL, this.docID, { */

  runBackUpBatches(collectionObj)
  {

    var totalRecords = this._DBP.getDocsLength(collectionObj)
    .then(data =>{
      console.log('data: ' + JSON.stringify(data))
    })

    this._DBP.runBackUpBatches(collectionObj)
    
      // srk 2019
      // DIVIDE TOTAL RECORDS BY 1000 AND WHILE THROUGH THEM ALL
      // FROM HERE - CAN I CALL runBackUpBatches FOR EVERY 1000 RECORDS
      // THEN WRITE OUT EVERY 1000 RECORDS
      // SENDING BACK IN EACH TIME A NEW lastVisible FOR THE STARTAT

  }

  exportDBtoFile(collectionObj: string, searchCriteria: string, approvalSearchCriteria: string, start_date: string, end_date: string) {

    //      alert('inside exportDBtoFile - searchCriteria' + searchCriteria);

    //      if (searchCriteria )
    //let searchString = "adminUser";

    let approvalSearchString = approvalSearchCriteria;


    this._DBP.getDocuments(collectionObj, searchCriteria, approvalSearchString, start_date, end_date)
      .then(data => {
        if (data.length === 0) {
          alert("There are no records available for export with these search criteria:\n AOA Number: " + searchCriteria + "\n Admin Approval: " + approvalSearchString + "\n Start Date: " + start_date + "\n End Date: " + end_date);
          //this.displayAlert('Database Export', 'There are no records available for export with the specified criteria');
        } else {
          this.displayAlert('Database Export', 'You are exporting ' + data.length + ' CME records to file: cmeExports.csv');

          this.cmeRecords = data; // THIS JUST LOADS UP THE RECORDSET SO THE HTML CAN WRITE THEM OUT
          var fileText: string = "";
          var fileName = "cmeExports.csv";
          let fullFile: any = [];

          // CREATE Excel COLUMN HEADERS  
          fileText =
            "CE Date" + ', ' +
            /*             "Date Entered" + ', ' + */
            "Accreditor" + ', ' +
            "Session" + ', ' +
            "Other" + ', ' + 
            "Description" + ', ' + 
            "Credit Type 1" + ', ' +
            "Hours 1" + ', ' +
            "Hours Approved 1" + ', ' +
            "Credit Type 2" + ', ' +
            "Hours 2" + ', ' +
            "Hours Approved 2" + ', ' +
            "Credit Type 3" + ', ' +
            "Hours 3" + ', ' +
            "Hours Approved 3" + ', ' +
            "AOA Number" + ', ' +
            "Approval" + ', ' +
            "Denial Reason" + ', ' +
            "conference" + ', ' +
            "record id" + ', ' +
            "Supporting Documents" + ', ' +
            "Created / Updated By" + ', ' +
            "Create Method" + ', ' +
            "Last Updated" + ', ' +

            '\n';

          this.cmeRecords.forEach(element => {
            // CREATE AN ARRAY AND LOOP THROUGH EACH RECORD AS WE PRINT OR JUST CONTATENATE STRINGS AND PRINT EACH AS WE GO?
            //  let res = JSON.stringify(data);
            //  console.log('full dump: ' + res);
            //  console.log("try created_by_process: " + element.created_by_process); // data().hours);

            let formatted_ce_date = this.datepipe.transform(element.ce_date, 'yyyy-MM-dd');
            //  let formatted_date_entered = this.datepipe.transform(element.date_entered, 'yyyy-MM-dd');
            let formatted_date_created = this.datepipe.transform(element.date_created, 'yyyy-MM-dd');


            // ADD A LIBRARY SERVICE TO CLEAN OUT TEXT?
            let cleanDescription = element.description.replace(/,/g, '\,');

            // should do this and test it for apostrophes, too - srk 6/8/2018

            //itemDesc = itemDesc.replace(/,/g, '\,');

            //console.log('clean? ', cleanDescription);


            let cleanCreditType1 = element.credit_type1.replace(/\s+/g,'');
            cleanCreditType1 = cleanCreditType1.replace(/,/g, '\, ');
            // element.credit_type1 + ',' +

            fileText = fileText +
              formatted_ce_date + ',' +
              element.accreditor + ',' +
              element.session + ',' +
              element.other + ',' +
              '"' + cleanDescription + '"' + ',' +
              '"' + cleanCreditType1 + '"' + ',' +
              element.hours1 + ',' +
              element.hours_approved1 + ',' +
              element.credit_type2 + ',' +
              element.hours2 + ',' +
              element.hours_approved2 + ',' +
              element.credit_type3 + ',' +
              element.hours3 + ',' +
              element.hours_approved3 + ',' +
              element.aoa_number + ',' +
              element.approval + ',' +
              element.approval_reason + ',' +
              element.conference + ',' +
              element.id + ',' +
              element.supporting_doc + ',' +
              element.created_by + ',' +
              element.created_by_process + ',' +
              formatted_date_created +
              '\n';

            fullFile.push({
              fileText
            });

          });

          this.saveTextAsFile(fileText, fileName);
        }

      })
      .catch();
    /* .catch(error => {
      this.displayAlert("File Export Failed", error.message);
    }); */

  }

  displayAlert(title: string,
    message: string): void {
    let alert: any = this._ALERT.create({
      title: title,
      subTitle: message,
      buttons: [{
        text: 'Got It!'
        /* ,
        handler   : () =>
        {
        this.retrieveCollection();
        } */
      }]
    });

    alert.present();
  }

  saveTextAsFile(data, filename) {
    if (!data) {
      console.error("Console.save: No data");
      return;
    }

    if (!filename) filename = "console.json";
    var blob = new Blob([data], { type: "text/plain" }),
      e = document.createEvent("MouseEvents"),
      a = document.createElement("a");
    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ["text/plain", a.download, a.href].join(":");
    e.initEvent("click", true, false);
    a.dispatchEvent(e);
  }


  buildOneConferenceDay(conferenceDay, ce_date, aoa_number, credit_type1, hours1, description, session) {


  }


convertPOFPSattestationSheets() {

  //let defaultCreditType = "1A";
  //let exCeptionCreditType = "1A";

  let sheetId = "1LnX9QfVeF0zuSmnaYqZ-IrylW6U0P-xMqO-JW-3CS78";
  let url =
    "https://spreadsheets.google.com/feeds/list/" +
    sheetId +
    "/od6/public/values?alt=json";

  let x = 0;
  /*  8/3 - day 1 - 5 sessions 1 - 5
      8/4 - day 2 - 8 sessions - 6 - 13
      8/5 - day 3 - 5 sessions 14 - 18  */

//  var firstDate = new Date("2018-08-03T00:00:00".replace(/-/g, '\/').replace(/T.+/, ''));
//  var secondDate = new Date("2018-08-04T00:00:00".replace(/-/g, '\/').replace(/T.+/, ''));
  var thirdDate = new Date("2018-08-05T00:00:00".replace(/-/g, '\/').replace(/T.+/, ''));

  this.http
    .get(url)
    .map(res => res.json()) // . .json() ) // DOES THIS NEED TO BE AN OBSERVABLE OR CAN IT JUST BE A PROMISE? (THEN INSTEAD OF SUBSCRIBE)
    .subscribe(data => {

      var dataLengthCheck = data.feed.entry;
      var dataLength = dataLengthCheck.length;

      if (dataLength > 0) {
        this.displayAlert('Database Import', 'You are converting the attestation records of ' + dataLength + ' members from Google Sheets into your database.');
      }

      while (x < dataLength) {
        var totals_1A = 0;
        var totals_OP_1A = 0;
        var totals__CA_1A = 0;
        var totals_PS_1A = 0;

        console.log('converting records for member ' + x);
        let aoa_number = data.feed.entry[x]["gsx$aoanumber"]["$t"];

        // DAY ONE
        if (data.feed.entry[x]["gsx$one"]["$t"]) totals_1A++;
        //this.confProv.createRecordsForPOFPSsession(1, firstDate, aoa_number, defaultCreditType, 1.00, "The Care of the Medically Complex Child and Their Transition to Adult Medical Care", 1);
        if (data.feed.entry[x]["gsx$two"]["$t"]) totals_1A++; 
        //this.confProv.createRecordsForPOFPSsession(1, firstDate, aoa_number, defaultCreditType, 1.00, "Adolescent Sports Injuries", 1);
        if (data.feed.entry[x]["gsx$three"]["$t"]) totals_1A++; 
        //this.confProv.createRecordsForPOFPSsession(1, firstDate, aoa_number, defaultCreditType, 1.00, "Urgent Care in the Family Practice Setting", 1);
        if (data.feed.entry[x]["gsx$four"]["$t"]) totals_PS_1A++;
        //this.confProv.createRecordsForPOFPSsession(1, firstDate, aoa_number, "PS_1A", 1.00, "Disrupting Health Care with Blockchain", 1);
        if (data.feed.entry[x]["gsx$five"]["$t"]) 
        {
          if (data.feed.entry[x]["gsx$five"]["$t"] === 'x' || data.feed.entry[x]["gsx$five"]["$t"] === 'X')
          { 
            totals_OP_1A++;
            totals_OP_1A++;
          } else {
            totals_1A++;
            totals_1A++;
          }

       //this.confProv.createRecordsForPOFPSsession(1, firstDate, aoa_number, exCeptionCreditType, 2.00, "Pain Management and Opioids: Balancing Risks and Benefits", 1);
        }

        // DAY TWO
        // exCeptionCreditType = "1A"; // RESET IN CASE CHANGED ABOVE
        if (data.feed.entry[x]["gsx$six"]["$t"]) 
        {
          if (data.feed.entry[x]["gsx$six"]["$t"] === 'x' || data.feed.entry[x]["gsx$six"]["$t"] === 'X')
          { 
            totals__CA_1A++;
            totals__CA_1A++;
          } else {
            totals_1A++;
            totals_1A++;
          }
          //this.confProv.createRecordsForPOFPSsession(2, secondDate, aoa_number, exCeptionCreditType, 2.00, "Recognizing and Reporting Child Abuse in Pennsylvania", 1);
        }
        //exCeptionCreditType = "1A"; // RESET IN CASE CHANGED ABOVE

        if (data.feed.entry[x]["gsx$seven"]["$t"]) totals_PS_1A++;
        //this.confProv.createRecordsForPOFPSsession(2, secondDate, aoa_number, "PS_1A", 1.00, "Quality Improvement Whys and Hows", 1);
        if (data.feed.entry[x]["gsx$eight"]["$t"]) totals_1A++;
        //this.confProv.createRecordsForPOFPSsession(2, secondDate, aoa_number, defaultCreditType, 1.00, "Medical Marijuana Update", 1);
        if (data.feed.entry[x]["gsx$nine"]["$t"]) totals_1A++;
        //this.confProv.createRecordsForPOFPSsession(2, secondDate, aoa_number, defaultCreditType, 1.00, "Obesity Management in Primary Care", 1);
        if (data.feed.entry[x]["gsx$ten"]["$t"]) totals_1A++;
        //this.confProv.createRecordsForPOFPSsession(2, secondDate, aoa_number, defaultCreditType, 1.00, "Wound Care 101", 1);
        if (data.feed.entry[x]["gsx$eleven"]["$t"]) totals_1A++;
        //this.confProv.createRecordsForPOFPSsession(2, secondDate, aoa_number, defaultCreditType, 1.00, "Practical Application of OMT in the Office", 1);
        if (data.feed.entry[x]["gsx$twelve"]["$t"]) totals_1A++;
        //this.confProv.createRecordsForPOFPSsession(2, secondDate, aoa_number, defaultCreditType, 1.00, "Stroke Guidelines Update 2018", 1);
        if (data.feed.entry[x]["gsx$thirteen"]["$t"]) totals_PS_1A++;
        //this.confProv.createRecordsForPOFPSsession(2, secondDate, aoa_number, "PS_1A", 1.00, "HIV Basics for the Family Practitioner", 1);

        // DAY THREE
        if (data.feed.entry[x]["gsx$fourteen"]["$t"]) totals_PS_1A++;
        //this.confProv.createRecordsForPOFPSsession(3, thirdDate, aoa_number, "PS_1A", 1.00, "Emails, Text and Social Media: What Physicians Need to Know", 1);
        if (data.feed.entry[x]["gsx$fifteen"]["$t"]) totals_1A++;
        //this.confProv.createRecordsForPOFPSsession(3, thirdDate, aoa_number, defaultCreditType, 1.00, "The Management of Atopic Dermatitis and Urticaria", 1);
        if (data.feed.entry[x]["gsx$sixteen"]["$t"]) totals_1A++;
        //this.confProv.createRecordsForPOFPSsession(3, thirdDate, aoa_number, defaultCreditType, 1.00, "An Osteopathic Approach to Asthma", 1);
        if (data.feed.entry[x]["gsx$seventeen"]["$t"]) totals_PS_1A++;
        // this.confProv.createRecordsForPOFPSsession(3, thirdDate, aoa_number, "PS_1A", 1.00, "Does Cultural Competency Make Us Better at Delivering Patient Care?", 1);
        if (data.feed.entry[x]["gsx$eighteen"]["$t"]) totals_PS_1A++;
        //this.confProv.createRecordsForPOFPSsession(3, thirdDate, aoa_number, "PS_1A", 1.00, "Implementing a Physician Well-Being Model", 1);

        x++;
        if (totals_1A) this.confProv.createRecordsForPOFPSsession(thirdDate, aoa_number, "1A", totals_1A);
        if (totals_OP_1A) this.confProv.createRecordsForPOFPSsession(thirdDate, aoa_number, "OP_1A", totals_OP_1A);
        if (totals__CA_1A) this.confProv.createRecordsForPOFPSsession(thirdDate, aoa_number, "CA_1A", totals__CA_1A);
        if (totals_PS_1A) this.confProv.createRecordsForPOFPSsession(thirdDate, aoa_number, "PS_1A", totals_PS_1A);
      }

      

    });

}


/*   convertPOFPSattestationSheets_bak() {

    let defaultCreditType = "1A";
    let exCeptionCreditType = "1A";

    let sheetId = "1LnX9QfVeF0zuSmnaYqZ-IrylW6U0P-xMqO-JW-3CS78";
    let url =
      "https://spreadsheets.google.com/feeds/list/" +
      sheetId +
      "/od6/public/values?alt=json";

    let x = 0;
      8/3 - day 1 - 5 sessions 1 - 5
        8/4 - day 2 - 8 sessions - 6 - 13
        8/5 - day 3 - 5 sessions 14 - 18 

    var firstDate = new Date("2018-08-03T00:00:00".replace(/-/g, '\/').replace(/T.+/, ''));
    var secondDate = new Date("2018-08-04T00:00:00".replace(/-/g, '\/').replace(/T.+/, ''));
    var thirdDate = new Date("2018-08-05T00:00:00".replace(/-/g, '\/').replace(/T.+/, ''));

    this.http
      .get(url)
      .map(res => res.json()) // . .json() )
      .subscribe(data => {

        var dataLengthCheck = data.feed.entry;
        var dataLength = dataLengthCheck.length;

        if (dataLength > 0) {
          this.displayAlert('Database Import', 'You are converting the attestation records of ' + dataLength + ' members from Google Sheets into your database.');
        }

        while (x < dataLength) {

          console.log('converting records for member ' + x);
          let aoa_number = data.feed.entry[x]["gsx$aoanumber"]["$t"];

          // DAY ONE
          if (data.feed.entry[x]["gsx$one"]["$t"]) this.confProv.createRecordsForPOFPSsession(1, firstDate, aoa_number, defaultCreditType, 1.00, "The Care of the Medically Complex Child and Their Transition to Adult Medical Care", 1);
          if (data.feed.entry[x]["gsx$two"]["$t"]) this.confProv.createRecordsForPOFPSsession(1, firstDate, aoa_number, defaultCreditType, 1.00, "Adolescent Sports Injuries", 1);
          if (data.feed.entry[x]["gsx$three"]["$t"]) this.confProv.createRecordsForPOFPSsession(1, firstDate, aoa_number, defaultCreditType, 1.00, "Urgent Care in the Family Practice Setting", 1);
          if (data.feed.entry[x]["gsx$four"]["$t"]) this.confProv.createRecordsForPOFPSsession(1, firstDate, aoa_number, "PS_1A", 1.00, "Disrupting Health Care with Blockchain", 1);
          if (data.feed.entry[x]["gsx$five"]["$t"]) 
          {
            if (data.feed.entry[x]["gsx$five"]["$t"] === 'x' || data.feed.entry[x]["gsx$five"]["$t"] === 'X')
            { exCeptionCreditType = "OP_1A"}
            this.confProv.createRecordsForPOFPSsession(1, firstDate, aoa_number, exCeptionCreditType, 2.00, "Pain Management and Opioids: Balancing Risks and Benefits", 1);
          }

          // DAY TWO
          exCeptionCreditType = "1A"; // RESET IN CASE CHANGED ABOVE
          if (data.feed.entry[x]["gsx$six"]["$t"]) 
          {
            if (data.feed.entry[x]["gsx$six"]["$t"] === 'x' || data.feed.entry[x]["gsx$six"]["$t"] === 'X')
            { exCeptionCreditType = "CA_1A"}
            this.confProv.createRecordsForPOFPSsession(2, secondDate, aoa_number, exCeptionCreditType, 2.00, "Recognizing and Reporting Child Abuse in Pennsylvania", 1);
          }
          exCeptionCreditType = "1A"; // RESET IN CASE CHANGED ABOVE

          if (data.feed.entry[x]["gsx$seven"]["$t"]) this.confProv.createRecordsForPOFPSsession(2, secondDate, aoa_number, "PS_1A", 1.00, "Quality Improvement Whys and Hows", 1);
          if (data.feed.entry[x]["gsx$eight"]["$t"]) this.confProv.createRecordsForPOFPSsession(2, secondDate, aoa_number, defaultCreditType, 1.00, "Medical Marijuana Update", 1);
          if (data.feed.entry[x]["gsx$nine"]["$t"]) this.confProv.createRecordsForPOFPSsession(2, secondDate, aoa_number, defaultCreditType, 1.00, "Obesity Management in Primary Care", 1);
          if (data.feed.entry[x]["gsx$ten"]["$t"]) this.confProv.createRecordsForPOFPSsession(2, secondDate, aoa_number, defaultCreditType, 1.00, "Wound Care 101", 1);
          if (data.feed.entry[x]["gsx$eleven"]["$t"]) this.confProv.createRecordsForPOFPSsession(2, secondDate, aoa_number, defaultCreditType, 1.00, "Practical Application of OMT in the Office", 1);
          if (data.feed.entry[x]["gsx$twelve"]["$t"]) this.confProv.createRecordsForPOFPSsession(2, secondDate, aoa_number, defaultCreditType, 1.00, "Stroke Guidelines Update 2018", 1);
          if (data.feed.entry[x]["gsx$thirteen"]["$t"]) this.confProv.createRecordsForPOFPSsession(2, secondDate, aoa_number, "PS_1A", 1.00, "HIV Basics for the Family Practitioner", 1);

          // DAY THREE
          if (data.feed.entry[x]["gsx$fourteen"]["$t"]) this.confProv.createRecordsForPOFPSsession(3, thirdDate, aoa_number, "PS_1A", 1.00, "Emails, Text and Social Media: What Physicians Need to Know", 1);
          if (data.feed.entry[x]["gsx$fifteen"]["$t"]) this.confProv.createRecordsForPOFPSsession(3, thirdDate, aoa_number, defaultCreditType, 1.00, "The Management of Atopic Dermatitis and Urticaria", 1);
          if (data.feed.entry[x]["gsx$sixteen"]["$t"]) this.confProv.createRecordsForPOFPSsession(3, thirdDate, aoa_number, defaultCreditType, 1.00, "An Osteopathic Approach to Asthma", 1);
          if (data.feed.entry[x]["gsx$seventeen"]["$t"]) this.confProv.createRecordsForPOFPSsession(3, thirdDate, aoa_number, "PS_1A", 1.00, "Does Cultural Competency Make Us Better at Delivering Patient Care?", 1);
          if (data.feed.entry[x]["gsx$eighteen"]["$t"]) this.confProv.createRecordsForPOFPSsession(3, thirdDate, aoa_number, "PS_1A", 1.00, "Implementing a Physician Well-Being Model", 1);

          x++;
        }

      });

  } */


}
