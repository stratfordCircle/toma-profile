import { Component } from '@angular/core';
// import { CookieService } from "ngx-cookie-service";
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ConfDaysProcessesProvider } from "../../providers/conf-days-processes/conf-days-processes";
import { DatabaseProvider } from '../../providers/database/database';
import { SrkServicesProvider } from '../../providers/srk-services/srk-services';
import { CookieService } from "ngx-cookie-service";

/**
 * Generated class for the ConferencesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-conferences',
  templateUrl: 'conferences.html',
})
export class ConferencesPage {

  token_first: string;
  token_last: string; 
  token_middle: string; 
  token_Num: string; 
  token_membertype: string;
  token_suffix: string;
  token_credential: string;
  signDate = new Date(); 
  totalCredits: number = 0;
  total_1A: number = 0;
  total_1A_base: number = 0;
  total_ME_1A: number = 0;
  total_RM_1A: number = 0;
  dupSubtractFromTotal = 0;
  public collectionName: string = "TOMA CME Cycle 18-20"; // Firebase Collection
  alreadySigned: boolean = false;
  printOption: boolean = true; // when true, do not go into Print Format
  isAdmin: boolean 
    // =====================================
    associationName: string
    conferenceName: string
    longConferenceName: string
    introContent: string
    dateAndLocation: string
    endContent: string
    inquiryInfo: string
    mailTo: string

  constructor(
    public confProv: ConfDaysProcessesProvider,
    //private cookieService: CookieService,
    public navParams: NavParams,
    private _ALERT  : AlertController,
    private _DB: DatabaseProvider,
    public srk: SrkServicesProvider,
    private cookieService: CookieService) 
    {


      this.conferenceName = this.navParams.get('param1');

      console.log('what conference short name is being passed in?' + this.conferenceName)

      this.associationName = "Texas Osteopathic Medical Association"
      this.collectionName = "TOMA CME Cycle 18-20"
  
      if (this.conferenceName === "ttac12") {
        this.introContent = "TOMA provides the information below which serves as documentation for CME activity completion and should be retained for your personal records."
        this.longConferenceName = "TOMA/TXACOFP 12th Annual Convention"
        this.dateAndLocation = "June 12-16, 2019 at the Sheraton Arlington Hotel; Arlington, TX,"
  
        this.endContent = "TOMA designates this program for a maximum of 22.5 AOA Category 1A CME credits (including 3 hours of Risk Management and 3 hours of Ethics)."
        this.inquiryInfo = "If you have any questions, please contact the TOMA CME Office at (512) 708-8662 or email" 
        this.mailTo = "toma@txosteo.org"
      }
  

      if (this.conferenceName === "mw_2020") {
        this.introContent = "TOMA provides the information below which serves as documentation for CME activity completion and should be retained for your personal records."
        this.longConferenceName = "64th MidWinter Conference"
        this.dateAndLocation = "January 30 – February 2, 2020 at the Omni Mandalay Hotel in Irving, Texas,"
  
        this.endContent = "TOMA designates this activity for a maximum of 24 Category 1A AOA CME credits, including 3 Medical Ethics credits and 3 Risk Management credits. Attendees should only claim credit commensurate with the extent of their participation in the educational activity."
        this.inquiryInfo = "If you have any questions, please contact the TOMA CME Office at (512) 708-8662 or email" 
        this.mailTo = "toma@txosteo.org"
      }
 

      if (this.cookieService.get('tokenTOMAAdmin')) {   
        this.isAdmin = true;
      }

      if (this.isAdmin) {

        console.log('what the what?')
        
              srk.getMemberProfile().then((data) => {
                console.log('returned from getMemberProfile')
                this.token_credential = data[0].credential;
                //if (this.token_credential) {this.token_credential = ', ' + this.token_credential}
                this.token_first = data[0].firstName;
                this.token_last = data[0].lastName;
                this.token_middle = data[0].middleName;
                /* this.token_suffix = data[0].suffix;
                this.token_membertype = data[0].memberType;
                this.token_Num = data[0].aoa_num_enc; */
        
              });
            } else {
              srk.getProfileCookies().then((data) => {
                this.token_credential = data[0].credential;
                //if (this.token_credential) {this.token_credential = ', ' + this.token_credential}
                this.token_first = data[0].firstName;
                this.token_last = data[0].lastName;
                this.token_middle = data[0].middleName;
                this.token_suffix = data[0].suffix;
                this.token_membertype = data[0].memberType;
                this.token_Num = data[0].aoa_num_enc;
        
              });
        
            }

        this.getReportRecords();
  }

/*   ionViewDidLoad() {
    console.log('ionViewDidLoad ConferencesPage');
  } */


  getReportRecords(): void {
    console.log('in get report top');

    this.total_1A_base = 0;
    this.total_1A = 0;
    this.total_ME_1A = 0;
    this.total_RM_1A = 0;
    this.dupSubtractFromTotal = 0;

    
    this.confProv.getRecordsForCertificate(this.longConferenceName, this.collectionName).then(data => {
      if (data) {
        var i = 0;
        //var k;

        //console.log('no data IN REPORT?');

        while (data[i] !== undefined) {
//            console.log("REPORT COUNTS: " + data[i].hours);

//            hours_approved1 = parseFloat(doc.data().hours_approved1);

          this.totalCredits = this.totalCredits + parseFloat(data[i].hours);

          if (data[i].attested){
//              console.log('check for attested');
            this.alreadySigned = true;
          }

//            console.log('parseFloat(data[i].hours) ' + parseFloat(data[i].hours));

          if (!isNaN(parseFloat(data[i].hours))) {
           
//            console.log('data[i].credit_type *** ', data[i].credit_type)

           if (data[i].credit_type === "1A") 
          {
           // console.log('this.total_1A', this.total_1A);

            this.total_1A_base = this.total_1A_base + parseFloat(data[i].hours);
          } 

          if (data[i].credit_type === "ME_1A")
          {
            this.total_ME_1A = this.total_ME_1A + parseFloat(data[i].hours);
          }
          if (data[i].credit_type === "RM_1A")
          {
            this.total_RM_1A = this.total_RM_1A + parseFloat(data[i].hours);
          }
          if (data[i].credit_type === "ME_1A, RM_1A")
          {
            this.total_RM_1A = this.total_RM_1A + parseFloat(data[i].hours);
            //this.dupSubtractFromTotal = this.dupSubtractFromTotal +  parseFloat(data[i].hours);
            this.total_ME_1A = this.total_ME_1A + parseFloat(data[i].hours);
            this.dupSubtractFromTotal = this.dupSubtractFromTotal +  parseFloat(data[i].hours);
          }

          this.total_1A = this.total_1A_base + this.total_ME_1A + this.total_RM_1A - this.dupSubtractFromTotal;
        }

          i++;
        }
      } // END OF CHECK FOR DATA
    });
  }

  printPage () {
    //    console.log('this.printOption on way in after print: ' + this.printOption);
        if (this.printOption) {
        this.printOption = false;
        console.log('this.printOption: ' + this.printOption);
    
        let alert : any     = this._ALERT.create({
          title      : 'Print Certificate?',
          subTitle   : '',
          buttons    : [{
           text      : 'Yes',
           handler   : () =>
           {
            setTimeout(() => {
             window.print();
            }, 1000);
           }
         },
         {
          text: 'No',
          role: 'cancel',
          handler: () => {
            //this.refreshPage();
          }
        }
        ]
       });
       alert.present();
    
      }
      }

}
