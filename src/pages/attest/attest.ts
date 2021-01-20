import {Component, OnInit} from '@angular/core';
import { clientVars } from "./../../environments/environment";
import { IonicPage, NavController, AlertController, NavParams } from "ionic-angular";
import * as firebase from "firebase";
import "firebase/firestore";
import { CookieService } from "ngx-cookie-service";
import { DatePipe } from "@angular/common";
import { identifierModuleUrl } from "@angular/compiler";
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import CryptoJS from "crypto-js";

/**
 * Generated class for the AttestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-attest",
  templateUrl: "attest.html",
})

export class AttestPage implements OnInit {
/*   function check() {
    document.getElementById("myCheck").checked = true;
}
 */

  clientCypher: string = "ishkabibble";
  isAdmin: boolean
  editRecords = []
  tempElement = []
  conferenceNameForQuery: string
  _COLL = clientVars.cycleCollection1 // MAY REMOVE THIS ALTOGETHER
  private _DB : any
  checkAgainst : string
  checkSession
  checkElement
  
  constructor(public navCtrl: NavController, public datepipe: DatePipe, public navParams: NavParams, private _ALERT: AlertController, private cookieService: CookieService) {

/*     if (this.navParams.get("conferenceNameString")) {
      const conferenceNameForQuery = this.navParams.get("conferenceNameString")
      console.log("conference name from Param:" + conferenceNameForQuery)
    } */

    if (this.navParams.get("conferenceNameString")) {
      this.conferenceNameForQuery = this.navParams.get("conferenceNameString")
      console.log("conference name from Param:" + this.conferenceNameForQuery)
    }

    this._DB = firebase.firestore();
    const settings = { timestampsInSnapshots: true }; //FIREBASE MADE A CHANGE TO READ TIMESTAMPS AS TIMESTAMPS INSTEAD OF AS SYSTEM DATE OBJECTS - THESE TWO LINES FORCE THE READ AS A TIMESTAMP TO PREPARE FOR THAT CHANGE WHEN FIREBASE IMPLEMENTS IT OR ELSE IT WOULD BE A BREAKING CHANGE
    this._DB.settings(settings);

  }

  ngOnInit(): void {

  /*   this.getDocuments(this.conferenceNameForQuery)
    .then((data) =>
    {
      this.editRecords = data 
    //  this.testAsync()
    }) */

    this.ionViewCanEnter();
    
  }

  displayAlert(message, subtitle): void {
    let alert: any = this._ALERT.create({
      title: message,
      subTitle: subtitle, 
      buttons: [
        {
          text: "Got It!"
          }
      ]
    });
    alert.present();
  }


  ionViewCanEnter(): Promise<any>{
    return new Promise((resolve, reject) => {

     this.getDocuments(this.conferenceNameForQuery)
      .then((data) =>
      {
        this.editRecords = data 
        resolve(true)
      //  this.testAsync()
      }).catch (() => {
        resolve(false)
      }
      )
    })
   }

//  ionViewWillEnter() {

