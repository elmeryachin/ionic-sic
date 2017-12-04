import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, MenuController, NavController, NavParams} from 'ionic-angular';
import {HomePage} from "../home/home";
import {SicServiceProvider} from "../../providers/sic-service/sic-service";
import {Device} from '@ionic-native/device';
import {RequestLogin} from "../request/request-login";
import {ResponseLogin} from "../response/response-login";
import {TokenShareProvider} from "../../providers/token-share/token-share";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  txtUsuario = "";
  txtPassword = "";
  appName = "AppMovil";
  appKey = "12e23o33e488x033o";
  constructor(public navCtrl: NavController, public navParams: NavParams, public menu: MenuController,
              private sicService: SicServiceProvider, public loadingCtrl: LoadingController,
              public alertCtrl: AlertController, private device: Device,public tokenShare: TokenShareProvider) {
    menu.enable(false);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  iniciaSesion(){
    //this.navCtrl.
    const loading = this.loadingCtrl.create({
      content: 'Iniciando Sessión'
    });
    loading.present();
    let requestPedido:RequestLogin = new RequestLogin(this.txtUsuario, this.txtPassword,this.appName,this.appKey, this.device.platform + " " + this.device.model);
    var url = '/acceso/login';
    this.sicService.postGlobal<ResponseLogin>(requestPedido, url).subscribe( data =>{
      console.log(data);
      loading.dismiss();
      let alert;
      if(data.respuesta){
        this.tokenShare.setData(data);
        this.navCtrl.setRoot(HomePage,{data});
      }else{
        alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: data.mensaje,
          buttons: ['Aceptar']
        });
        alert.present();
        return;
      }
    });


  }
}
