import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

// We MUST import both the firebase AND firestore modules like so
import * as firebase from 'firebase';
import 'firebase/firestore';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';
import { SrkServicesProvider } from '../srk-services/srk-services';
import { resolve } from 'url';

/* createAndPopulateDocument
getDocuments
addDocument
deleteDocument
updateDocument 
srk
*/



@Injectable()
export class DatabaseProvider {

    totalCredits : number = 0;
    totalCreditsPerRecord : number = 0;
    totalCreditsPerRecordApproved : number = 0;
    openRecords : number = 0;
    totals_1A : number = 0;
    totals_ME_1A : number = 0;
    totals_RM_1A : number = 0;
    totals_CA : number = 0;
    totals_OP : number = 0;
    totals_All : number = 0;
    totals_Other : number = 0;
    searchCriteria : string = "";
    lastVisible : any = [];

   private _DB : any;

   constructor(public http: Http, 
    private cookieService: CookieService, 
    public datepipe: DatePipe, 
    public srk: SrkServicesProvider) //private storage: Storage, 
   {
      this._DB = firebase.firestore();
      const settings = { timestampsInSnapshots: true }; //FIREBASE MADE A CHANGE TO READ TIMESTAMPS AS TIMESTAMPS INSTEAD OF AS SYSTEM DATE OBJECTS - THESE TWO LINES FORCE THE READ AS A TIMESTAMP TO PREPARE FOR THAT CHANGE WHEN FIREBASE IMPLEMENTS IT OR ELSE IT WOULD BE A BREAKING CHANGE
      this._DB.settings(settings);
   }
        
/* 
   FOR FIREBASE CHANGE - 
   constructor(public http: Http, 
    private cookieService: CookieService, 
    public datepipe: DatePipe, 
    public srk: SrkServicesProvider) //private storage: Storage, 
   {
      this._DB = firebase.firestore();
      const settings = { timestampsInSnapshots: true };
      this._DB.settings(settings);
   }
       
   FROM 
   [2018-08-22T17:06:49.036Z]  @firebase/firestore: Firestore (4.13.0): 
The behavior for Date objects stored in Firestore is going to change
AND YOUR APP MAY BREAK.
To hide this warning and ensure your app does not break, you need to add the
following code to your app before calling any other Cloud Firestore methods:

  const firestore = firebase.firestore();
  const settings = {/ your settings... / timestampsInSnapshots: true};
  firestore.settings(settings);

With this change, timestamps stored in Cloud Firestore will be read back as
Firebase Timestamp objects instead of as system Date objects. So you will also
need to update code expecting a Date to instead expect a Timestamp. For example:

  // Old:
  const date = snapshot.get('created_at');
  // New:
  const timestamp = snapshot.get('created_at');
  const date = timestamp.toDate();

Please audit all existing usages of Date when you enable the new behavior. In a
future release, the behavior will change to the new behavior, so if you do not
follow these steps, YOUR APP MAY BREAK. */

  /** Create the database collection and defines an initial document
    * Note the use of merge : true flag within the returned promise  - this
    * is needed to ensure that the collection is not repeatedly recreated should
    * this method be called again (we DON'T want to overwrite our documents!)
    *
    * @public
    * @method createAndPopulateDocument
    * @param  collectionObj    {String}           The database collection we want to create
    * @param  docID            {String}           The document ID
    * @param  dataObj          {Any}              The document key/values to be added
    * @return {Promise}
    */

    createAndPopulateDocument(collectionObj : string,
                             docID         : string,
                             dataObj       : any) : Promise<any>
   {
      return new Promise((resolve, reject) =>
      {
         this._DB
         .collection(collectionObj)
         .doc(docID)
         .set(dataObj, { merge: true })
         .then((data : any) =>
         {
            resolve(data);
         })
         .catch((error : any) =>
         {
            reject(error);
         });
      });
   }