/*     if (this.navParams.get("conferenceNameString")) {
      this.conferenceNameForQuery = this.navParams.get("conferenceNameString")
      console.log("conference name from Param:" + this.conferenceNameForQuery)
    } */

   /*  this.getDocuments(this.conferenceNameForQuery)
    .then((data) =>
    {
      this.editRecords = data 
      console.log('this.editRecords[4].session' + this.editRecords[4].session)
    }) */
    
  //}

  ionViewDidLoad() {

// maybe try this here -  this.testAsync()

//    ionViewDidEnter () {

      console.log("ionViewDidEnter");

// Cannot get this to set up before checking it... 
// Look at how I pull things in with Pickled Soul


/*       this.getDocuments(this.conferenceNameForQuery)
      .then((data) =>
      {
        this.editRecords = data 

        console.log('this.editRecords: ' + JSON.stringify(this.editRecords))

        console.log('this.editRecords.length() ' + this.editRecords.length)

        console.log('this.editRecords[4].session' + this.editRecords[4].session) */

       
    


/*     console.log('this.editRecords.length() ' + this.editRecords.length) */


/*     if (this.editRecords[i].hours1 > 0) {

      this.setOneChecked(i).then((result) => {
        console.log('result: ' + JSON.stringify(result))
        this.tempElement = result;
        this.tempElement[0].checked = true
      });
    }  */

/*     const x = (<HTMLInputElement[]><any>document.getElementsByName('3'))
    x[0].checked = true */
    

/*     if (this.navParams.get("conferenceNameString")) {
      this.conferenceNameForQuery = this.navParams.get("conferenceNameString")
      console.log("conference name from Param:" + this.conferenceNameForQuery) */
//      this.cookieService.set("conferenceCollectionCookie", e, 0.02083333);

//      this.loadConferenceRecords(this.conferenceNameForQuery)
      
      /* this.getDocuments(this.conferenceNameForQuery)
      .then((data) =>
      {
        this.editRecords = data 
        const x = (<HTMLInputElement[]><any>document.getElementsByName(this.editRecords[4].session))
        x[0].checked = true   */
    /*     if (data) {
          var i = 0 // or one?
        this.editRecords = data  

        while (i <  this.editRecords.length) {

          console.log('this.editRecords[i].session:' + this.editRecords[i].session)

          var x = <HTMLInputElement[]><any>document.getElementsByName(this.editRecords[i].session)

console.log('type? ', x[0].type)

          //x[0].checked = true



i++

      } 

    }
 */


//  })

     

     /*  this.setAllCheckboxes(this.conferenceNameForQuery) */

//    }

    /* if (conferenceNameForQuery === "") {
       this.isNoConference = true;
       this.is63rdMidWinter = false;
    }
    if (conferenceNameForQuery === "63rd MidWinter Conference") {
      this.isNoConference = false;
      this.is63rdMidWinter = true;
    }
    this.cookieService.set("conferenceCollectionCookie", e, 0.02083333);
    //this.cycleCollection = e

    this.retrieveCollection(); */
    // this.setAllCheckboxes(this.conferenceNameForQuery)
 // })
// this.testAsync()
    }

    testAsync() {
      if (this.editRecords[1].hours1 > 0) {
        console.log('searching session 1')
        this.checkSession = this.editRecords[1].session
        this.checkElement = (<HTMLInputElement[]><any>document.getElementsByName(this.checkSession))
        //const x = (<HTMLInputElement[]><any>document.getElementsByName('1'))
        console.log('type: ' + this.checkElement[0].type)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
        this.checkElement[0].checked = true
    }
    if (this.editRecords[2].hours1 > 0) {
      console.log('searching session 2')
      this.checkSession = this.editRecords[2].session
      this.checkElement = (<HTMLInputElement[]><any>document.getElementsByName(this.checkSession))
      console.log('type: ' + this.checkElement[0].type)
      this.checkElement[0].checked = true
  }
  if (this.editRecords[3].hours1 > 0) {
    console.log('searching session 3')
    this.checkElement = (<HTMLInputElement[]><any>document.getElementsByName('3'))
    console.log('type: ' + this.checkElement[0].type)
    this.checkElement[0].checked = true

    // SRK - COULD POSSIBLY ADD A VARIABLE TO THE INPUT FOR CHECKED AND SET IT IN THE ARRAY AND JUST SET IT RATHER THAN USING THE ELEMENT
}
    }
          /*  
          if (this.editRecords[i].hours1 > 0) {

            this.setOneChecked(i).then((result) => {
              console.log('result: ' + JSON.stringify(result))
              this.tempElement = result;
              this.tempElement[0].checked = true
            });
          } 
        */

  setAllCheckboxes(conference) {
    console.log("pop default")

    const x = (<HTMLInputElement[]><any>document.getElementsByName('9'))
    x[0].checked = true   

    const y = (<HTMLInputElement[]><any>document.getElementsByName('8'))



    this.getDocuments(conference).then(data => {
      
      if (data) {
        var i = 0 // or one?
        this.editRecords = data  
        if (this.editRecords[2].hours1 > 0)
        {
          y[0].checked = true
        }
    

        while (i <  this.editRecords.length) {

          console.log('this.editRecords[i].hours1:' + this.editRecords[i].hours1)

          if (this.editRecords[i].hours1 > 0) {

           console.log('this.editRecords[i].session:' + this.editRecords[i].session)

           let tempInt = this.editRecords[i].session.toString()

            //const x = <HTMLInputElement[]>(<any>document.getElementsByName(sessionId))

           /*  this.editRecords[i].session */

            //const x = (<HTMLInputElement[]><any>document.getElementsByName('5'))

            var x = (<HTMLInputElement[]><any>document.getElementsByName(this.editRecords[i].session))
            x[0].checked = true   
 
           /*  console.log('hours1 ' + this.editRecords[i].hours1 )

            console.log('x[0] ?:', x[0].checked + '|' + x[0].type)
            
            x[0].checked = true

            console.log('x[0] ?:', x[0].checked + '|' + x[0].type)

            console.log('calling SetOne ' + i); */
            
         /*    this.setOneChecked_try2(i).then((result) => {
              const tempElement = result;
              tempElement[0].checked = true
          });  */

        //    this.setOneChecked(i)

       /*      const y = (<HTMLInputElement[]><any>document.getElementsByName(compareToSession))
            if (y[0].checked === true) { 
              x[0].checked = false
              alert("Only one session per time slot is permitted.")
            }
 */


          }
i++
          // loop thru and where hours exist, set as checked?
        }
      }
    })
  }
  
  setOneChecked_try2(session) {
    /*     const x = (<HTMLInputElement[]><any>document.getElementsByName(this.editRecords[4].session))
          x[0].checked = true 
     */

    (<HTMLInputElement[]><any>document.getElementsByName(this.editRecords[20].session))[0].checked = true

    //return (<HTMLInputElement[]><any>document.getElementsByName(this.editRecords[20].session));

       let obj : any = []; // STO
/*        const x = (<HTMLInputElement[]><any>document.getElementsByName(this.editRecords[20].session));
        //return await (<HTMLInputElement[]><any>document.getElementsByName(this.editRecords[session].session));
        x[0].checked = true */

        obj.push({
          set : "yep"
        })

        return obj

      }

  async setOneChecked(session) {
/*     const x = (<HTMLInputElement[]><any>document.getElementsByName(this.editRecords[4].session))
      x[0].checked = true 
 */
//    const x = (<HTMLInputElement[]><any>document.getElementsByName(this.editRecords[20].session));
    return await (<HTMLInputElement[]><any>document.getElementsByName(this.editRecords[session].session));
 //   x[0].checked = true

            
  }

 loadConferenceRecords(conference) {

// CREATE THE ARRAY OF CHECKS IN HERE
// RESOLVE ARRAY
// SEND ARRAY TO FUNCTION THAT LOADS THE CHECKS

    console.log("pop default")  
  
    this.getDocuments(conference)
    .then((data) =>
    {
      this.editRecords = data  

      console.log('length: ' + this.editRecords.length)

      console.log('show data on load: ', JSON.stringify(this.editRecords))



      // loop thru and where hours exist, set as checked?
    })
   
  // this.setAllCheckboxes(this.conferenceNameForQuery)

  
  }

  /* 
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
          this.displayConcurrentSessionsAlert("This session is concurrent with the optional course: Basic Life Support for Physicians.");
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
          this.displayConcurrentSessionsAlert("This session is concurrent with the Opening Session.");
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

    console.log("session 3: " + this.session_3);

    this.confProv.updateConferenceSession(checkFlag, sessionNum);

  }


  displayConcurrentSessionsAlert(title      : string) : void
{
let alert : any     = this._ALERT.create({
title      : title,
buttons    : [{
text      : "Got It!"
}]
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
          this.displayConcurrentSessionsAlert("This session is concurrent with the optional course: Basic Life Support for Physicians.");
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
          this.displayConcurrentSessionsAlert("This session is concurrent with the Opening Session.");
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

    console.log("session 3: " + this.session_3);

    this.confProv.updateConferenceSession(checkFlag, sessionNum);

  }


  displayConcurrentSessionsAlert(title      : string) : void
{
let alert : any     = this._ALERT.create({
title      : title,
buttons    : [{
text      : "Got It!"
}]
});
alert.present();
}

});
alert.present();
}
 */
  


 // TODO: BUILD OUT FULL FORM AGAIN, ADD ALL SESSION PAIRS - THEN LOOK AT A WAY TO PULL IN THE SESSION PAIRS FROM A DATASOURCE
 // TODO: LOOP THROUGH RECORDS ON LOAD TO SHOW CHECKED OR NOT
