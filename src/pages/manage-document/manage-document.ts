import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { CookieService } from 'ngx-cookie-service';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { clientVars } from './../../environments/environment';
//import { HomePage } from '../home/home';
//import { ProgressBarComponent } from '../../components/progress-bar/progress-bar';

import { SrkServicesProvider } from '../../providers/srk-services/srk-services';

@IonicPage({
  name: "manage-document"
})
@Component({
  selector: "page-manage-document",
  templateUrl: "manage-document.html"
})
export class ManageDocumentPage {

  oneUrl;
//  docList : any;


  public docList = [];
  public docListNames = [];
  public records: any;
  public date_entered: string = "";
  public accreditor: string = "";
  public credit_type1: string = "";
  public hours1: number;
  public hours_approved1: number;
  public credit_type2: string = "";
  public hours2: number;
  public hours_approved2: number;
  public credit_type3: string = "";
  public hours3: number;  
  public hours_approved3: number;
  public hours_total: number;
  public delivery_method: string = "";
  public description: string = "";
  public docID: string = "";
  public isEditable: boolean = false;
  public approval: string = "";
  public approval_reason: string = "";
  public supporting_doc: string = "";
  public aoa_number: string = "";
  public supporting_doc_from_db: string = "";
  public numFiles: number;
  public title: string = "CME Record - Add";
  conference: string;
  memberEditAsConference: boolean = false;
  
//TEMP CHANGE 
  _COLL = clientVars.cycleCollection1; // MAY REMOVE THIS ALTOGETHER
  
  public tempCOL: String;
  isAdmin: boolean = false;
  isDisabled: boolean = true;
  isMissingSupportDoc: boolean = true;
  disableAOA_Number: boolean = true;
  public fileJustUploaded: string;
  public loadProgress : number = 0;

  public created_by; 
  public created_by_process; 
  public date_created; 
  public ce_date;

  form: FormGroup;
  submitAttempt: boolean = false;

