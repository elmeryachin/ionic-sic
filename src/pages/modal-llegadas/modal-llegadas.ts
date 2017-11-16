import {Component} from '@angular/core';
import {
  AlertController,
  IonicPage, LoadingController, NavController, NavParams, ViewController
} from 'ionic-angular';
import {ArticulosPedidosGet, ResponseListPedidos} from "../response/response-list-pedidos";
import {SicServiceProvider} from "../../providers/sic-service/sic-service";
import {GlobalResponse} from "../response/globalResponse";

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
export class ModalLlegadasPage {

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
              public loadingCtrl: LoadingController, public alertCtrl: AlertController) {

    this.listaPedidos = navParams.get('detallePedidos');
    this.tipoPeticion = navParams.get('tipoPeticion');

    if(this.tipoPeticion == 0){
      this.titulo = "Pedidos Por Llegar"
    }else{
      this.titulo = "Llegadas"
    }
    console.log(this.listaPedidos);
  }

  ionViewDidLoad() {
    this.listaPedidos = this.navParams.get('detallePedidos');
  }

  ngOnInit() {
    this.listaPedidos = this.navParams.get('detallePedidos');
    this.detallePedidos();
  }

  public detallePedidos() {
    for (let lista of this.listaPedidos.list) {
      for (let lisArt of lista.lista) {
        this.cantidadPedidos = (lisArt.cantidad * 1) + this.cantidadPedidos;
        this.precioPedidos = (lisArt.precio * 1) + this.precioPedidos;
      }
    }
  }

  public listarArticulos(item: ArticulosPedidosGet[], id: number) {
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
          buttons: ['Aceptar']
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
          subTitle: 'Se ha registrado el pedido como Llegada',
          buttons: ['Aceptar']
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
