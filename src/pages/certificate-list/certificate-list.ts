import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams } from 'ionic-angular';
import { SrkServicesProvider } from '../../providers/srk-services/srk-services';
import { CookieService } from 'ngx-cookie-service';

/**
 * Generated class for the CertificateListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-certificate-list',
  templateUrl: 'certificate-list.html',
})


// TODO: THE NAME THAT SHOWS UP ON THESE IS THE NAME OF THE ADMIN - TAKE THE NAME OUT OR BUILD A SEARCH TO GET THE RIGHT NAME - CAN ADD A SEARCH THAT LOOKS FOR ANY RECORD BY THAT USERID WHERE THE NAME FIELDS EXIST

export class CertificateListPage {

  ca_2018: boolean = false;
  pofps_2018: boolean = false;  
  isAdmin: boolean = false;
  quickCheck: string;
  currentUser: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public srk: SrkServicesProvider,
    private _ALERT  : AlertController,
    private cookieService: CookieService ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CertificateListPage');

    if (this.cookieService.get('tokenTOMAAdmin')) {   
      this.isAdmin = true;
    } else {

    this.getCertDisplayCheck('mw_2019','63rd MidWinter Conference',"TOMA CME Cycle 18-20");
    this.getCertDisplayCheck('ttac12','TOMA/TXACOFP 12th Annual Convention',"TOMA CME Cycle 18-20");
    this.getCertDisplayCheck('mw_2020','64th MidWinter Conference',"TOMA CME Cycle 18-20");

    /* this.getCertDisplayCheck('pofps_2018','POFPS 43rd Annual CME Symposium',"POMA CME Records"); */

    }

  }

  getConferencesPage(conferenceName)
  {
      this.navCtrl.push('ConferencesPage', {
        param1: conferenceName
      });
  }


  certificatePage(conferenceName) 
  {
    // alert('conf name: ' + conferenceName);
    this.navCtrl.push('ConferencePage', {
      param1: conferenceName
    });
  }

  setCurrentUser(){
    
    //currentUserField

    //alert('currentUserField' + this.currentUser)

    this.quickCheck = 'Quick Check...'
    
//    <HTMLElement>document.getElementById(this.zBoxes[i].boxID);


    
    /* alert('var from input box: ' + <HTMLElement>document.getElementById("currentUserField").value)

    var memberAdminControl = (<HTMLInputElement>document.getElementById("member_id")).value; */

    var testUser = this.currentUser //(<HTMLInputElement>document.getElementById("currentUserField")).value;

//    alert('testUser ' + testUser)

//    var testUser = document.getElementById("currentUserField").value;


    // THIS NEEDS TO BE AN ASYNC 
    this.cookieService.set('certTestUser', testUser, 0.02083333 );

    this.getCertDisplayCheck('mw_2019','63rd MidWinter Conference',"TOMA CME Cycle 18-20");
    this.getCertDisplayCheck('ttac12','TOMA/TXACOFP 12th Annual Convention',"TOMA CME Cycle 18-20");
    this.getCertDisplayCheck('mw_2020','64th MidWinter Conference',"TOMA CME Cycle 18-20");

    this.quickCheck = ''

/*     let testUserRetrieved = this.cookieService.get('certTestUser');
        
    Promise.all([testUserRetrieved]).then((values) => {


      alert('testUser |' + values[0] + '|')

      this.getCertDisplayCheck('ca_2018','Clinical Assembly 2018',"POMA CME Records");
      this.getCertDisplayCheck('pofps_2018','POFPS 43rd Annual CME Symposium',"POMA CME Records");

      this.quickCheck = ''

    }) */



    //let certTestUser = this.cookieService.get('certTestUser');
    //alert('set test user from certificate-list: ' + testUser)
    
    /* Promise.all([certTestUser]).then((values) => {
       
      this.allowCertView = true;
      alert('Certificate User changed to: ' + certTestUser);

    }); */

    


    }

    HomePage() {
      //window.history.replaceState(null, null, window.location.pathname);
      //alert('calling manage docs HomePage');
      this.navCtrl.push('HomePage', { isDataGridReset : true });
      //resetDataGrid
      }

  getCertDisplayCheck(certVarName, certFullName, cycleCollection) {

//    console.log('certVarName |'+ certVarName + '|');
//    console.log('getCertDisplayCheck', certFullName);

//    var attendedConference = false;

    this.srk.certDisplayCheck(cycleCollection, certFullName) // change back to this.de_enc_user
    .then((data : any) =>
    {
      console.log('we have data in certs page: ' + certFullName)
      console.log('non JSON stringified data from certificate-list: ' + data)
      console.log('getCertDisplayCheck, all data ' + JSON.stringify(data))
      this[certVarName] = data; // CREATES DYNAMIC VARIABLE NAME FROM certVarName passed in
    }).catch((error : any) =>
    {
//       console.log('data error', error.message);
       this.displayAlert('Data Error', error.message, false);
    }); 
  }/*  */

  displayAlert(title      : string,
    message    : string,
    retrieve   : boolean) : void
{
let alert : any     = this._ALERT.create({
title      : title,
subTitle   : message,
buttons    : [{
text      : 'Got It!'
}]
});
alert.present();
}

}