findPairedSession(incomingSession) {

  console.log('incomingSession to findPairedSession: ' + incomingSession);

 /*  switch(variable_expression) { 
    case constant_expr1: { 
       //statements; 
       break; 
    } 
    case constant_expr2: { 
       //statements; 
       break; 
    } 
    default: { 
       //statements; 
       break; 
    } 
 } 
 */
  switch(incomingSession) {
    /* case 4: {
      return 5;
    }
    case 5: {
      return 4;      
    }
    case 6: {
      return 7;
    } 
    case 7: {
      return 6; }    

      case 8: {
      return 9; }
    case 9: {
      return 8; }    

      case 10: {
      return 11; }
    case 11: {
      return 10; }    

      case 12: {
      return 13; }
    case 13: {
      return 12; }    

      case 14: {
      return 15; }
    case 15: {
      return 14; }     */

      case 18: {
      return 19; }
    case 19: {
      return 18; }    

      case 20: {
        return 21; }
      case 21: {
        return 20; }          

      case 22: {
      return 23; }
    case 23: {
      return 22; }    



/*       case 23: {
      return 24; }
    case 24: {
      return 23; }    

      case 25: {
      return 26; }
    case 26: {
      return 25; }    

      case 27: {
      return 28; }
	  
    case 28: { 
      return 27; } */  

    default: {
      console.log('in switch default')
      return 0;
    }
  }

}

