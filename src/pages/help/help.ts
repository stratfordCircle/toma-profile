import {Component, OnInit} from '@angular/core';
//import { ViewController, NavController, NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'help.html'
})

export class HelpPage implements OnInit {
  item;
  
  constructor(
//    private navParams: NavParams, 
//    private viewCtrl: ViewController
    )
    { 
      // private modifier is applied here so that we can use this in the cancel and done methods
    }

  ngOnInit() {
    console.log('inside help');
  }

/*   cancel() {
    this.viewCtrl.dismiss();
  }

  done() {
    this.viewCtrl.dismiss();
    // would normally want to save the changes here either with a call to a rest service or with a firebase object
  } */

}