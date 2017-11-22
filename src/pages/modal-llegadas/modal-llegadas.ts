import {Component, OnDestroy} from '@angular/core';
import {
  AlertController,
  IonicPage, LoadingController, NavController, NavParams, ToastController
} from 'ionic-angular';
import {ArticulosPedidosGet, DatosPedidos, ResponseListPedidos} from "../response/response-list-pedidos";
import {SicServiceProvider} from "../../providers/sic-service/sic-service";
import {GlobalResponse} from "../response/globalResponse";
import {DataShareProvider} from "../../providers/data-share/data-share";
import { Location } from '@angular/common';

/**
 * Generated class for the ModalLlegadasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-llegadas',
  templateUrl: 'modal-llegadas.html',
})
export class ModalLlegadasPage implements OnDestroy {


  listaPedidos: ResponseListPedidos;
  listaArticulosPorPedido: ArticulosPedidosGet[];
  cantidadPedidos: number = 0;
  precioPedidos: number = 0;

  cantidadTotalPedido: number = 0;
  precioTotalPedido: number = 0;
  precioTotalCompra: number = 0;

  idPedido: number = 0;
  tipoPeticion :number;
  titulo: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private sicService: SicServiceProvider,
              public loadingCtrl: LoadingController, public alertCtrl: AlertController, public toastCtrl: ToastController,
              public sharedService: DataShareProvider, public location: Location) {
    this.listaPedidos = navParams.get('detallePedidos');
    this.tipoPeticion = navParams.get('tipoPeticion');

    if(this.tipoPeticion == 0){
      this.titulo = "Pedidos Por Llegar"
    }else{
      this.titulo = "Llegadas"
    }
    //console.log(this.listaPedidos);
  }

  ionViewDidLoad() {
    this.listaPedidos = this.navParams.get('detallePedidos');
  }

  ngOnInit() {
    this.listaPedidos = this.navParams.get('detallePedidos');
    this.detallePedidos();
  }

  public limpiarPedidos(){
    this.listaArticulosPorPedido = null;
    this.cantidadPedidos= 0;
    this.precioPedidos= 0;
    this.cantidadTotalPedido= 0;
    this.precioTotalPedido= 0;
    this.precioTotalCompra= 0;
    this.idPedido= 0;
  }
  public detallePedidos() {
    for (let lista of this.listaPedidos.list) {
      for (let lisArt of lista.lista) {
        this.cantidadPedidos = (lisArt.cantidad * 1) + this.cantidadPedidos;
        this.precioPedidos = (lisArt.precio * 1) + this.precioPedidos;
      }
    }
  }

  public listarArticulos(item: ArticulosPedidosGet[], id: number, articuloSolicitado: DatosPedidos) {
    //console.log(articuloSolicitado);
    this.sharedService.setData(articuloSolicitado);
    this.precioTotalPedido = 0;
    this.cantidadTotalPedido = 0;
    this.idPedido = id;
    this.listaArticulosPorPedido = item;
    for (let lista of this.listaArticulosPorPedido) {
      this.precioTotalPedido = (lista.precio * 1) + this.precioTotalPedido;
      this.cantidadTotalPedido = (lista.cantidad * 1) + this.cantidadTotalPedido;
      //TODO: falta para precioTotalCompra;
    }
  }
  public confirmarAccion() {
    let alert = this.alertCtrl.create({
      title: 'Confirmar',
      message: 'Está seguro que quiere realizar la operación?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.guardarPedido();
          }
        }
      ]
    });
    alert.present();
  }
  public guardarPedido() {
    if (this.idPedido === 0) {
      let mostrarAlert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Debe seleccionar un pedido.',
        buttons: ['Aceptar']
      });
      mostrarAlert.present();
      return;
    }

    const loading = this.loadingCtrl.create({
      content: 'Obteniendo los datos'
    });
    loading.present();
    var id = this.idPedido + '';
    var url = '/pedido/llegada/confirmar/';
    this.sicService.putGlobal<GlobalResponse>(null, url, id).subscribe(data => {
      loading.dismiss();
      let alert;
      if (data.respuesta) {
        alert = this.alertCtrl.create({
          title: 'Pedidos',
          subTitle: 'Se ha registrado el pedido como Llegada',
          buttons: [{
            text: 'Aceptar',
            handler: () => {
              this.limpiarPedidos();
              this.detallarPedidos();

            }
          }]
        });
        alert.present();
      } else {
        alert = this.alertCtrl.create({
          title: 'Ups',
          subTitle: data.mensaje,
          buttons: ['Aceptar']
        });
        alert.present();
        return;
      }
    });
  }
  public confirmarEliminar() {
    let alert = this.alertCtrl.create({
      title: 'Confirmar',
      message: 'Está seguro que quiere realizar la operación?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.eliminarPedido();
          }
        }
      ]
    });
    alert.present();
  }
  public eliminarPedidoLlegado(){
    let alert = this.alertCtrl.create({
      title: 'Confirmar',
      message: 'Está seguro que quiere realizar la operación?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            if (this.idPedido === 0) {
              let mostrarAlert = this.alertCtrl.create({
                title: 'Error',
                subTitle: 'Debe seleccionar un pedido.',
                buttons: ['Aceptar']
              });
              mostrarAlert.present();
              return;
            }

            const loading = this.loadingCtrl.create({
              content: 'Obteniendo los datos'
            });
            loading.present();
            var id = this.idPedido + '';
            console.log(id);
            var url = '/pedido/llegada/cancelar/';
            this.sicService.putGlobal<GlobalResponse>(null,url,id).subscribe(data => {
              loading.dismiss();
              let alert;
              if (data.respuesta) {

                alert = this.alertCtrl.create({
                  title: 'Pedidos',
                  subTitle: 'El pedido ha sido eliminado correctamente.',
                  buttons: [{
                    text: 'Aceptar',
                    handler: () => {
                      this.limpiarPedidos();
                      this.detalleLlegadas();

                    }
                  }]
                });
                alert.present();

              } else {
                alert = this.alertCtrl.create({
                  title: 'Ups',
                  subTitle: data.mensaje,
                  buttons: ['Aceptar']
                });
                alert.present();
                return;
              }
            });
          }
        }
      ]
    });
    alert.present();
  }
  public eliminarPedido(){
    if (this.idPedido === 0) {
      let mostrarAlert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Debe seleccionar un pedido.',
        buttons: ['Aceptar']
      });
      mostrarAlert.present();
      return;
    }

    const loading = this.loadingCtrl.create({
      content: 'Obteniendo los datos'
    });
    loading.present();
    var id = this.idPedido + '';
    var url = '/pedido/delete/';
    this.sicService.deleteGlobal<GlobalResponse>(id, url).subscribe(data => {
      loading.dismiss();
      let alert;
      if (data.respuesta) {

        alert = this.alertCtrl.create({
          title: 'Pedidos',
          subTitle: 'El pedido ha sido eliminado correctamente.',
          buttons: [{
            text: 'Aceptar',
            handler: () => {
              this.limpiarPedidos();
              this.detallarPedidos();

            }
          }]
        });
        alert.present();

      } else {
        alert = this.alertCtrl.create({
          title: 'Ups',
          subTitle: data.mensaje,
          buttons: ['Aceptar']
        });
        alert.present();
        return;
      }
    });
  }
  public detalleLlegadas() {
    const loading = this.loadingCtrl.create({
      content: 'Listando Productos'
    });
    loading.present();
    var urlListaProveedor = '/pedido/llegada/list';
    this.sicService.getGlobal<ResponseListPedidos>(urlListaProveedor).subscribe(
      data => {
        console.log(data);
        loading.dismiss();
        if (data.respuesta) {
          this.listaPedidos = data;
          this.navCtrl.push(ModalLlegadasPage, {
            detallePedidos: this.listaPedidos,
            tipoPeticion: 1
          });
        } else {
          this.presentToast('No se pudo recuperar los datos solicitados.');
        }
      });
  }

  public detallarPedidos(){
    const loading = this.loadingCtrl.create({
      content: 'Listando Productos'
    });
    loading.present();
    var urlListaProveedor = '/pedido/list';
    this.sicService.getGlobal<ResponseListPedidos>(urlListaProveedor).subscribe(
      data => {
        console.log(data);
        loading.dismiss();
        if(data.respuesta) {
          this.listaPedidos = data;
        }else{
          this.presentToast('No se pudo recuperar los datos solicitados.');
        }
      });
  }
  public presentToast(mensaje:string) {
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
  ngOnDestroy(): void {
    console.log("Objeto Destruido");
  }
}