getColor(sessionId)
{
  console.log("sessionId in getColor: " + sessionId)
//  const pairedListForColor = "5,6,8,9"

  if (sessionId === 18 || sessionId === 19)
  {
    return "#d1d1e0"
  }
  if (sessionId === 20 || sessionId === 21)
  {
    return "#a4a4c1"
  }
  if (sessionId === 22 || sessionId === 23)
  {
    return "#d1d1e0"
  }
  
/*   if (pairedListForColor.indexOf(sessionId)) {
    return "gray" 
  } */
}

concurrentCheck(sessionId) {

console.log("concurrentCheck" + sessionId)

//var script = (<HTMLScriptElement[]><any>document.getElementsByName(sessionId))[0];
  const x = (<HTMLInputElement[]><any>document.getElementsByName(sessionId))

//  if (x[0].type.toLowerCase() == "checkbox") { 
  if (x[0].checked === true) { 
    console.log("concurrentCheck x:" + x[0].checked) //[0].checked)  
    // a session was clicked, so go get paired session
    const compareToSession = this.findPairedSession(sessionId).toString()
    console.log("result from findPairedSession:" + compareToSession)

    if (compareToSession !== "0") {
  const y = (<HTMLInputElement[]><any>document.getElementsByName(compareToSession))
      if (y[0].checked === true) { 
        x[0].checked = false
        this.displayAlert("You are trying to select Concurrent Sessions","Please uncheck the conflicing session and then make your choice again.")
      }
  }
    
  }  else {
    console.log("not checked")
  }







  
  // *** SRK - 6/6/19 - THE ABOVE RETURNS CHECKED AS THE TYPE, BUT THEN RETURNS .CHECKED AS UNDEFINED


/*   pass in session id as the same as the name id

  sessionID can let us know if we need to check that another record is not already checked

  but how can we get the state of another item if we don"t know the id? Name?

  check value by id
  if this is 4 and 5 is checked - show message and return false
 */
}

