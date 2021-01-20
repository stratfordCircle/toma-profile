//import { environment } from './../../environments/environment';
import { clientVars } from "./../../environments/environment";
import { Component } from "@angular/core";
import {
  NavController,
  ModalController,
  IonicPage,
  AlertController,
  NavParams,
  LoadingController
} from "ionic-angular";
import { DatabaseProvider } from "../../providers/database/database";
import { CmeProcessesProvider } from "../../providers/cme-processes/cme-processes";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Headers, Http, RequestOptions } from "@angular/http";
import { CookieService } from "ngx-cookie-service";
import { HelpPage } from "../help/help";
import { SrkServicesProvider } from "../../providers/srk-services/srk-services";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
import * as $ from "jquery";
import "datatables.net";

@IonicPage()
@Component({
  selector: "page-home",
  templateUrl: "home.html"
})

// TODO: CHANGE OUT ALL IMAGERY X
// TODO: SET UP NEW GOOGLE SHEET X
// TODO: POPULATE 9999999998 WITH ONE SAMPLE SET OF THE CONFERENCE RECORDS - EXPLAIN PROPOSED PROCESS X
// TODO: REVIEW WAYS TO SHRINK THIS APP -
// TODO: REVIEW OPTIONS FOR REMOVING REMAINING 'POMA' REFERENCES
// TODO: DEACTIVATE THE ATTACHMENT CRITERIA FOR MEMBER UPDATE?
// TODO: CREATE SEPARATE TOTALS FOR ME_1A X
// TODO: CAN MEMBERS MAKE THEIR OWN UPDATES?

// ------------- POST CONFERENCE TODOS ---------------------
// TODO: REMOVE THE DOCUMENT UPDATE NOTIFICATION - CHECK FOR THE ERROR CHECKING - MAKE SURE ALL IS GOOD
// TODO: ADD A DROP-DOWN FOR EACH RECORD ON THE HOME SCREEN - ATTENDED / NO SHOW - DEFAULT TO ATTENDED IF NOT CONFERENCE
// TODO: MOBILE VERSION - IMPROVE ON IPHONE - COULD NOT MINIMIZE ENOUGH TO SEE THE VIEW BUTTON - TRY TO ALLOW ALL ROW TO BE SELECTED?
export class HomePage {
  //_COLL 	: string 	= "TOMA CME Records" //"TOMA CME Records"; // USING ONE COLLECTION - EVERYTHING GOES IN HERE
  _COLL = clientVars.cycleCollection1; // MAY REMOVE THIS ALTOGETHER
  _DOC: string; // = "9999999999";  // SEED member_id - IF NEEDED, CAN EXCLUDE THIS IN REPORTS
  _CONTENT: any;
  totalCredits: number = 0;
  totals_1A: number = 0;
  totals_ME_1A: number = 0;
  totals_RM_1A: number = 0;
  //totals_OP : number = 0;
  openRecords: number = 0;
  totals_Other: number = 0;
  totals_All: number = 0;
  printOption: boolean = true; // when true, do not go into Print Format
  comingFromConference: boolean = false;
  locations: any;
  member_id: any;
  approvalSearch: String = "All";
  start_date: any;
  end_date: any;
  columns: any;
  adminRecordsNote: string;
  greeting: string = "";
  data: any;
  testingWrite: any;
  isAdmin: boolean = false;
  allowCertView: boolean = false;
  checkUserMB: boolean = false;
  checkUserFB: boolean = false;
  resultsExist: boolean = false;
  SearchString: string;
  entryPoint: string = "home";
  searchMemberForm: FormGroup;
  submitAttempt: boolean = false;
  testdata: any;
  greetingResponse: any;
  loading: any;
  modalHelp: any;
  de_enc_user: string;
  selected = [];
  app;
  ca_2018: boolean = false;
  pofps_2018: boolean = false;
  apiURL: string;
  cycleCollection: string;
  isNoConference: boolean = true;
  is63rdMidWinter: boolean = false;
  is64thMidWinter: boolean = false;
  isTOMA_12thAC: boolean = false
  tempTestCheck: boolean = false;
  steve: boolean = false;

