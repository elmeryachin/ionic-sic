import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
import {SicServiceProvider} from "../../providers/sic-service/sic-service";
import {ignoreElements} from "rxjs/operator/ignoreElements";
import {ResponseGetArticulo} from "../response/response-get-articulo";
import {ResponseIniPedido} from "../response/response-ini-pedido";
import {ResponseDatosProveedor} from "../response/response-datos-proveedor";

/**
 * Generated class for the PedidosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pedidos',
  templateUrl: 'pedidos.html',
})
export class PedidosPage {

  txtNumMovimiento;
  txtFecha:any;
  txtCodProveedor;
  txtDescripcion;
  txtCodArticulo;
  txtCantidadCompra:number = 0;
  txtPrecZonLib: number = 0;
  txtNomProveedor;
  txtDescripcion2;
  txtCantidadTotal;
  txtPrecioTotal;
  convertedDate = '';
  txtFechaConvert;

  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController,
              public loadingCtrl: LoadingController, private sicService: SicServiceProvider, public toastCtrl: ToastController) {
  }
  //debe obtener el ultimo numero de pedido
  public iniciarNuevoPedido(){
    this.BuscarPedido();
    //this.txtNumMovimiento = 12312; //TODO: obtener los valores
    this.txtFecha = new Date();
    if(!this.txtFechaConvert){
      this.txtFechaConvert = new Date(this.txtFecha).toISOString();
    }
    this.txtDescripcion = '';
    this.txtCodProveedor = '';
    this.txtNomProveedor = '';
    this.txtCodArticulo = '';
    this.txtCantidadCompra = 0;
    this.txtPrecZonLib = 0;
    this.txtDescripcion2 = 0;
    this.txtCantidadTotal = 0;
    this.txtPrecioTotal = 0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PedidosPage');
  }
  presentToast(mensaje:string) {
    const toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Toas Dimissed');
    });

    toast.present();
  }

  public BuscarPedido(){
    const loading = this.loadingCtrl.create({
      content: 'Obteniendo los datos'
    });
    loading.present();
    this.limpiarDatos();
    var url = '/pedido/init';
    this.sicService.getGlobal<ResponseIniPedido>(url).subscribe(data => {
      loading.dismiss();
      if (data != null) {
        if(data.respuesta) {
          this.txtNumMovimiento = data.nroMovimiento;
          this.txtFechaConvert = data.fechaMovimiento;
        }else{
          this.presentToast('No se pudo recuperar los datos solicitados.');
          this.txtNumMovimiento = 0;
        }
      }
    });
  }
  public BuscarProveedor(){
    const loading = this.loadingCtrl.create({
      content: 'Obteniendo los datos'
    });
    loading.present();
    var url = '/pedido/proveedor/quest/' + this.txtCodProveedor;
    this.sicService.getGlobal<ResponseDatosProveedor>(url).subscribe(data => {
      loading.dismiss();
      if (data != null) {
        if(data.respuesta) {
          this.txtCodProveedor = data.codigo;
          this.txtNomProveedor = data.nombre;
        }else{
          this.presentToast('No se pudo recuperar los datos solicitados.');
        }
      }
    });
  }
  private limpiarDatos(){
    this.txtNumMovimiento = 0; //TODO: obtener los valores
    this.txtFecha = new Date();
    this.txtFechaConvert = '';
    this.txtDescripcion = '';
    this.txtCodProveedor = '';
    this.txtNomProveedor = '';
    this.txtCodArticulo = '';
    this.txtCantidadCompra = 0;
    this.txtPrecZonLib = 0;
    this.txtDescripcion2 = 0;
    this.txtCantidadTotal = 0;
    this.txtPrecioTotal = 0;
  }
  accionPorLlegar() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Por Llegar',
      buttons: [
        {
          text: 'Nuevo Pedido',
          handler: () => {
            this.iniciarNuevoPedido();
          }
        },
        {
          text: 'Grabar',
          handler: () => {
            console.log('Grabar Pedido');
          }
        },{
          text: 'Localizar Pedido',
          handler: () => {
            console.log('Localizar Pedido');
          }
        },{
          text: 'Entrada - Almacen',
          handler: () => {
            console.log('Entrada Almacen');
          }
        },{
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  accionArticulo() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Artículo',
      buttons: [
        {
          text: 'Localizar',
          handler: () => {
            console.log('Localizar Artículo');
          }
        },
        {
          text: 'Estado General',
          handler: () => {
            console.log('Estado General');
          }
        },{
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelado');
          }
        }
      ]
    });
    actionSheet.present();
  }

  accionProveedor() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Proveedor',
      buttons: [
        {
          text: 'Localizar',
          handler: () => {
            console.log('Localizar Proveedor');
          }
        },
        {
          text: 'Nuevo Proveedor',
          handler: () => {
            console.log('Nuevo Proveedor');
          }
        },{
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelado');
          }
        }
      ]
    });
    actionSheet.present();
  }

  accionPedidos() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Pedidos',
      buttons: [
        {
          text: 'Hojear Por Llegar',
          handler: () => {
            console.log('Accion Por Llegar');
          }
        },
        {
          text: 'Hojear Llegadas',
          handler: () => {
            console.log('Accion Llegadas');
          }
        },{
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelado');
          }
        }
      ]
    });
    actionSheet.present();
  }

}
