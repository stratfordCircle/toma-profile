import { Http } from "@angular/http";
import { Injectable } from "@angular/core";
import CryptoJS from "crypto-js";
//import { DatabaseProvider } from "../database/database";
// We MUST import both the firebase AND firestore modules like so
import * as firebase from "firebase";
import "firebase/firestore";
import { CookieService } from "ngx-cookie-service";
//import { resolveDefinition } from "@angular/core/src/view/util";

@Injectable()
export class SrkServicesProvider {

  clientCypher: string = "ishkabibble";
  private _DB: any;
  isAdmin: boolean;
  data: any;

  constructor(public http: Http, private cookieService: CookieService) {
    this._DB = firebase.firestore();
    const settings = { timestampsInSnapshots: true }; //FIREBASE MADE A CHANGE TO READ TIMESTAMPS AS TIMESTAMPS INSTEAD OF AS SYSTEM DATE OBJECTS - THESE TWO LINES FORCE THE READ AS A TIMESTAMP TO PREPARE FOR THAT CHANGE WHEN FIREBASE IMPLEMENTS IT OR ELSE IT WOULD BE A BREAKING CHANGE
    this._DB.settings(settings);

    if (this.cookieService.get('tokenTOMAAdmin')) {   
      this.isAdmin = true;
    }

  }

  encryptString(incomingString) {
    var encryptedUser = CryptoJS.AES.encrypt(incomingString, this.clientCypher);
    return encryptedUser.toString();
  }

  decryptString(incomingEncryptedString) {
    var bytes_enc_string = CryptoJS.AES.decrypt(
      incomingEncryptedString.toString(),
      this.clientCypher
    );

    return bytes_enc_string.toString(CryptoJS.enc.Utf8);
  }

// CHECK IF CURRENT USER SHOULD BE ABLE TO NAVIGATE TO A SPECIFIC CERTIFICATE
certDisplayCheck(collectionObj: string, certFullName: string, ) {

  //    console.log('cert display check');
  
      //var de_enc_user = this.decryptString(this.cookieService.get("tokenFB_Num"));
      var de_enc_user
      // IF ADMIN, CHECK FOR certTestUser cookie 
      if (this.cookieService.get('tokenTOMAAdmin')) { 
        /* this.isAdmin = true}
      if (this.isAdmin) { */
   //     console.log('is admin');
  
        de_enc_user = this.cookieService.get("certTestUser");
   //     console.log('enc: ' + de_enc_user)
      } else {
        de_enc_user = this.decryptString(this.cookieService.get("tokenFB_Num"));
      }
  
  //    console.log('display check user: ', de_enc_user);
  //    console.log("params:", collectionObj + '|' + certFullName + '|' + de_enc_user + '|');
  
  /*     if (this.cookieService.get('certTestUser'))
      {
        
      }
   */
      var certDataObj : any = []; // STORE RETRIEVED DOCUMENTS
      return new Promise((resolve, reject) => {
        let query = this._DB.collection(collectionObj);
        query = query.where("aoa_number", "==", de_enc_user);
        query = query.where("conference", "==", certFullName).limit(1); //REMOVE LIMIT OF ONE, RIGHT? HOW MUCH DOES THIS GET SLOWED DOWN? - SRK
        query = query
          .get()
          .then(querySnapshot => {
            if (querySnapshot.empty) {
  //            console.log('RESOLVE EMPTY')
              resolve(false);
            } else {
              
              querySnapshot
              .forEach((doc : any) =>
              {
                // TODO: THIS IS WHERE WE LEFT OFF GETTING A NAME // THIS IS NOT NEEDED, ALREADY EXISTS - THIS IS JUST CHECKING IF VALID
                // DO THIS ONLY WHILE NOT FOUND? -SRK
  //              console.log('should be many times')
                if (doc.data().member_last)
                {
                //  console.log('we have a last name: ' + doc.data().member_last)
                  certDataObj.push({
                    member_last : doc.data().member_last
                  })
                }
                if (doc.data().member_first)
                {
  //                console.log('we have a first name: ' + doc.data().member_first)
                  certDataObj.push({
                    member_first : doc.data().member_first
                  })
                }              
                if (doc.data().member_middle)
                {
  //                console.log('we have a last name: ' + doc.data().member_middle)
                  certDataObj.push({
                    member_middle : doc.data().member_middle
                  })
                }              
              });
  //            console.log('RESOLVE TRUE')
              // IF TRUE AND IF THERE IS A NAME, WE NEED TO SEND BACK MULTIPLE PIECES OF DATA
              // SRK 12/21
              resolve(true);
            }
          })
          .catch((error: any) => {
  //          console.log("data error", error.message);
            reject(error);
          });
      }); // END OF RETURN PROMISE
    }
  