decryptString(incomingEncryptedString) {
  var bytes_enc_string = CryptoJS.AES.decrypt(
    incomingEncryptedString.toString(),
    this.clientCypher
  );

  return bytes_enc_string.toString(CryptoJS.enc.Utf8);
}

    getDocuments(conference) : Promise<any> {
  
      console.log("getDocs")
      console.log("conference: ", conference)
      console.log("this._COLL: ", this._COLL)

      //const testUserNum = "9999999998"

      var de_enc_user = this.decryptString(this.cookieService.get("tokenFB_Num"));
      var attestUser = de_enc_user

      if (this.cookieService.get('tokenTOMAAdmin')) {   
        this.isAdmin = true;
      }

      if (this.isAdmin) {

        attestUser = "9999999998"
      }


      var checked : boolean
  
       return new Promise((resolve, reject) => {
  
        var query = this._DB.collection(this._COLL);
        query = query.where("conference", "==", conference)
        query = query.where("aoa_number", "==", attestUser)
        query = query.orderBy("session")
        query.get().then((querySnapshot) => { // QUERY EXAMPLES citiesRef.where("population", ">", 100000).orderBy("population").limit(2)
  
          let obj: any = [] // STORE RETRIEVED DOCUMENTS
  
          querySnapshot
            .forEach((doc: any) => {
  
              const session = doc.data().session
              const hours1 = doc.data().hours1
              const hours_approved1 = doc.data().hours_approved1
              if (hours_approved1 > 0) {
                checked = true
              } else {
                checked = false
              }
              const timestamp2 = doc.data().ce_date
              const ce_date_from_timestamp2 = timestamp2.toDate()
              const formatted_date_entered = this.datepipe.transform(ce_date_from_timestamp2, "yyyy-MM-dd")
              console.log('session: ' + session)  
              console.log('time: ' + doc.data().other)  
              console.log('description ' + doc.data().description)
              console.log("hours1: " + hours1)
              console.log("hours_approved1: " + hours_approved1)
              console.log("session: " + session)
              obj.push({
                id: doc.id,
                session: session,
                courseCredit: hours1,
                checked: checked,
                ce_date: formatted_date_entered,
                time: doc.data().other,
                description: doc.data().description,
                accreditor: doc.data().accreditor
              })
  
            })
  
  
  
          //console.log("end of getdocs5: " + obj.length + "returned");
          resolve(obj); // SEND BACK THE ARRAY OF OBJECTS
  
        })
          .catch((error: any) => {
            //console.log("error for insufficient priveledges coming from here");
            reject(error);
          })
  
      })
  
    }

    saveNotice(eVent): void {

   /*     const x = (<HTMLInputElement[]><any>document.getElementsByName(this.editRecords[4].session))
      x[0].checked = true    */

      console.log("event:", JSON.stringify(eVent))
  
      //const inputValue2 = (<HTMLInputElement>document.getElementById("blue")).value;
  
      var elements = (<HTMLFormElement>document.getElementById("dynamicConference")).elements;
  
      for (var i = 0, element; element = elements[i++];) {
        console.log("looping elements:", element.id + " " + element.type + " " + element.value)
          if (element.type === "checkbox" && element.value !== "") {
              console.log("value: " + element.value)
              if (element.checked === true){
              this.updateDoc("irrelevant", element.id, {hours_approved1: element.value})
              this.updateDoc("irrelevant", element.id, {approval: 'Yes'})
              } else {
              this.updateDoc("irrelevant", element.id, {hours_approved1: 0})
              this.updateDoc("irrelevant", element.id, {approval: ''})
              } 
          }
      }

      this.displayAlert("Saving Conference Attestation records...","")
  
    }

    updateDoc(collectionObj: string,
      docID: string,
      dataObj: any): Promise<any> {
      return new Promise((resolve, reject) => {
        this._DB
          .collection(this._COLL)
          .doc(docID)
          .update(dataObj)
          .then((obj: any) => {
            resolve(obj);
          })
          .catch((error: any) => {
            reject(error);
          });
      });

    }
 
}