  /*   this.tempTestCheck = this.srk.decryptString(this.cookieService.get('tokenFB_Num')); */

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public loadingCtrl: LoadingController,
    private _CME: CmeProcessesProvider,
    private _DBP: DatabaseProvider,
    private _ALERT: AlertController,
    public http: Http,
    private cookieService: CookieService,
    public _FB: FormBuilder,
    public modalCtrl: ModalController,
    public srk: SrkServicesProvider
  ) {
    if (params.get("isDataGridReset")) {
      this.resetDataGrid();
    }

    // IMPORTANT ON THE USER RESET ONLY
    this.apiURL = clientVars.apiURL;
    this.cycleCollection = clientVars.cycleCollection1;

    //      alert('cycle: ' + this.cycleCollection)

    /* this._CONTENT = {
      ce_date           : "01/01/2017",
      date_entered      : "01/02/2017",
      credit_type       : "1A",
      accreditor        : "TOMA",
      hours             : "0",
      delivery_method   : "delivery method",
      description       : "description",
      supporting_doc    : "support_doc_name",
      member_id         : "9999999999",
      aoa_number        : "9999999999",
      approval          : "Yes",
      approval_reason   : "example reason",
      created_by        : "9999999999",
      created_by_process: "user",
      date_created      : "01/01/2018" 
    }; */

    var de_enc_user = this.cookieService.get("tokenFB_Num"); // SET THIS TO MAKE SURE IT IS THERE
    var currentUser = this.srk.decryptString(de_enc_user);
    if (currentUser === '9999999999')
    {
      this.steve = true
    }


    this.searchMemberForm = _FB.group({
      member_id: ["", Validators.required],
      approvalSearch: ["", ""],
      start_date: ["", ""],
      end_date: ["", ""]
    });
  }

  ionViewDidEnter() {
    //this.getCertDisplayCheck('ca_2018','Clinical Assembly 2018');
    //console.log('this.ca_2018: ', this.ca_2018);
    var de_enc_user = this.cookieService.get("tokenFB_Num"); // SET THIS TO MAKE SURE IT IS THERE
    var currentUser = this.srk.decryptString(de_enc_user);
    if (currentUser === '9999999999')
    {
      this.steve = true
    }

    if (this.params.get("isDataGridReset")) {
      this.resetDataGrid();
    }

    if (this.cookieService.get("tokenTOMAAdmin")) {
      this.isAdmin = true;
      this.allowCertView = true;
    }
    if (this.cookieService.get("tokenFB_Num")) {
      // IF MEMBERCLICKS AUTHENTICATED
      this.checkUserMB = true;
    }
    if (this.cookieService.get("fireBase_login")) {
      // IF FIREBASE AUTHENTICATED
      this.checkUserFB = true;
    }

    if (this.checkUserMB && this.checkUserFB) {
      // IF FULLY AUTHENTICATED, JUST GET CME DATA
      console.log("greeting check 1");

      if (this.greeting === "" || this.greeting === undefined) {
        console.log("greeting check 2");

        this.srk.getProfileCookies().then(data => {
          this.de_enc_user = data[0].de_enc_user;
          if (this.de_enc_user === "9999999998") {
            this.tempTestCheck = true;
          }
          this.greeting = data[0].greeting;
          this.cookieService.set("cme_greeting", this.greeting, 0.02083333);

          //if (this.token_credential) {this.token_credential = ', ' + this.token_credential}
          /* this.token_first = data[0].firstName;
                this.token_last = data[0].lastName;
                this.token_middle = data[0].middleName;
                this.token_suffix = data[0].suffix;
                this.token_membertype = data[0].memberType;
                this.token_Num = data[0].aoa_num_enc; */
        });

        /* let suffix2 = this.cookieService.get('token_suffix');
            let token_first = this.cookieService.get('token_first');
            let token_last = this.cookieService.get('token_last');
            let token_membertype = this.cookieService.get('token_membertype');
            let token_Num = this.cookieService.get('tokenFB_Num');
            let entryCheck = this.cookieService.get('entryCheck'); */
        //let credential = this.data["0 - Name Credential"]

        // Promise.all([suffix2, token_first, token_last, token_membertype, token_Num, entryCheck]).then((values) => {

        /*  if (values[0] == 'D.O.')
              { */

        /*  var drTitle : boolean = false;
                if (values[0] == 'D.O.') {
                  drTitle = true;
                }

                this.greeting = "- ";

                if (drTitle) {
                  this.greeting = this.greeting + 'Dr. ';

                }
                this.greeting = this.greeting + values[2] + ', ' + values[0];

                this.cookieService.set('cme_greeting', this.greeting,  0.02083333);
 */

        /*  }  
              else
              {

                // values[4] is the AOA Number encrypted
                this.de_enc_user = this.srk.decryptString(values[4]);
               // console.log('decrypted: ', de_enc_user);

                this.greeting = values[1] + ' ' + values[2] + ' ' + this.de_enc_user  + ' - ' + 'Member Type: ' + values[3] ; //  + ' ' + MemberNumber;
              }  */

        // });
      }

      if (!this.isAdmin) {
        // REMOVE DEFAULT RETRIEVAL FOR ADMINS

        this.retrieveCollection();
      }
    } else {
      // srk console.log('not authenticated');

      this.loading = this.loadingCtrl.create({
        content: "Loading User profile..."
      });

      this.loading.present();

      if (this.cookieService.get("entryCheck") === "conference") {
        // "conference" is in the URL

        // THIS WORKS -
        // SET A VAR HERE THAT IS USED AFTER AUTHENTICATION TO ROUTE USER TO CONFERENCE PAGE IF THAT IS WHERE THEY CAME FROM
        // alert('HOME.TS - coming from conference - NOT AUTHENTICTED - SET COMINGFROMCONFERENCE');
        this.comingFromConference = true;
      }

      this.checkUserMB = this.authUserMB();

      // srk console.log('this.checkUserMB: ' + this.checkUserMB);
    }
  }

  /*     generateCollectionAndDocument() : void
   {
    this._DBP.createAndPopulateDocument(this._COLL, this._DOC, this._CONTENT)
      .then((data : any) =>
      {
         console.dir(data);
      })
      .catch((error : any) =>
      {
         console.dir(error);
      });
   } */

  /**
   * Retrieve all documents from the specified collection using the
   * getDocuments method of the DatabaseProvider service
   */
  retrieveCollection(): void {
    this.getCertDisplayCheck("mw_2019", "63rd MidWinter Conference");
    this.getCertDisplayCheck("ttac12", "TOMA/TXACOFP 12th Annual Convention");
    this.getCertDisplayCheck("mw_2020", "64th MidWinter Conference");

    //      this.getCertDisplayCheck('pofps_2018','POFPS 43rd Annual CME Symposium');

    //console.log('does the retrieve collection run after print select?');

    this.totalCredits = 0;
    this.totals_1A = 0;
    //this.totals_ME_1A = 0;
    /* this.totals_CA = 0; 
      this.totals_OP = 0;
       */ this.openRecords = 0;
    this.totals_Other = 0;
    this.printOption = true;
    // srk console.log('retrieve collection');

    let searchString: string = this.searchMemberForm.controls["member_id"]
      .value;
    let approvalSearchString: string = this.searchMemberForm.controls[
      "approvalSearch"
    ].value;
    // console.log('in retrievecollection approvalSearchString = ' + approvalSearchString);

    let start_date: string = this.searchMemberForm.controls["start_date"].value;
    // console.log('start date in retrievecollection ' + start_date + ' and this comes right from the control: ' + this.searchMemberForm.controls["start_date"].value);

    let end_date: string = this.searchMemberForm.controls["end_date"].value;
    // console.log('end date in search ' + end_date + ' and this comes right from the control: ' + this.searchMemberForm.controls["end_date"].value);

    this.loading = this.loadingCtrl.create({
      content: "Loading CME Records..."
    });

    this.loading.present();

    this._DBP
      .getDocuments(
        this._COLL,
        searchString,
        approvalSearchString,
        start_date,
        end_date
      )
      .then(data => {
        // srk  console.log('we came back from getting data');

        if (data.length == 0) {
          //alert('something is setting the resultsExist var');
          this.resultsExist = false;
          // srk   console.log('we came back from getting data but length is zero');
          this.checkUserFB = true;
          if (this.cookieService.get("tokenTOMAAdmin")) {
            // srk alert("There were no results for these criteria:\n AOA Number: " + searchString + "\n Admin Approval: " + approvalSearchString + "\n Start Date: " + start_date +  "\n End Date: " + end_date);
          } else {
            this.displayAlert(
              "No CME Records",
              "There are currently no CME records stored for this user.",
              false
            );
          }

          this.loading.dismiss();
          this.totalCredits = 0;
          this.locations = data;
        } else {
          console.log("we came back from getting data with records");

          console.log('where are the descriptions?')

          // CHECK IF THESE ARE COMING FROM A CONFERENCE

          this.resultsExist = true;
          this.checkUserFB = true;
          //this.checkUserFB = true; srk - still needed?
          this.locations = data; // THIS JUST LOADS UP THE RECORDSET SO THE HTML CAN DISPLAY IT
          this.loading.dismiss();

          // srk console.log('in home.ts retrievecollection');
          // console.log('All===> ' + JSON.stringify(data));
          // srk console.log('credits from object? ' + data[data.length-1].totalCredits);

          this.totalCredits = data[data.length - 1].totalCredits;
          this.totals_1A = data[data.length - 1].totals_1A;
          this.totals_ME_1A = data[data.length - 1].totals_ME_1A;
          this.totals_RM_1A = data[data.length - 1].totals_RM_1A;
          /* this.totals_CA = data[data.length-1].totals_CA;
          this.totals_OP = data[data.length-1].totals_OP; */
          this.openRecords = data[data.length - 1].openRecords;
          this.totals_Other = data[data.length - 1].totals_Other;

          console.log("this.openRecords " + this.openRecords);

          if (this.openRecords === 1) {
            this.adminRecordsNote = this.openRecords + " Record is ";
          } else {
            this.adminRecordsNote = this.openRecords + " Records are ";
          }
          this.adminRecordsNote = this.adminRecordsNote + "Open for Review";

          //let token_Num = this.cookieService.get('tokenFB_Num');

          // srk console.log('totals_CA ' + this.totals_CA);
          // srk console.log('isAdmin ' + this.isAdmin);

          /* console.log('this.allowCertView ' + this.allowCertView);

          if (this.totals_CA > 0) {
            this.allowCertView = true; // TEMPORARY SETTING TO SHOW CERT FOR ALL CA,  ALL BOARD, AND ALL ADMIN // WILL REMOVE THIS WHEN ALL USERS ARE GIVEN ACCESS
          } 
           

          if ((this.totals_CA === 0) && (!this.isAdmin) && (!this.boardList.has(token_Num))) {  // TEMPORARY SETTING TO SHOW CERT FOR ALL CA,  ALL BOARD, AND ALL ADMIN // WILL REMOVE THIS WHEN ALL USERS ARE GIVEN ACCESS
            console.log('is this a good enough way to check this? line 302');
            this.allowCertView = false;
          } */

          //    console.log('resultsExist: ' + this.resultsExist);

          //if (this.resultsExist) { // NOT NEEDED - CAN DELETE ALL REFERENCES TO resultsExist

          let self = this;

          //alert("admin" + this.isAdmin);

          if (this.isAdmin) {
            //console.log('yes admin');
            $(document).ready(function() {
              //console.log('yest doc ready');
              //console.log('data ' + data);
              var cmeTable = $("#example").DataTable({
                select: "single",
                data: data,
                pageLength: 25,
                destroy: true,
                order: [[0, "desc"]],
                columns: [
                  { data: "ce_date" },
                  { data: "aoa_number" },
                  { data: "description" },
                  { data: "accreditor" },
                  { data: "hours_total" },
                  { data: "credit_multi" },
                  { data: "approval" },
                  { data: "doc_exists" },
                  {
                    class: "dt-delete",
                    orderable: false,
                    data: null,
                    defaultContent: "<button>Delete</button>"
                  },
                  {
                    class: "dt-view",
                    orderable: false,
                    data: null,
                    defaultContent: "<button>View</button>"
                  }
                ],
                initComplete: function() {
                  $("#example tbody")
                    .off()
                    .on("click", "tr td.dt-view", function(e) {
                      //  cmeTable.off( 'click', 'tr td.dt-view' );
                      e.preventDefault();
                      const clickedElement = $(e.target);
                      var tr = clickedElement.closest("tr");
                      var row = cmeTable.row(tr);
                      var record = row.data();

                      self.updateDocument(record);
                    });

                  $("#example tbody").on("click", "tr td.dt-delete", function(
                    e
                  ) {
                    e.preventDefault();
                    const clickedElement = $(e.target);
                    var tr = clickedElement.closest("tr");
                    var row = cmeTable.row(tr);
                    var record = row.data();
                    self.deleteDocument(record);
                  });
                }
              });
            });
          } // CHECK FOR ADMIN

          if (!this.isAdmin) {
            $(document).ready(function() {
              //let testMulti = 'test' + this.credit_type1;

              var cmeTable = $("#example").DataTable({
                select: "single",
                data: data,
                pageLength: 25,
                destroy: true,
                order: [[0, "desc"]],
                columns: [
                  { data: "ce_date" },
                  { data: "aoa_number" },
                  { data: "description" },
                  { data: "accreditor" },
                  { data: "hours_total" },
                  { data: "credit_multi" },
                  { data: "approval" },
                  { data: "doc_exists" },
                  {
                    class: "dt-view",
                    orderable: false,
                    data: null,
                    defaultContent: "<button>View</button>"
                  }
                ],

                initComplete: function() {
                  $("#example tbody")
                    .off()
                    .on("click", "tr td.dt-view", function(e) {
                      //  cmeTable.off( 'click', 'tr td.dt-view' );
                      e.preventDefault();
                      const clickedElement = $(e.target);
                      var tr = clickedElement.closest("tr");
                      var row = cmeTable.row(tr);
                      var record = row.data();

                      self.updateDocument(record);
                    });
                }
              });
            });
          } // CHECK FOR NOT ADMIN
        }
      })
      .catch((error: any) => {
        console.log("data error", error.message);
        this.displayAlert("Data Error", error.message, false);
      });
  }

  /*    addDocument() : void
   {
      this.navCtrl.push('conference');
   } */

  /*    flipCollection() { // can be used to go between cycles in the future
     if (this._COLL === "TOMA CME Records")
     {
       this._COLL = "Clinical Assembly 2018";
     } else 
     {
        this._COLL = "TOMA CME Records";
     }
   } */

  updateDocument(obj): void {
    let params: any = {
      collection: this._COLL,
      location: obj
    };
    //alert('calling update - how many times?');
    this.navCtrl.push("manage-document", { record: params, isEdited: true });
  }

  deleteDocument(obj): void {
    this._DBP
      .deleteDocument(this._COLL, obj.id)
      .then((data: any) => {
        this.displayAlert(
          "Success",
          "The record " +
            obj.credit_type +
            " " +
            obj.accreditor +
            " was successfully removed",
          true
        );
      })
      .catch((error: any) => {
        this.displayAlert("Error", error.message, false);
      });
    let alert: any = this._ALERT.create({
      title: "Confirm Deletion?",
      subTitle: "Deleting CME Record",
      buttons: [
        {
          text: "Delete Record",
          handler: () => {
            this._DBP
              .deleteDocument(this._COLL, obj.id)
              .then((data: any) => {
                this.displayAlertDelete(
                  "Success",
                  "The record " +
                    obj.credit_type +
                    " " +
                    obj.accreditor +
                    " was successfully removed",
                  true
                );
              })
              .catch((error: any) => {
                this.displayAlert("Error", error.message, false);
              });
          }
        },
        {
          text: "Cancel Deletion",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        }
      ]
    });
    alert.present();
  }

  displayAlertDelete(title: string, message: string, retrieve: boolean): void {
    let alert: any = this._ALERT.create({
      title: title,
      subTitle: message
    });
    //    alert.present();
  }

  displayAlert(title: string, message: string, retrieve: boolean): void {
    let alert: any = this._ALERT.create({
      title: title,
      subTitle: message,
      buttons: [
        {
          text: "Got It!",
          handler: () => {
            if (retrieve) {
              this.retrieveCollection();
            }
          }
        }
      ]
    });
    alert.present();
  }

  setConferenceCollection(e) {
    if (e === "") {
      this.isNoConference = true;
      this.is63rdMidWinter = false;
      this.isTOMA_12thAC = false;
      this.is64thMidWinter = false;
    }
    if (e === "63rd MidWinter Conference") {
      this.isNoConference = false;
      this.is63rdMidWinter = true;
      this.isTOMA_12thAC = false;
      this.is64thMidWinter = false;
    }
    if (e === "TOMA/TXACOFP 12th Annual Convention") {
      this.isNoConference = false;
      this.is63rdMidWinter = false;
      this.isTOMA_12thAC = true;
      this.is64thMidWinter = false;
    }
    if (e === "64th MidWinter Conference") {
      this.isNoConference = false;
      this.is63rdMidWinter = false;
      this.isTOMA_12thAC = false;
      this.is64thMidWinter = true;
    }


    

    this.cookieService.set("conferenceCollectionCookie", e, 0.02083333);
    //this.cycleCollection = e

    this.retrieveCollection();

    /*       if (!this.isAdmin) {
      this.retrieveCollection()
      } */
  }

  setCurrentUser() {
    var testUser = (<HTMLInputElement>(
      document.getElementById("currentUserField")
    )).value;

    //    var testUser = document.getElementById("currentUserField").value;

    this.cookieService.set("certTestUser", testUser, 0.02083333);
    //let certTestUser = this.cookieService.get('certTestUser');

    /* Promise.all([certTestUser]).then((values) => {
       
      this.allowCertView = true;
      alert('Certificate User changed to: ' + certTestUser);

    }); */
  }

  authUserMB(): boolean {
    // IF USER IS NOT LOGGED IN

    // GET URL VAR FOR ACCESS TOKEN
    let myParam = location;
    let stringUrl = myParam.toString();
    let token = "none";

    if (stringUrl.split("access_token=")[1]) {
      //(validUser == "none" && )
      // IF URL STRING EXISTS, SET IT TO TOKEN AND SET VALID COOKIE for 30 minutes
      let finallyParse = stringUrl.split("access_token=")[1];
      token = finallyParse.split("&")[0];
      console.log("token after query string check: " + token);
      this.cookieService.set("tokenTOMACookie", token, 0.02083333);
    }

    //      console.log('token: ' + token);

    if (token === undefined || token == "" || token == "none") {
      // IF WE GET JUNK FROM THE URL
      token = "none";
      //alert('?');
      this.displayAlert("Renewing Session", "Attempting Log in...", false);

      // PRODUCTION
      //   window.location.assign("https://teoma.memberclicks.net/oauth/v1/authorize?response_type=token&client_id=2zmDM0ch997q0vAjSB3t&scope=read&redirect_uri=https://cme.TOMA.org");

      // DEVELOPMENT
      //   window.location.assign("https://teoma.memberclicks.net/oauth/v1/authorize?response_type=token&client_id=2zmDM0ch997q0vAjSB3t&scope=read&redirect_uri=https://TOMA-cme-dev.firebaseapp.com");

      // LOCAL
      // console.log('apiURL:',this.apiURL);
      window.location.assign(this.apiURL); //https://teoma.memberclicks.net/oauth/v1/authorize?response_type=token&client_id=2zmDM0ch997q0vAjSB3t&scope=read&redirect_uri=http://localhost:8100
    }

    if (token != "none") {
      window.history.replaceState(null, null, window.location.pathname);

      let TOMAHeaders = new Headers();
      TOMAHeaders.set("Accept", "application/json");
      TOMAHeaders.append("Content-Type", "application/json");
      TOMAHeaders.append("Authorization", "Bearer " + token);

      let options = new RequestOptions({
        headers: TOMAHeaders
      });

      /*       TOMA
      id o4BDKQrdnCfcgFuwt5tc	
      secret 6a61154e6bc44721a4dffe15bfcee471 */

      // ONLY NEED TO CHANGE THIS FUNCTION LOCATION IF TESTING THE FUNCTION CODE
      //this.http.get('http://localhost:8100/api/v1/profile/me', options) // optional proxy server if running the get locally, directly against the API, without going to the Google function for this project

      this.http
        .get(
          "https://us-central1-toma-cme.cloudfunctions.net/app/memberclicks",
          options
        ) // SERVER CALL
        .map(res => res.json()) // Instead of getting the _body manually, you can use the map method from RxJS
        .subscribe(
          data => {
            this.data = data;

            //alert('coming back');

            console.log("All===> " + JSON.stringify(data));

            this.testingWrite = JSON.stringify(data);

            //srk  console.log('dump:' + this.testingWrite);

            let lastName = this.data["[Name | Last]"];
            let firstName = this.data["[Name | First]"];
            let middleName = this.data["[Name | Middle]"];
            let suffix = this.data["[Name | Suffix]"];
            let memberType = this.data["[Member Type]"];

            let emailFromAMS = this.data["[Email | Primary]"]

            var credential

            //TODO: DETERMINE FULL NAME FORMAT WITH PREFIX, ETC
            if (this.data["02 - Designation"]) {
            credential = this.data["02 - Designation"]
            } else {
            credential = ''
            }
            //TODO: SET PROPER FIREBASE PERMISSIONS

            //TODO: STEPS FOR SETTING THIS UP?

            // alert('credential: ' + credential);

            // CAN CHANGE THE AOA NUMBER HERE TO IMITATE A MEMBER
            // 57277 - Dr. Battistella
            // Dr. Battistella - profile id - 1003780062
            // my profile id - 1003682710
            // let AOA_Number = '57277';
            // let p_id = '1003780062';

            // TODO: CHANGE IN POMA INSTANCE
            var AOA_Number = this.data["13 - AOA No."];
            console.log("coming in as: " + AOA_Number);

            // review potential security issues here with the cookie id
            if (AOA_Number.charAt(0) === "0") {
              console.log("coming in as: " + AOA_Number);
              AOA_Number = AOA_Number.substring(1);
              console.log("changing to: " + AOA_Number);

              if (AOA_Number.charAt(0) === "0") {
                console.log("coming in as: " + AOA_Number);
                AOA_Number = AOA_Number.substring(1);
                console.log("changing to: " + AOA_Number);
              }
            }

            // srk console.log('Num is: ' + AOA_Number);

            var enc_user = this.srk.encryptString(AOA_Number);

            /*       var str = 'some string';
      console.log(str.charAt(0)); 
      if first char is zero use substring starting at 1
      var res = str.substring(1);
 */

            let p_id = this.data["[Profile ID]"];

            this.cookieService.set("token_last", lastName, 0.02083333)
            this.cookieService.set("token_first", firstName, 0.02083333)
            this.cookieService.set("token_middle", middleName, 0.02083333)
            this.cookieService.set("token_suffix", suffix, 0.02083333)
            this.cookieService.set("token_membertype", memberType, 0.02083333)
            this.cookieService.set("token_credential", credential,  0.02083333)
            this.cookieService.set("token_email", emailFromAMS,  0.02083333)


            // CREATE ID COOKIE #1 - AOA NUMBER
            if (AOA_Number != "") {
              // srk  console.log('AOA_Number inside block: ' + AOA_Number);

              /* let boardList = new Set();
        boardList.add('555');
        boardList.add('444');
        boardList.add('9999999998'); */

              /*         if (this.boardList.has(AOA_Number)) {

          console.log('yes, the user is in the list: ', AOA_Number);
          this.allowCertView = true;

        }
 */
              // let's 'encrypt' the AOA_Number

              /*      var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123');
        console.log('encrypted: ' + ciphertext); */

              /*         var ciphertext = AES.encrypt('my message', 'secret key 123');
        
        var message_ciphertext = AES.encrypt(ciphertext.toString(), 'secret key 123');
        console.log('decrypted: ' + message_ciphertext);  */

              //var encrypted_AOA_Number = AOA_Number * 44;

              //this.cookieService.set('tokenFB_Num', encrypted_AOA_Number, 0.02083333);

              this.cookieService.set("tokenFB_Num", enc_user, 0.02083333);

              this.checkUserMB = true; // FOR HTML NGIF STATEMENTS - INDICATES USER IS LOGGED INTO MEMBERCLICKS BUT NOT NECESSARILY FIREBASE
            } else {
              this.displayAlert(
                "CME Connection Refused",
                "You must have an AOA Number to use this application",
                false
              );
            }
            // CREATE ID COOKIE #2 - MEMBERCLICKS ID

            if (p_id != "") {
              //s      console.log('p_id inside block: ' + p_id);
              this.cookieService.set("p_id", p_id, 0.02083333);
            }
            // CREATE ADMIN COOKIE, IF ADMIN
            if (memberType == "Admin") {
              this.isAdmin = true;
              this.cookieService.set("tokenTOMAAdmin", "exists", 0.02083333);
            }

            //s    console.log('greeting before block:' + this.greeting);
            if (this.greeting === "" || this.greeting === undefined) {
              this.srk.getProfileCookies().then(data => {
                this.de_enc_user = data[0].de_enc_user;
                this.greeting = data[0].greeting;

                //if (this.token_credential) {this.token_credential = ', ' + this.token_credential}
                /* this.token_first = data[0].firstName;
          this.token_last = data[0].lastName;
          this.token_middle = data[0].middleName;
          this.token_suffix = data[0].suffix;
          this.token_membertype = data[0].memberType;
          this.token_Num = data[0].aoa_num_enc; */
              });

              window.history.replaceState(null, null, window.location.pathname);

              /*   this.srk.getProfileCookies().then((data) => {
        this.token_credential = data[0].credential;
        //if (this.token_credential) {this.token_credential = ', ' + this.token_credential}
        this.token_first = data[0].firstName;
        this.token_last = data[0].lastName;
        this.token_middle = data[0].middleName;
        this.token_suffix = data[0].suffix;
        this.token_membertype = data[0].memberType;
        this.token_Num = data[0].aoa_num_enc;

      });
 */
              //    console.log('in check greeting block');
              /*  let suffix2 = this.cookieService.get('token_suffix');
      let token_first = this.cookieService.get('token_first');
      let token_last = this.cookieService.get('token_last');
      let token_membertype = this.cookieService.get('token_membertype');
      let token_Num = this.cookieService.get('tokenFB_Num');

      Promise.all([suffix2, token_first, token_last, token_membertype, token_Num]).then((values) => {
       
         if (values[0] == 'D.O.')
         {
//           console.log('greeting 1' + values[0]);
           this.greeting = "Greetings Dr. " + values[2] + ',';
//           console.log('greeting assigned ' + this.greeting);
           this.cookieService.set('cme_greeting', this.greeting,  0.02083333);
         }  
         else
         {
//         console.log('greeting 2' + values[1]);

           this.de_enc_user = this.srk.decryptString(values[4]);

           this.greeting = values[1] + ' ' + values[2] + ' ' + this.de_enc_user  + ' - ' + 'Member Type: ' + values[3] ; //  + ' ' + MemberNumber;
           //this.cookieService.set('cme_greeting', this.greeting,  0.02083333);
           window.history.replaceState(null, null, window.location.pathname);
         }  

        }); */
            }

            // WRONG OR ONCE AUTHENTICATED WITH FB, WE ASSUME MB MUST BE TRUE?
            this._CME
              .loginFB()
              .then((data: any) => {
                this.checkUserMB = true;
                /* if (this.comingFromConference){
          this.navCtrl.push('ConferencePage');
        } */
                console.dir(
                  "okay from login - SHOULD SET CHECKUSERMB: " + data
                );
                this.loading.dismiss();
                if (!this.isAdmin) {
                  this.retrieveCollection();
                }
              })
              .catch((error: any) => {
                console.dir("error from LOGIN: " + error); //Cannot read property 'dismiss' of undefined
                this._CME
                  .registerFB()
                  .then((data: any) => {
                    this.checkUserMB = true;
                    /*         if (this.comingFromConference){
          this.navCtrl.push('ConferencePage');
        } */
                    console.dir("okay from register: " + data);
                    /* if (!this.greeting){
          greetingResponse = this._CME.getGreeting();
        } */
                    this.loading.dismiss();
                    if (!this.isAdmin) {
                      this.retrieveCollection();
                    }
                  })
                  .catch((error: any) => {
                    console.dir("error from register: " + error);
                    this.displayAlert(
                      "Unable to register with Firebase",
                      error,
                      false
                    );
                  });
              });
          },
          error => {
            console.log("error: " + error.code);
            this.displayAlert(
              "CME Connection Refused",
              "Currently unable to connect to MemberClicks API",
              false
            );
            return false;
          }
        );
      return true;
    } //  END OF CHECK FOR TOKEN if (token != "none")
  }

  exportDatabase() {
    // USE THE SAME SEARCH FILTERS AS CREATING CURRENT VIEW
    let searchString: string = this.searchMemberForm.controls["member_id"]
      .value;

    /*     console.log('searchString from exportDatabase',searchString);

    if (searchString === undefined){
      searchString = "Administrator";
    } */

    let approvalSearchString: string = this.searchMemberForm.controls[
      "approvalSearch"
    ].value;

    let start_date: string = this.searchMemberForm.controls["start_date"].value;
    if (start_date === undefined) {
      start_date = "All";
    }

    //s    console.log('start date in export ' + start_date + ' and this comes right from the control: ' + this.searchMemberForm.controls["start_date"].value);

    let end_date: string = this.searchMemberForm.controls["end_date"].value;
    if (end_date === undefined) {
      end_date = "All";
    }

    this._CME.exportDBtoFile(
      this._COLL,
      searchString,
      approvalSearchString,
      start_date,
      end_date
    );
  }

  runBackUpBatches() {
    this._CME.runBackUpBatches(this._COLL);
  }

  printPage() {
    //    console.log('this.printOption on way in after print: ' + this.printOption);
    if (this.printOption) {
      this.printOption = false;
      console.log("this.printOption: " + this.printOption);

      let alert: any = this._ALERT.create({
        title: "Print Report?",
        subTitle: "",
        buttons: [
          {
            text: "Yes",
            handler: () => {
              setTimeout(() => {
                window.print();
              }, 1000); //srk
            }
          },
          {
            text: "No",
            role: "cancel",
            handler: () => {
              this.refreshPage();
            }
          }
        ]
      });
      alert.present();
    }
  }

  largerHelp() {
    this.modalCtrl.create(HelpPage).present();
  }

  printWithFalse() {
    window.print();
  }

  addDocument(): void {
    this.navCtrl.push("manage-document");
  }

  changePage(buttonChangePage) {
    this.navCtrl.push(buttonChangePage);
  }

  certificatePage() {
    // alert('conf name: ' + conferenceName);
    /* this.navCtrl.push('ConferencePage', {
      param1: conferenceName
    }); */
    this.navCtrl.push("CertificateListPage");
  }

  attestPage(e) {
    this.navCtrl.push("AttestPage", { conferenceNameString : e });
  }

  refreshPage() {
    //alert('this.resultsExist ' + this.resultsExist );
    this.printOption = true;
    this.navCtrl.push(HomePage);
  }

  resetDataGrid() {
    //alert('in reset Grid');
    window.history.replaceState(null, null, window.location.pathname);
    location.reload();
  }

  // DOES ALL THIS CODE NEED TO BE CALLED from a local function? // seems like one too many calls

  insertFirebasefromGoogleSheets() {
    this._CME.importFirebasefromGoogleSheets();
  }

  insertFirebaseAttestationRecordsfromGoogleSheets() {
    this._CME.convertAttestationSheets();
  }

  insertFirebasePOFPSattestationRecordsfromGoogleSheets() {
    this._CME.convertPOFPSattestationSheets();
  }

  updateFirebasefromGoogleSheets() {
    this._CME.updateFirebasefromGoogleSheets();
  }

  logoutfromCMETracker() {
    //this.navCtrl.push(ContactPage);
    this.cookieService.deleteAll();
    //window.history.replaceState(null, null, window.location.pathname);
    //this.navCtrl.push(HomePage);
    // THIS IS A FIX BECAUSE THE URL WAS PUBLISHED TO MEMBERS AS THE ENTRY POINT RATHER THAN THE MEMBERCLICKS MENU ITEM
    location.href = "https://teoma.memberclicks.net";
    window.close();
  }

  triggerTestError() {
    // this.app.monitoring.exception(new Error('Error triggered from button'));
  }

  indexTest()
  { 

var updateList = "025983,027881,028540,028588,028920,028984,029089,029173,029722,029988,030017,030294,032097,032214,032452,032679,032963,033093,033129,033872,033881,034716,035393,035399,035431,035992,036357,037325,037957,037963,037964,037994,038143,038469,038473,038666,039657,039808,040114,040213,040214,040256,040442,040631,041000,041931,042164,042289,042544,043607,044752,044758,044761,044765,044766,044767,044809,046396,046748,047308,048221,048801,051587,051614,054954,056596,058275,058285,059952,060753,061061,061837,062084,062137,065223,067054,070438,071099,073097,084853,085188,0161401,0166033,0166049,0178171"

var oneNum = "9999999998"

var ttt = updateList.indexOf(oneNum)
console.log('ttt: ', ttt)

if (updateList.indexOf(oneNum) > 0) {

 console.log('updateList: ' + 'found it')

}

  }


  getCertDisplayCheck(certVarName, certFullName) {
    console.log("certVarName", certVarName);
    console.log("getCertDisplayCheck", certFullName);
    console.log("this.de_enc_user", this.de_enc_user);

    //    var attendedConference = false;

    this.srk
      .certDisplayCheck(this._COLL, certFullName) // change back to this.de_enc_user
      .then((data: any) => {
        this[certVarName] = data; // CREATES DYNAMIC VARIABLE NAME FROM certVarName passed in
      })
      .catch((error: any) => {
        console.log("data error", error.message);
        this.displayAlert("Data Error", error.message, false);
      });
  }
}