  file: File;

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public _FB: FormBuilder,
    private _DB: DatabaseProvider,
    private _ALERT: AlertController,
    public cookieService: CookieService,
    public srk: SrkServicesProvider
  ) {

   this.docList = [];
   this.docListNames = [];
   console.log('set 1')
   this.isDisabled = true;
  

    this.fileJustUploaded;
    this.cookieService;
    this.tempCOL = this._COLL;
    
    // NEW RECORD FORM VALUES
      this.form = _FB.group({
      ce_date: ["", Validators.required],
      //date_entered: ["", Validators.required],
      accreditor: ["", Validators.required],
      credit_type1: ["", Validators.required],
      hours1: ["", Validators.compose([Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/),Validators.required])], // allow two decimals
      hours_approved1: ["", Validators.compose([Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)])], // allow two decimals
      credit_type2: ["", ""],
      hours2: ["", Validators.compose([Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)])], // allow two decimals
      hours_approved2: ["", Validators.compose([Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)])], // allow two decimals
      credit_type3: ["", ""],
      hours3: ["", Validators.compose([Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)])], // allow two decimals
      hours_approved3: ["", Validators.compose([Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)])], // allow two decimals
      //delivery_method: ["", Validators.required],
      description: ["", Validators.required],
      supporting_doc: ["", ""],
      aoa_number: ["", Validators.required],
      approval:  ["", ""],
      approval_reason:  ["", ""]
    });

    let adminCookieCheck = this.cookieService.get('tokenTOMAAdmin');
      if ( adminCookieCheck ) {
          this.isAdmin = true;
          console.log('set 2')
          this.isDisabled = false; 
          this.disableAOA_Number = false;
        }


    // REVIEW THIS SECTION    
    let checkID = this.cookieService.get('tokenFB_Num');
    if ( checkID ) {
//      alert('test');
      if (this.isAdmin)      {
        
      }

      this.aoa_number = this.srk.decryptString(checkID);

    }

    // UP TO HERE

    // If we have navigation parameters then we need to
    // parse these as we know these will be used for
    // editing an existing record

    if (params.get("isEdited")) { // COMING FROM HOME - THIS IS SET AS EDITED ON THE WAY INTO THE DOCUMENT MANAGEMENT FILE

      let record = params.get("record");

      this.ce_date = record.location.ce_date;

      console.log('conference? ' + record.location.conference)

      //GIVE MEMBER SOME EDIT ABILITY IF THIS IS A CONFERENCE ATTESTATION
      if (record.location.conference)
      {this.memberEditAsConference = true}
      else
      {this.memberEditAsConference = false}

      console.log('ce_date from isedited 144: ' + this.ce_date);


      console.log('manage docs constructor id' + record.location.id);

      this.date_entered = record.location.date_entered;
      this.accreditor = record.location.accreditor;
     
      this.credit_type1 = record.location.credit_type1;
      this.hours1 = record.location.hours1;
      this.hours_approved1 = record.location.hours_approved1;

      this.credit_type2 = record.location.credit_type2;
      this.hours2 = record.location.hours2;      
      this.hours_approved2 = record.location.hours_approved2;

      this.credit_type3 = record.location.credit_type3;
      this.hours3 = record.location.hours3;      
      this.hours_approved3 = record.location.hours_approved3;

//      this.hours_total = parseInt(this.hours1) +  parseInt(this.hours2) + parseInt(this.hours3);
      
      this.delivery_method = record.location.delivery_method;
      this.description = record.location.description;
      //alert('description' + this.description);
      this.supporting_doc = record.location.supporting_doc;
      this.supporting_doc_from_db = record.location.supporting_doc;
      this.aoa_number = record.location.aoa_number;
      //alert('aoa num' + this.aoa_number);
      this.approval = record.location.approval;
      this.approval_reason = record.location.approval_reason;
      // AUDIT FIELDS NEED TO DISPLAY THE DATA THAT IS CURRENTLY IN THE DATABASE, NOT THE DATA THAT WOULD REPLACE IT WITH AN UPDATE
      
      // THIS JUST PULLS FROM THE HOME PAGE:
      console.log('record.created_by: ' + record.location.created_by);
      this.created_by = record.location.created_by;
      this.created_by_process = record.location.created_by_process; // WHEN IMPORTED FROM GOOGLE SHEET, THIS WILL BE SET AS 'system'
      this.date_created = record.location.date_created;

      if (this.supporting_doc === undefined) {}
      else
      if ((this.supporting_doc != "") && (this.supporting_doc)) {

        //console.log('this.supporting_doc ' + this.supporting_doc);

      let checkLast = 1;
      //let x = 0;

        // ON WAY INTO VIEW - PULL APART THE EXISTING DOCUMENT FIELD - REDUCES THIS.SUPPORTING_DOC UNTIL IT IS EMPTY
        while(checkLast > 0)
        { 

          //build more complex array to add a name element?
          
          let newParse = this.supporting_doc.indexOf('"|'); // this is the character number of the end of the full path for one support doc
          let newAssembly = this.supporting_doc.substring(1,newParse); // this is one support doc
          
          let getName1 = newAssembly.indexOf(this.aoa_number);
          
          let getName2 = newAssembly.substring(getName1 + 1);
          
          let startOfName = getName2.indexOf('%2F');

          let getName3 = getName2.substring(getName2.indexOf('%2F') + 3);

          let getNameFinal = getName3.substring(0,getName3.indexOf('?'));

          this.docList.push({
            fullPath: newAssembly,
            justName: getNameFinal
          }); 
          
          // this.docList.push(newAssembly);
          //
          this.supporting_doc = this.supporting_doc.substring(newParse + 2); // cut out first doc from path and start again
          checkLast = this.supporting_doc.indexOf('"|');
          //x++;
        }

      }

      this.docID = record.location.id;
      this.approval = record.location.approval;
      this.isEditable = true;
      this.title = "CME Record - View";

    } else
    {
      console.log('set 3')
      this.isDisabled = false; 
    }

  }

  changeNumber() : void {
    let alert : any     = this._ALERT.create({
      title      : 'ID Change',
      subTitle   : 'You are changing the AOA Number to ' + this.aoa_number,
      buttons    : [{
       text      : 'Okay',
       handler   : () =>
       {
       }
     },
     {
      text: 'Cancel Change',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    }
    ]
   });
    alert.present();
  } 

  setAccreditor($event) {

    var accreditorValue = (<HTMLInputElement>document.getElementById("accreditor")).value;

    alert('event test ' + $event.target.value)

    alert('test change: ' + accreditorValue)

  }

  changeListener($event) : void { // grabs the file object - the put below does the upload

    //alert('do we know the aoa number? ' + this.aoa_number );

    this.loadProgress = 0;
    //this.file = $event.target.files[0];
    this.numFiles =  $event.target.files.length; //[0]
    //alert('name? ' + $event.target.files[0].name);

    //console.log('num files' + this.numFiles);

     for (var i = 0; i < this.numFiles; i++) {

      this.uploadImageAsPromise($event.target.files[i], this.aoa_number)
       .then((data)=> {
        let res = JSON.stringify(data);
        this.supporting_doc = this.supporting_doc + res + '|';
        // srk - CAN ADD A NEW FIELD ALTOGETHER TO HOLD THE DOCUMENT NAME - OR PARSE THIS STRING APART CONSISTENTLY TO SHOW THE NAME... 
        let newParse = this.supporting_doc.indexOf('"|'); // this is the character number of the end of the full path for one support doc
        let newAssembly = this.supporting_doc.substring(1,newParse); // this is one support doc
        //console.log ('newAssembly ' + '***' + newAssembly + '***');
        //this.docListNames.push($event.target.files[i].name);
        this.isMissingSupportDoc = false;
        this.docList.push({
          fullPath: newAssembly,
          justName: $event.target.files[i].name
        });
        
        //this.docList.push(newAssembly);

        
      }).catch(error => {
        //console.log("UploadDocument ", error.message);
      }); 

    }
 
  }

