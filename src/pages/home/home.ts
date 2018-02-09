import { Component } from '@angular/core';
import {MenuController, NavController, NavParams, ViewController} from 'ionic-angular';
import {SicServiceProvider} from "../../providers/sic-service/sic-service";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  token:string = '';
  constructor(public navCtrl: NavController,public viewCtrl: ViewController, public menu: MenuController, params: NavParams, public sicService:SicServiceProvider) {
    //this.token = navCtrl.
    menu.enable(true);
    console.log("Esto es DATA");
    console.log(params.data);
    this.token = params.data.data.token;
    console.log(this.token);
    //this.servicioTest();

  }
  ngOnInit() {
    console.log("obtiene String");
    this.sicService.getFeed("http://www.la-razon.com/rss/latest/?contentType=NWS").subscribe(data => {
      console.log(data);
    });

  }

  /*public servicioTest(){
    var url = '/articulo/hola';
    this.sicService.getGlobalToken<GlobalResponse>(url, this.token).subscribe(data => {
      console.log("Datos Prueba Token")
      console.log(data);
    });
  }*/


}
