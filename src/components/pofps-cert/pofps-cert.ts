import { Component } from '@angular/core';
// import { CookieService } from "ngx-cookie-service";
import { AlertController } from 'ionic-angular';
import { ConfDaysProcessesProvider } from "../../providers/conf-days-processes/conf-days-processes";
import { DatabaseProvider } from '../../providers/database/database';
import { SrkServicesProvider } from '../../providers/srk-services/srk-services';

@Component({
  selector: 'pofps-cert',
  templateUrl: 'pofps-cert.html'
})
export class PofpsCertComponent {

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
  total_1A_PS: number = 0;
  total_1A_OP: number = 0;
  total_1A_CA: number = 0;
  total_1B: number = 0;
  alreadySigned: boolean = false;
  printOption: boolean = true;                        // when true, do not go into Print Format
  public collectionName: string = "POMA CME Records"; // Firebase Collection
  localConferenceName : string = "POFPS 43rd Annual CME Symposium";

  constructor(
    public confProv: ConfDaysProcessesProvider,
    //private cookieService: CookieService,
    private _ALERT  : AlertController,
    private _DB: DatabaseProvider,
    public srk: SrkServicesProvider) 
    {

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
        this.getReportRecords();
  }

//  CERTIFICATE NOTES
  //  MAKE SURE IS ATTESTED BY MEMBER
  //  MAKE SURE IS APPROVED BY STAFF
  //  EXPORT EXISTING SET AND MANUALLY DO A DUPLICATE CHECK - THIS MAKES SENSE BECAUSE I NEED TO GO THROUGH THE LIST OF CHILD ABUSE APPROVALS, ANYWAY

  getReportRecords(): void {
    console.log('in get report top');

    this.total_1A_base = 0;
    this.total_1A_PS = 0;
    this.total_1A_OP = 0;
    this.total_1A_CA = 0;
    this.total_1B = 0;

    this.confProv.getRecordsForCertificate(this.localConferenceName, 'placeholder').then(data => {
      if (data) {
        var i = 0;
      //  var k;

        // console.log('no data IN REPORT?');

        while (data[i] !== undefined) {
          console.log("REPORT COUNTS: " + data[i].hours);

//            hours_approved1 = parseFloat(doc.data().hours_approved1);

          this.totalCredits = this.totalCredits + parseFloat(data[i].hours);

          if (data[i].attested){
            console.log('check for attested');
            this.alreadySigned = true;
          }

          console.log('parseFloat(data[i].hours) ' + parseFloat(data[i].hours));

          if (!isNaN(parseFloat(data[i].hours))) {

           if (data[i].credit_type === "1A") 
          {
           console.log('this.total_1A', this.total_1A);

            this.total_1A_base = this.total_1A_base + parseFloat(data[i].hours);
          } 

          if (data[i].credit_type === "PS_1A")
          {
            this.total_1A_PS = this.total_1A_PS + parseFloat(data[i].hours);
          }
          if (data[i].credit_type === "OP_1A")
          {
            this.total_1A_OP = this.total_1A_OP + parseFloat(data[i].hours);
          }
          if (data[i].credit_type === "CA_1A")
          {
            this.total_1A_CA = this.total_1A_CA + parseFloat(data[i].hours);
          }
          if (data[i].credit_type === "1B")
          {
            this.total_1B = this.total_1B + parseFloat(data[i].hours);
          }

          this.total_1A = this.total_1A_base + this.total_1A_PS + this.total_1A_OP + this.total_1A_CA;
        }

          i++;
        }
      } // END OF CHECK FOR DATA
    });
  }

  signDocument()
  {

    this.confProv.getDocumentIds(222).then(data => {
    
      if (data) {
        var i = 0;

        while (data[i] !== undefined) {
          let session_id = data[i].id;

          // return new Promise((resolve, reject) => {
            this._DB
            .updateDocument(this.collectionName, session_id, {
              attested: new Date(this.signDate)
        })

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

        this.alreadySigned = true;

      }
    });



  }

  printPage() {
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