//Handle waiting to upload each file using promise
uploadImageAsPromise (imageFile, uploadUser) {

let aoa_number = uploadUser;
let self = this;

/*  IMMEDIATELY INVOKED FUNCTION IIFE (IFFY) 
  (function () {

    var steve = 'cool';

  }()); 
*/

  return new Promise(function (resolve, reject) {

    let docPath = aoa_number + '/' + imageFile.name;
    let fileRef = firebase.storage().ref(docPath);

      //Upload file with the firebase api
      var task = fileRef.put(imageFile);

      //Update progress bar
      task.on('state_changed',
          function progress(snapshot){
            var percentage = task.snapshot.bytesTransferred / task.snapshot.totalBytes * 100;
            this.loadProgress = percentage; 
             // ?? srk this.numFiles = 55;
            //console.log('this.loadProgress ' + this.loadProgress);
            self.displayProgress(this.loadProgress);
          },
          function error(err){
                reject(err);
          },
          function complete(){
              var downloadURL = task.snapshot.downloadURL;
              this.supporting_doc = this.supporting_doc + task.snapshot.downloadURL;
            //console.log('url ' + this.supporting_doc);
            resolve(downloadURL);
          }
      );
  });
} 

displayProgress(perc) {
  //console.log('perc ' + perc);
  this.loadProgress = perc;
}

  /**
   * Saves form data as newly added/edited record within Firebase Realtime
   * database and handles uploading of media asset to Firebase Storage
   *
   * @public
   * @method saveDocument
   * @param  val          {any}              Form data
   * @return {none}
   */
  saveDocument(val: any): void {

      console.log('in saveDocument');

      this.submitAttempt = true;

//      console.log("hours_approved1 " +  this.form.controls["hours_approved1"].value);
//      console.log("hours_approved2 " +  this.form.controls["hours_approved2"].value);
//      console.log("hours_approved3 " +  this.form.controls["hours_approved3"].value);

      /* console.log('date on enter: ' + this.form.controls["ce_date"].value);

      alert('date on enter: ' + this.form.controls["ce_date"].value); */

      // let ce_date: string = this.form.controls["ce_date"].value;


      let accreditor: string = this.form.controls["accreditor"].value;

      var hours1 = 0;
      var hours2 = 0;
      var hours3 = 0;
      var hours_approved1 = 0;
      var hours_approved2 = 0;
      var hours_approved3 = 0;

      let credit_type1: string = this.form.controls["credit_type1"].value;

      console.log('credit type 2 |' + this.form.controls["credit_type2"].value + '|');

      if (this.form.controls["credit_type2"].value !== undefined){
      this.credit_type2 = this.form.controls["credit_type2"].value;
      } else {this.credit_type2 = ""}

      if (this.form.controls["credit_type3"].value !== undefined){
        this.credit_type3 = this.form.controls["credit_type3"].value;
        } else {this.credit_type3 = ""}

       if (!isNaN(this.form.controls["hours1"].value)) {
//        console.log('1');
        hours1 =  parseFloat(this.form.controls["hours1"].value);
      }
      if (!isNaN(this.form.controls["hours2"].value)) {
//        console.log('2');
        hours2 =  parseFloat(this.form.controls["hours2"].value);
      }
      if (!isNaN(this.form.controls["hours3"].value)) {
//        console.log('3');
        hours3 =  parseFloat(this.form.controls["hours3"].value);
      }

      if (!isNaN(this.form.controls["hours_approved1"].value)) {
//        console.log('1a');
        hours_approved1 =  parseFloat(this.form.controls["hours_approved1"].value);
      }
      if (!isNaN(this.form.controls["hours_approved2"].value)) {
//        console.log('2a');
        hours_approved2 =  parseFloat(this.form.controls["hours_approved2"].value);
      }
      if (!isNaN(this.form.controls["hours_approved3"].value)) {
//        console.log('3a');
        hours_approved3 =  parseFloat(this.form.controls["hours_approved3"].value);
      }


      /* delivery_method: string = this.form.controls["delivery_method"].value, */
      let description: string = this.form.controls["description"].value;
      let supporting_doc: string = this.supporting_doc;
      //console.log('supporting doc insert: ' + supporting_doc);
      let approval: string = this.form.controls["approval"].value;
      let approval_reason: string = this.form.controls["approval_reason"].value;

      if (this.isAdmin){
        this.aoa_number = this.form.controls["aoa_number"].value;
      } else {
        approval = "Open";
        let checkID = this.cookieService.get('tokenFB_Num');
        if ( checkID ) {

          this.aoa_number = this.srk.decryptString(checkID);

        }
      }

    // EDIT EXISTING RECORD
    if (this.isEditable) {


//      console.log('is editable');
      //alert('is editable');

      //console.log('update checks - supporting doc: ' + supporting_doc + ' docList: ' + this.docList + 'supporting_doc_from_db: ' + this.supporting_doc_from_db);

      supporting_doc = supporting_doc + this.supporting_doc_from_db;

      // NOTE: AUDIT FIELDS BELOW ARE RE-CREATED WITH CURRENT DATA FOR UPDATES
      let getID = this.cookieService.get('tokenFB_Num');
      this.created_by = this.srk.decryptString(getID);

      this.created_by_process = "user"; // WHEN IMPORTED FROM GOOGLE SHEET, THIS IS SET AS 'system'

      this.date_created = new Date();

      let localtestCreate = this.date_created.toLocaleString();
      let date_created_local = new Date(localtestCreate.replace(/-/g, '\/'));

    //  alert('date created with slashe: ' + testDate);
 
      let temp_ce_date = this.ce_date.toLocaleString();
      let ce_date_localtime = new Date(temp_ce_date.replace(/-/g, '\/'));

     // alert('ce date with localtime: ' + ce_date_localtime);


      this._DB
        .updateDocument(this._COLL, this.docID, {
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
  })

        .then(data => {
          //this.clearForm();

let alert : any = this._ALERT.create({
title : 'Document Update',
subTitle : 'You have updated a record for user ' + this.aoa_number,
buttons : [{
text : 'Okay',
handler : () =>
{
  if (!this.isAdmin) {
//  this.HomePage();
  this.navCtrl.push('HomePage', { isDataGridReset : true }); 
  }
}
}
]
});
alert.present();
        })
        .catch(error => {
          this.displayAlert("Updating document failed", error.message);
        });
    }
    
// ADD NEW RECORD
if (!this.isEditable) {
    
      // else {
      // Otherwise we are adding a new record
      // Call the DatabaseProvider service and pass/format the data for use
      // with the addDocument method

/* console.log('in the isEditable');
console.log('this.form.valid ', this.form.valid);
console.log('this.isAdmin ', this.isAdmin); */

      let checkID = this.cookieService.get('tokenFB_Num');

      this.created_by = this.srk.decryptString(checkID);

      this.created_by_process = "user"; // WHEN IMPORTED FROM GOOGLE SHEET, THIS IS SET AS 'system'
      this.date_created = new Date();

      let localtestCreate = this.date_created.toLocaleString();
      let date_created_local = new Date(localtestCreate.replace(/-/g, '\/'));

    //  alert('date created with slashe: ' + testDate);
 
      let temp_ce_date = this.ce_date.toLocaleString();
      let ce_date_localtime = new Date(temp_ce_date.replace(/-/g, '\/'));


      if (this.form.valid) {
    //  } else {

        console.log('looks like should be an add doc');

        this._DB
          .addDocument(this._COLL, {
            ce_date: ce_date_localtime,
            date_entered: new Date(this.date_created),
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
            date_created: date_created_local // THIS DATE GETS UPDATED WHEN RECORD IS UPDATED - IS THE LAST UPDATED AUDIT DATE
          })
          .then(data => {
            this.clearForm();
            this.displayAlert(
              "Record Added",
              "Credits have been recorded and will be applied to the CME record upon approval by TOMA."
            );
            this.navCtrl.push('HomePage', { isDataGridReset : true }); //this.navCtrl.push(HomePage);
          })
          .catch(error => {
            this.displayAlert("Adding document failed", error.message);
          });
      }
      else {
        this.displayAlert("Form Incomplete", "Please complete the form (attachment not required)");
        
        }
  }
}

  /**
   * Provide feedback to user after an operation has succeeded/failed
   *
   * @public
   * @method displayAlert
   * @param  title          {String}           Heading for alert message
   * @param  message        {String}           Content for alert message
   * @return {none}
   */
  displayAlert(title: string, message: string): void {
    let alert: any = this._ALERT.create({
      title: title,
      subTitle: message,
      buttons: ["Got it!"]
    });
    alert.present();
  }

  HomePage() {
    //window.history.replaceState(null, null, window.location.pathname);
    //alert('calling manage docs HomePage');
    this.navCtrl.push('HomePage', { isDataGridReset : true });
    //resetDataGrid
    }

  OpenImage(imageUrl) {
  // alert('imageUrl: ' + imageUrl);
    window.open(imageUrl, 'supporting document', 'width=900,height=1100');
  }

  /**
   * Clear all form data
   *
   * @public
   * @method clearForm
   * @return {none}
   */
  clearForm(): void {
    this.ce_date = "";
    this.date_entered = "";
    this.accreditor = "";
    this.credit_type1 = "";
    this.hours1 = 0;
    this.hours_approved1 = 0;
    this.hours2 = 0;
    this.hours_approved2 = 0;
    this.hours3 = 0;
    this.hours_approved3 = 0;
    this.delivery_method = "";
    this.description = "";
    this.supporting_doc = "";
    this.approval = "";
    this.approval_reason = "";
    //this.aoa_number = "";
    this.docList = [];
    this.docListNames = [];
    this.numFiles = 0;
  }
}