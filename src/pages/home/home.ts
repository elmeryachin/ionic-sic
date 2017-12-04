import { Component } from '@angular/core';
import {MenuController, NavController, NavParams, ViewController} from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  token:string = '';
  constructor(public navCtrl: NavController,public viewCtrl: ViewController, public menu: MenuController, params: NavParams ) {
    //this.token = navCtrl.
    menu.enable(true);
    console.log(params.data);
    this.token = params.data.token;
  }


}