  getDocsLength(collectionObj) {
   
    return new Promise((resolve, reject) =>
    this._DB.collection(collectionObj)
    .get().then((documentSnapshots) => { 
      let obj : any = []; // STORE RETRIEVED DOCUMENTS
       var docsLength = documentSnapshots.docs.length
       obj.push({
        numRecords : docsLength
       })
       resolve(obj)
   }
    )
    )

  }

runBackUpBatches(collectionObj) {
  
  var fileText: string = "";
  var fileName = "cmeExportssrk.csv";
  let fullFile: any = [];
  var indexQuery
  var totalRecordsCounter: number = 0;

          for(let i = 0; i <= 4; i++){
            console.log('PROMISE RETURNED?')
             return new Promise((resolve, reject) =>
            { 
            if (i === 0){
           
// SRK ALL OF THE COLLECTIONS ARE BEING CREATED BEFORE THE FIRST ONE IS COMPLETELY READ AND DOWNLOADED
// CAN ALSO CALL THIS FUNCTION INSIDE OF A PROMISE IN CME-PROCESSES?
// CAN BUILD THE ARRAY THEN BATCH THE OUTPUT
// MAYBE WRAP THIS IN A PROMISE AS IN GETDOCSLENGTH THEN CALL IT WITHIN A LOOP - SHOULD ONLY RETURN EACH TIME IT IS FINISHED?

           console.log("FIRST TIME")   
           indexQuery = this._DB.collection(collectionObj)
           .where("aoa_number", "==", '9999999998') 
           .orderBy("accreditor")
           //.startAt(this.lastVisible)
           .limit(100)
            } 
            else 
            {
              console.log("NEW LASTVISIBLE")
              indexQuery = this._DB.collection(collectionObj)
              .where("aoa_number", "==", '9999999998') 
              .orderBy("accreditor")
              .startAfter(this.lastVisible)
              .limit(100)
   
            }

           indexQuery
           .get().then((documentSnapshots) => { 

            fileText =
            "CE Date" + ', '
            "Last Updated" + ', ' +
            "description" + ', ' +
            '\n';

            console.log("Batch Query: " + i);
            let obj : any = []; // STORE RETRIEVED DOCUMENTS
            documentSnapshots
            .forEach(element =>
            {
              
            totalRecordsCounter++  
            console.log('doc.data().description:' + element.data().description);
 
            var formatted_ce_date = this.datepipe.transform(element.ce_date, 'yyyy-MM-dd');
            //  let formatted_date_entered = this.datepipe.transform(element.date_entered, 'yyyy-MM-dd');
            var formatted_date_created = this.datepipe.transform(element.date_created, 'yyyy-MM-dd');
            var description = element.data().description
            
            var id = element.id

            fileText = fileText +
            formatted_ce_date + ',' +
            description + ',' +
            id +
            //            formatted_date_created
            '\n';

          fullFile.push({
            fileText
          });
              
            })

            console.log('documentSnapshots.docs.length-1', documentSnapshots.docs.length-1)
            this.lastVisible = documentSnapshots.docs[99];
            console.log('lastVisible:' + totalRecordsCounter +'/' + this.lastVisible) 
            console.log('does this print after each batch?')
            this.saveTextAsFile(fileText, fileName);
            
          })
          resolve()
        })
        }
          
/*             var nextIndexQuery = this._DB.collection(collectionObj)
            //.orderBy("aoa_number")
            .startAt(lastVisible)
            .limit(10)
            .get().then((documentSnapshots2) => { 

              let obj : any = []; // STORE RETRIEVED DOCUMENTS
              documentSnapshots2
              .forEach((doc : any) =>
              {
                console.log("second batch query");
                console.log('doc.data().description:' + doc.data().description);
                
              })

           }) */
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

  /** Return documents from specific database collection
    * @public
    * @method getDocuments
    * @param  collectionObj    {String}           The database collection we want to retrieve records from
    * @return {Promise}
    */

    getDocuments(collectionObj : string, searchCriteria : string, approvalSearchCriteria: string, start_date: string, end_date: string) : Promise<any>
   { 

// HOW ARE WE GETTING RESULTS WITHOUT EVER GETTING IN HERE?

//alert('tt')

    console.log('*** export criteria ***')
    console.log('collectionObj ',collectionObj)
    console.log('searchCriteria ',searchCriteria)
    console.log('approvalSearchCriteria ' + '|' +  approvalSearchCriteria + '|')
    console.log('start_date ',start_date)
    console.log('end_date ',end_date)

    return new Promise((resolve, reject) =>
      {           

        let query = this._DB.collection(collectionObj);

          if (start_date === undefined || start_date == "All" || start_date == "" || !start_date) 
          {    }
          else {
          //let newStart_date =  new Date(start_date); // newStart_date =  new Date(newStart_date.getTime() - (3600000));

            let temp_start_date = start_date.toLocaleString();
            let ce_startdate_localtime = new Date(temp_start_date.replace(/-/g, '\/'));
            ce_startdate_localtime.setSeconds( ce_startdate_localtime.getSeconds() -1);
            console.log('ce_date_localtime - start date ', ce_startdate_localtime);

          query = query.where("ce_date", ">", ce_startdate_localtime); //new Date(newStart_date));
          }

          if (end_date === undefined || end_date == "All" || end_date == "" || !end_date)
          {    }
          else {

            let temp_end_date = end_date.toLocaleString();
            let ce_enddate_localtime = new Date(temp_end_date.replace(/-/g, '\/'));
            ce_enddate_localtime.setSeconds( ce_enddate_localtime.getSeconds() +86399);
            console.log('ce_date_localtime - end date ', ce_enddate_localtime);


          //let newEnd_date =  new Date(end_date); // newEnd_date =  new Date(newEnd_date.getTime() + (3600000));
          query = query.where("ce_date", "<", ce_enddate_localtime);

          }
          
          // IF NO SEARCH CRITERIA AND USER IS NOT AN ADMIN, THEN DEFAULT SEARCH TO CURRENT MEMBER ID
          // IF NO SEARCH CRITERIA AND USER IS AN ADMIN, THEN LEAVE OUT THIS PART OF THE QUERY STRING
          //|| searchCriteria == "adminUser" || !searchCriteria

          if (searchCriteria === undefined || searchCriteria === "" || !searchCriteria ){ //IF NO SEARCH CRITERIA, CHECK IF ADMIN  

            console.log('no search criteria which is fine')
              let cookieCheck = this.cookieService.get('tokenTOMAAdmin');
              
              if (!cookieCheck)  { // IF NOT ADMIN, SEARCH ON CURRENT MEMBER ID ONLY
                console.log('should not get in here: 1')
                var enc_user = this.cookieService.get('tokenFB_Num');      
                searchCriteria = this.srk.decryptString(enc_user);

               console.log('no admin cookie - but is there a user cookie yet?' + searchCriteria);
                query = query.where("aoa_number", "==", searchCriteria);
              } else { // ADMIN WITH NO SEARCH CRITERIA
  //s              console.log('admin with no search criteria');
                console.log('ADMIN WITH NO SEARCH CRITERIA')
              }

             } 
            else { // IF SEARCH CRITERIA, MUST BE AN ADMIN
              query = query.where("aoa_number", "==", searchCriteria); 
            }

           // if ((doc.data().approval == "") || (doc.data().approval == "Open")) {

        /*       if (approvalSearchCriteria === "Open")
          {  
            console.log('Open'); // 166
            query = query.where("approval", "==", "");
            //query = query.where("approval", "==", "");
          } 
          else {
            query = query.where("approval", "==", approvalSearchCriteria);
          } */
          
          if (approvalSearchCriteria === "All" || approvalSearchCriteria === undefined || !approvalSearchCriteria)
          {  
            query = query.orderBy("ce_date", "desc");
          //  console.log('empty is coming in here');
          } 
          else {
            query = query.where("approval", "==", approvalSearchCriteria).orderBy("ce_date", "desc");
          }

          // ANOTHER SEARCH - FOR CONFERENCE 
          if (this.cookieService.get('conferenceCollectionCookie')) {
            let tempConference = this.cookieService.get('conferenceCollectionCookie')
            query = query.where("conference", "==", tempConference); 
            this.cookieService.delete('conferenceCollectionCookie')
          }



           query = query.get().then((querySnapshot) => { // QUERY EXAMPLES citiesRef.where("population", ">", 100000).orderBy("population").limit(2)
            
            let obj : any = []; // STORE RETRIEVED DOCUMENTS
            this.totalCredits = 0;
            this.totalCreditsPerRecord = 0;
            this.totalCreditsPerRecordApproved = 0;
            this.totals_1A = 0;
            this.totals_ME_1A = 0;
            this.totals_RM_1A = 0;
            this.totals_CA = 0;
            this.totals_OP = 0;
            this.totals_All = 0;
            this.totals_Other = 0;
            this.openRecords = 0;

            querySnapshot
            .forEach((doc : any) =>
            {

              var credit_type1 = doc.data().credit_type1;
              var credit_type2 = doc.data().credit_type2;
              var credit_type3 = doc.data().credit_type3;
              var hours1 = 0;
              var hours2 = 0;
              var hours3 = 0;
              var hours_approved1 = 0;
              var hours_approved2 = 0;
              var hours_approved3 = 0;

            //  console.log('session number: ' +  doc.data().session_number);

             if (!isNaN(parseFloat(doc.data().hours1))) {
              hours1 =  parseFloat(doc.data().hours1);
             }
             if (!isNaN(parseFloat(doc.data().hours2))) {
              hours2 = parseFloat(doc.data().hours2);
             }
             if (!isNaN(parseFloat(doc.data().hours3))) {
              hours3 = parseFloat(doc.data().hours3);
             }
             if (!isNaN(parseFloat(doc.data().hours_approved1)) && (doc.data().approval == "Yes")) {
              hours_approved1 = parseFloat(doc.data().hours_approved1);
             } 
             if (!isNaN(parseFloat(doc.data().hours_approved2)) && (doc.data().approval == "Yes")) {
              hours_approved2 = parseFloat(doc.data().hours_approved2);
             } 
             if (!isNaN(parseFloat(doc.data().hours_approved3)) && (doc.data().approval == "Yes")) {
              hours_approved3 = parseFloat(doc.data().hours_approved3);
             }

              // CALCULATE Total CME Credits to Date = 1A + PS_1A + CA_1A + OP_1A + 1B + PS_1B + CA_1B + OP_1B + 2A + PS_2A + CA_2A + OP_2A + 2B + PS_2B + CA_2B + OP_2B
              this.totalCreditsPerRecord = hours1 + hours2 + hours3;
              this.totalCreditsPerRecordApproved = hours_approved1 + hours_approved2 + hours_approved3;
              this.totalCredits = this.totalCredits + this.totalCreditsPerRecordApproved;

/*            console.log('credit_type1: ', credit_type1);              
              console.log('credit_type2: ', credit_type2);              
              console.log('credit_type3: ', credit_type3);              
              console.log('totals_1A: ', this.totals_1A); */
              // CALCULATE Total Category 1A Credits to Date = 1A + PS_1A + CA_1A + OP_1A         

              if ((credit_type1 == "1A") || (credit_type1 == "ME_1A") || (credit_type1 == "RM_1A") || (credit_type1 == "ME_1A, RM_1A"))
              {
                this.totals_1A = this.totals_1A + hours_approved1;
           //     console.log('totals_1A:2 ', this.totals_1A);
              }
              if ((credit_type2 == "1A") || (credit_type2 == "ME_1A") || (credit_type2 == "RM_1A") || (credit_type2 == "ME_1A, RM_1A"))
              {
                this.totals_1A = this.totals_1A + hours_approved2;
/*              console.log('credit_type2 totalling?: ', credit_type2);  
                console.log('totals_1A:3 ', this.totals_1A); */
              }
              if ((credit_type3 == "1A") || (credit_type3 == "ME_1A") || (credit_type3 == "RM_1A") || (credit_type3 == "ME_1A, RM_1A"))
              {
                this.totals_1A = this.totals_1A + hours_approved3;
          //      console.log('totals_1A:4 ', this.totals_1A);
              }

              if (credit_type1 == "ME_1A") 
              {
                this.totals_ME_1A = this.totals_ME_1A + hours_approved1;
              }
              if (credit_type2 == "ME_1A") 
              {
                this.totals_ME_1A = this.totals_ME_1A + hours_approved2;
              }
              if (credit_type3 == "ME_1A") 
              {
                this.totals_ME_1A = this.totals_ME_1A + hours_approved3;
              }

              if (credit_type1 == "RM_1A") 
              {
                this.totals_RM_1A = this.totals_RM_1A + hours_approved1;
              }
              if (credit_type2 == "RM_1A") 
              {
                this.totals_RM_1A = this.totals_RM_1A + hours_approved2;
              }
              if (credit_type3 == "RM_1A") 
              {
                this.totals_RM_1A = this.totals_RM_1A + hours_approved3;
              }

              if (credit_type1 == "ME_1A, RM_1A") 
              {
                this.totals_ME_1A = this.totals_ME_1A + hours_approved1;
                this.totals_RM_1A = this.totals_RM_1A + hours_approved1;
              }
              if (credit_type2 == "ME_1A, RM_1A") 
              {
                this.totals_ME_1A = this.totals_ME_1A + hours_approved2;
                this.totals_RM_1A = this.totals_RM_1A + hours_approved2;
              }
              if (credit_type3 == "ME_1A, RM_1A") 
              {
                this.totals_ME_1A = this.totals_ME_1A + hours_approved3;
                this.totals_RM_1A = this.totals_RM_1A + hours_approved3;
              }




          /*     if ((credit_type2 == "1A") || (credit_type2 == "ME_1A") || (credit_type2 == "RM_1A"))
              {
                this.totals_1A = this.totals_1A + hours_approved2;
              console.log('credit_type2 totalling?: ', credit_type2);  
                console.log('totals_1A:3 ', this.totals_1A); 
              }
              if ((credit_type3 == "1A") || (credit_type3 == "ME_1A") || (credit_type3 == "RM_1A"))
              {
                this.totals_1A = this.totals_1A + hours_approved3;
          //      console.log('totals_1A:4 ', this.totals_1A);
              } */


              // console.log('totals_1A:5 ', this.totals_1A);
              // CALCULATE Total Patient Safety Credits to Date = PS_1A + PS_1B + PS_2A + PS_2B
              /* if ((credit_type1 == "PS_1A") || (credit_type1 == "PS_1B") || (credit_type1 == "PS_2A") || (credit_type1 == "PS_2B") || (credit_type1 == "1A_PS") || (credit_type1 == "1B_PS") || (credit_type1 == "2A_PS") || (credit_type1 == "2B_PS"))
              {
                this.totals_PS = this.totals_PS + hours_approved1;
              }
              if ((credit_type2 == "PS_1A") || (credit_type2 == "PS_1B") || (credit_type2 == "PS_2A") || (credit_type2 == "PS_2B") || (credit_type2 == "1A_PS") || (credit_type2 == "1B_PS") || (credit_type2 == "2A_PS") || (credit_type2 == "2B_PS"))
              {
                this.totals_PS = this.totals_PS + hours_approved2;
              }
              if ((credit_type3 == "PS_1A") || (credit_type3 == "PS_1B") || (credit_type3 == "PS_2A") || (credit_type3 == "PS_2B") || (credit_type3 == "1A_PS") || (credit_type3 == "1B_PS") || (credit_type3 == "2A_PS") || (credit_type3 == "2B_PS"))
              {
                this.totals_PS = this.totals_PS + hours_approved3;
              } */

              // CALCULATE Total Child Abuse Credits to Date = CA_1A + CA_1B + CA_2A + CA_2B
              /* if ((credit_type1 == "CA_1A") || (credit_type1 == "CA_1B") || (credit_type1 == "CA_2A") || (credit_type1 == "CA_2B") || (credit_type1 == "1A_CA") || (credit_type1 == "1B_CA") || (credit_type1 == "2A_CA") || (credit_type1 == "2B_CA"))
              {
                this.totals_CA = this.totals_CA + hours_approved1;
              }
              if ((credit_type2 == "CA_1A") || (credit_type2 == "CA_1B") || (credit_type2 == "CA_2A") || (credit_type2 == "CA_2B") || (credit_type2 == "1A_CA") || (credit_type2 == "1B_CA") || (credit_type2 == "2A_CA") || (credit_type2 == "2B_CA"))
              {
                this.totals_CA = this.totals_CA + hours_approved2;
              }
              if ((credit_type3 == "CA_1A") || (credit_type3 == "CA_1B") || (credit_type3 == "CA_2A") || (credit_type3 == "CA_2B") || (credit_type3 == "1A_CA") || (credit_type3 == "1B_CA") || (credit_type3 == "2A_CA") || (credit_type3 == "2B_CA"))
              {
                this.totals_CA = this.totals_CA + hours_approved3;
              } */

              // CALCULATE Total Opioid Credits to Date = OP_1A + OP_1B + OP_2A + OP_2B
              /* if ((credit_type1 == "OP_1A") || (credit_type1 == "OP_1B") || (credit_type1 == "OP_2A") || (credit_type1 == "OP_2B") || (credit_type1 == "1A_OP") || (credit_type1 == "1B_OP") || (credit_type1 == "2A_OP") || (credit_type1 == "2B_OP"))
              {
                this.totals_OP = this.totals_OP + hours_approved1;
              }
              if ((credit_type2 == "OP_1A") || (credit_type2 == "OP_1B") || (credit_type2 == "OP_2A") || (credit_type2 == "OP_2B") || (credit_type2 == "1A_OP") || (credit_type2 == "1B_OP") || (credit_type2 == "2A_OP") || (credit_type2 == "2B_OP"))
              {
                this.totals_OP = this.totals_OP + hours_approved2;
              }
              if ((credit_type3 == "OP_1A") || (credit_type1 == "OP_1B") || (credit_type3 == "OP_2A") || (credit_type3 == "OP_2B") || (credit_type3 == "1A_OP") || (credit_type3 == "1B_OP") || (credit_type3 == "2A_OP") || (credit_type3 == "2B_OP"))
              {
                this.totals_OP = this.totals_OP + hours_approved3;
              }
 */
              // CALCULATE "Other" Credits to Date = 1B + 2A + 2B + Other
              if ((credit_type1 == "1B") || (credit_type1 == "2A") || (credit_type1 == "2B") || (credit_type1 == "Other"))
              {
                this.totals_Other = this.totals_Other + hours_approved1;
              }
              if ((credit_type2 == "1B") || (credit_type2 == "2A") || (credit_type2 == "2B") || (credit_type2 == "Other"))
              {
                this.totals_Other = this.totals_Other + hours_approved2;
              }
              if ((credit_type3 == "1B") || (credit_type3 == "2A") || (credit_type3 == "2B") || (credit_type3 == "Other"))
              {
                this.totals_Other = this.totals_Other + hours_approved3;
              }

              if ((doc.data().approval == "") || (doc.data().approval == "Open")) {
                this.openRecords++;
              }

              let credit_multi = credit_type1; // + ',' + credit_type2 + ',' + credit_type3;

              if (credit_type2 !== undefined && credit_type2.length > 0 )
              {
                credit_multi = credit_type1 + ', ' + credit_type2; 
              }

              if (credit_type3 !== undefined && credit_type3.length > 0 )
              {
                credit_multi = credit_type1 + ', ' + credit_type2 + ', ' + credit_type3;
              }
              
              // THE SECOND HALF OF THE FIRESTORE TIMESTAMP CHANGES PREP - NEEDED TO ACCOUNT FOR FIREBASE TIMESTAMP CHANGE HERE BECAUSE DATEPIPE EXPECTS A DATE AND NOT A TIMESTAMP - WE'VE BEEN STORING TIMESTAMPS AND FIREBASE HAS BEEN READING THEM BACK AS DATES SO WE DIDN'T NEED TO DO THIS BEFORE
              const timestamp = doc.data().ce_date;
              const ce_date_from_timestamp = timestamp.toDate();
              let formatted_ce_date =this.datepipe.transform(ce_date_from_timestamp, 'yyyy-MM-dd'); 

              const timestamp2 = doc.data().date_entered;
              const ce_date_from_timestamp2 = timestamp2.toDate();
              let formatted_date_entered = this.datepipe.transform(ce_date_from_timestamp2, 'yyyy-MM-dd'); 

              const timestamp3 = doc.data().date_created;
              const ce_date_from_timestamp3 = timestamp3.toDate();
              let formatted_date_created = this.datepipe.transform(ce_date_from_timestamp3, 'yyyy-MM-dd'); 



              let presentation_doc_exists = "No";
              if (doc.data().supporting_doc != '') {
                presentation_doc_exists = "Yes";
              }
              let newdescription = '';
              let tempdescription = doc.data().description
//              console.log('tempdescription ' + tempdescription);


              if (doc.data().conference == 'TOMA/TXACOFP 12th Annual Convention') { // ONE TIME EXCEPTION FOR THE RECORDS THAT HAD THE DATE/TIME INCORPORTED INTO THE DESCRIPTION
                console.log('from conference with dates: ' + tempdescription.substring(tempdescription.split('-', 2).join('-').length + 1))
              newdescription = tempdescription.substring(tempdescription.split('-', 2).join('-').length + 1)
              } else
              {
              newdescription = doc.data().description;
              console.log('all other records ' + newdescription);
              }




//            alert('doc.data().aoa_number' + doc.data().aoa_number)

              //if findNoCase()
/*            var updateList = "1,025983,027881,028540,028588,028920,028984,029089,029173,029722,029988,030017,030294,032097,032214,032452,032679,032963,033093,033129,033872,033881,034716,035393,035399,035431,035992,036357,037325,037957,037963,037964,037994,038143,038469,038473,038666,039657,039808,040114,040213,040214,040256,040442,040631,041000,041931,042164,042289,042544,043607,044752,044758,044761,044765,044766,044767,044809,046396,046748,047308,048221,048801,051587,051614,054954,056596,058275,058285,059952,060753,061061,061837,062084,062137,065223,067054,070438,071099,073097,084853,085188,0161401,0166033,0166049,0178171"

              if (updateList.indexOf(doc.data().aoa_number) > 0) { */

                //alert('updateList: ' + doc.data().aoa_number)

              obj.push({
                id                    : doc.id,
                ce_date               : formatted_ce_date, //doc.data().ce_date,
                date_entered          : formatted_date_entered,
                accreditor            : doc.data().accreditor,
                session               : doc.data().session,
                conference            : doc.data().conference,
                credit_type1          : doc.data().credit_type1,
                hours1                : doc.data().hours1,
                hours_approved1       : doc.data().hours_approved1,
                credit_type2          : doc.data().credit_type2,
                hours2                : doc.data().hours2,
                hours_approved2       : doc.data().hours_approved2,
                credit_type3          : doc.data().credit_type3,
                hours3                : doc.data().hours3,
                hours_approved3       : doc.data().hours_approved3,
                hours_total           : this.totalCreditsPerRecord,
                hours_total_approved  : this.totalCreditsPerRecordApproved,
                description           : newdescription, // doc.data().description,
                member_id             : doc.data().member_id,
                aoa_number            : doc.data().aoa_number,
                approval              : doc.data().approval,
                approval_reason       : doc.data().approval_reason,
                supporting_doc        : doc.data().supporting_doc,
                doc_exists            : presentation_doc_exists,
                created_by            : doc.data().created_by,
                created_by_process    : doc.data().created_by_process,
                date_created          : formatted_date_created, //doc.data().date_created, // BECOMES LAST_UPDATED AS THIS IS UPDATED EACH TIME THE RECORD IS UPDATED
                totals_1A             : this.totals_1A,
                totals_ME_1A          : this.totals_ME_1A, 
                totals_RM_1A          : this.totals_RM_1A,
                totals_CA             : this.totals_CA,
                totals_OP             : this.totals_OP,
                totals_Other          : this.totals_Other,
                openRecords           : this.openRecords,
                totalCredits          : this.totalCredits,
                credit_multi          : credit_multi
              });

            //}

            });

            console.log('end of getdocs5: ' + obj.length + 'returned');
            resolve(obj); // SEND BACK THE ARRAY OF OBJECTS

         })
         .catch((error : any) =>
         {
           console.log('error for insufficient priviledges coming from here');
            reject(error);
         });

      }); // END OF RETURN PROMISE
   }

    /** Add a new document to a selected database collection
      * @public
      * @method addDocument
      * @param  collectionObj    {String}           The database collection we want to add a new document to
      * @param  docObj           {Any}              The key/value object we want to add
      * @return {Promise}
    */
    
   addDocument(collectionObj : string,
             dataObj       : any) : Promise<any>
   {
      return new Promise((resolve, reject) =>
      {
         this._DB.collection(collectionObj).add(dataObj)
         .then((obj : any) =>
         {
            resolve(obj);
         })
         .catch((error : any) =>
         {
            reject(error);
         });
      });
   }

  /** Delete an existing document from a selected database collection
    * @public
    * @method deleteDocument
    * @param  collectionObj    {String}           The database collection we want to delete a document from
    * @param  docObj           {Any}              The document we wish to delete
    * @return {Promise}
  */
   deleteDocument(collectionObj : string,
                docID         : string) : Promise<any>
   {
      return new Promise((resolve, reject) =>
      {
         this._DB
         .collection(collectionObj)
         .doc(docID)
         .delete()
         .then((obj : any) =>
         {
            resolve(obj);
         })
         .catch((error : any) =>
         {
            reject(error);
         });
      });
   }



   /** Update an existing document within a selected database collection
    * @public
    * @method updateDocument
    * @param  collectionObj    {String}           The database collection to be used
    * @param  docID            {String}           The document ID
    * @param  dataObj          {Any}              The document key/values to be updated
    * @return {Promise}
    */
   updateDocument(collectionObj : string,
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
   }

}