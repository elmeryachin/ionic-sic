import { Component } from '@angular/core';
import {MenuController, NavController, NavParams, ViewController} from 'ionic-angular';
import {LoginPage} from "../login/login";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  token:string = '';
  constructor(public navCtrl: NavController,public viewCtrl: ViewController, public menu: MenuController, params: NavParams ) {
    //this.token = navCtrl.
    menu.enable(true);
    this.token = params.data.token;
  }


}