    // CHECK IF CURRENT USER SHOULD BE ABLE TO NAVIGATE TO A SPECIFIC CERTIFICATE
    nameDisplayCheck(collectionObj: string, certFullName: string, ) {
  
  //    console.log('cert display check');
  
      //var de_enc_user = this.decryptString(this.cookieService.get("tokenFB_Num"));
  
var de_enc_user

      // IF ADMIN, CHECK FOR certTestUser cookie 
      if (this.isAdmin) {
    //    console.log('is admin');
        de_enc_user = this.cookieService.get("certTestUser");
    //    console.log('enc: ' + de_enc_user)
      } else {
        de_enc_user = this.decryptString(this.cookieService.get("tokenFB_Num"));
      }
  
    //  console.log('display check user: ', de_enc_user);
    //  console.log("params:", collectionObj + '|' + certFullName + '|' + de_enc_user + '|');
  
  /*     if (this.cookieService.get('certTestUser'))
      {
        
      }
   */
      return new Promise((resolve, reject) => {
        let query = this._DB.collection(collectionObj);
        query = query.where("aoa_number", "==", de_enc_user);
        //query = query.where("member_last", "==" !isN)
        query = query.where("conference", "==", certFullName).limit(1);
        query = query
          .get()
          .then(querySnapshot => {
            if (querySnapshot.empty) {
  //            console.log('RESOLVE EMPTY')
              resolve(false);
            } else {
              resolve(true);
  //            console.log('RESOLVE TRUE')
            }
          })
          .catch((error: any) => {
  //          console.log("data error", error.message);
            reject(error);
          });
      }); // END OF RETURN PROMISE
    }

