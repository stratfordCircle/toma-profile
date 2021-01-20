import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CertificateListPage } from './certificate-list';
import { ConferencePage } from './../conference/conference';

@NgModule({
  declarations: [
    CertificateListPage,
  ],
  imports: [
    IonicPageModule.forChild(CertificateListPage),
  ],
})
export class CertificateListPageModule {}