  getProfileCookies() {

    return new Promise((resolve, reject) => {

      let returnObj: any = [];
      let greeting = '- ';

      let firstName = this.cookieService.get('token_first') + ' ';
      let middleName = this.cookieService.get('token_middle');
      if (middleName) middleName = middleName + ' ';
      let lastName = this.cookieService.get('token_last');

      let credential = this.cookieService.get('token_credential');
      if (credential) 
      {
        credential = ', ' + credential;
      } else {
        credential = '';
      }

      let suffix = this.cookieService.get('token_suffix');

      if (suffix === 'DO' && credential !== 'DO')
      {
        credential = ', DO';
      }

      if (suffix) {
        if (suffix === 'DO.') { suffix = '' }
        else { suffix = ' ' + suffix }
      }
      let memberType = this.cookieService.get('token_membertype');
      let token_Num = this.cookieService.get('tokenFB_Num');

      // assemble greeting

      let de_enc_user = this.decryptString(this.cookieService.get('tokenFB_Num'));

      if (credential === ', DO') {
        greeting = greeting + "Dr. " + firstName + ' ' + lastName;
      }
      else {
        greeting = greeting + firstName + ' ' + lastName;
      }

      greeting = greeting + credential + ' ' + de_enc_user; 

      // return the greeting as well?

      returnObj.push({
        firstName: firstName,
        lastName: lastName,
        middleName: middleName,
        suffix: suffix,
        memberType: memberType,
        aoa_num_enc: token_Num,
        credential: credential,
        de_enc_user: de_enc_user,
        greeting: greeting
      });

      resolve(returnObj);

    });

  }

  
  getMemberProfile() {

    return new Promise((resolve, reject) => {



      var checkName = this.cookieService.get('certTestUser')
 
      if (checkName ) {
      // alert ('use to get Name: ' + checkName)

      // STILL NEED TO ADD GETMEMBERPROFILE - WILL LOOK LIKE THE BELOW CALL
        /* CALL NEW FUNCTION AND UNPACK IT HERE

        srk.getMemberProfile().then((data) => {
          this.token_credential = data[0].credential;
          //if (this.token_credential) {this.token_credential = ', ' + this.token_credential}
          this.token_first = data[0].firstName;
          this.token_last = data[0].lastName;
          this.token_middle = data[0].middleName;
          this.token_suffix = data[0].suffix;
          this.token_membertype = data[0].memberType;
          this.token_Num = data[0].aoa_num_enc;
  
        }); */

        var getToken = this.cookieService.get('tokenTOMACookie');
        console.log('https://us-central1-toma-cme.cloudfunctions.net/app/membername/?aToken=' + getToken + '&memberSearch=' + checkName)
  
        // TAKES THE ACCESS TOKEN TO GET US THE SEARCH URL (ORE RESULTS IF WE DO BOTH IN THE SAME CALL)
        // this.http.get('http://localhost:8083/?aToken=' + getToken + '&memberSearch=' + checkName)
        this.http.get('https://us-central1-toma-cme.cloudfunctions.net/app/membername/?aToken=' + getToken + '&memberSearch=' + checkName)
        .map(res => res.json())
        .subscribe(data => {
      
          this.data = data
      
      
//           console.log('RETURN *** data from token: ' + this.data)
          console.log('RETURN *** data: from token' + JSON.stringify(this.data))
          
/*           this.slast_name = this.data.profiles[0]["[Name | Last]"]
          this.sfirst_name = this.data.profiles[0]["[Name | First]"]
          this.smiddle_name = this.data.profiles[0]["[Name | Middle]"] */

      let returnObj: any = [];
      let greeting = '- ';

      let firstName = this.data.profiles[0]["[Name | First]"] + ' ';
      let middleName = this.data.profiles[0]["[Name | Middle]"]
      if (middleName) middleName = middleName + ' ';
      let lastName = this.data.profiles[0]["[Name | Last]"]

      let credential = this.data.profiles[0]["02 - Designation"]
      if (credential) 
      {
        credential = ', ' + credential;
      } else {
        credential = '';
      }

      let suffix = this.data.profiles[0]["[Name | Suffix]"] 

      if (suffix === 'DO' && credential !== 'DO')
      {
        credential = ', DO';
      }

      if (suffix) {
        if (suffix === 'DO') { suffix = '' }
        else { suffix = ' ' + suffix }
      }
      let memberType = this.data.profiles[0]["[Member Type]"]
      let token_Num = this.cookieService.get('tokenFB_Num');

      // assemble greeting

      let de_enc_user = this.decryptString(this.cookieService.get('tokenFB_Num'));

      if (credential === ', DO') {
        greeting = greeting + "Dr. " + firstName + ' ' + lastName;
      }
      else {
        greeting = greeting + firstName + ' ' + lastName;
      }

      greeting = greeting + credential + ' ' + de_enc_user; 

      // return the greeting as well?

      returnObj.push({
        firstName: firstName,
        lastName: lastName,
        middleName: middleName,
        credential: credential/* ,
        suffix: suffix,
        memberType: memberType,
        aoa_num_enc: token_Num,
        de_enc_user: de_enc_user,
        greeting: greeting */
      });

      resolve(returnObj);
      
//          console.log('name ' + this.sfirst_name + ' ' + this.smiddle_name + ' ' + this.slast_name)
      
          // CAN PACK THESE INTO AN OBJECT, SEND THEM BACK AND POPULATE NAME IN HOME.HTML
      
//        res.send('yabba')
      
        
      /*     var getProfilesURL = data["url"]
          var getProfilesURLid = data["id"]
            console.log('profilesURLid   ' + getProfilesURLid)
          
          console.log('profilesURL ' + getProfilesURL)
          console.log('name ' + name) */
        
        })

/*         this.srk.searchWithIDandAccessToken(checkName)
        .then((data) =>
        {}
        ) */

      }



      

    });

  }

}
