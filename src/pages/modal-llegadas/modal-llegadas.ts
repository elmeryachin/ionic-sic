import { Component } from '@angular/core';
import {
  IonicPage, NavController, NavParams, ViewController
} from 'ionic-angular';
import {ArticulosPedidosGet, ResponseListPedidos} from "../response/response-list-pedidos";

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

  listaPedidos:ResponseListPedidos;
  listaArticulosPorPedido: ArticulosPedidosGet[];
  cantidadPedidos:number = 0;
  precioPedidos:number = 0;

  cantidadTotalPedido:number = 0;
  precioTotalPedido:number = 0;
  precioTotalCompra:number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.listaPedidos = navParams.get('detallePedidos');
    console.log(this.listaPedidos);
  }

  ionViewDidLoad() {
    this.listaPedidos = this.navParams.get('detallePedidos');
  }
  ngOnInit() {
    this.listaPedidos = this.navParams.get('detallePedidos');
    this.detallePedidos();
  }
  public detallePedidos(){
    for (let lista of this.listaPedidos.list){
      for(let lisArt of lista.lista){
        this.cantidadPedidos = (lisArt.cantidad*1) + this.cantidadPedidos;
        this.precioPedidos = (lisArt.precio * 1) + this.precioPedidos;
      }
    }
  }

  public listarArticulos(item:ArticulosPedidosGet[]){
    this.listaArticulosPorPedido = item;
    for (let lista of this.listaArticulosPorPedido){
      this.precioTotalPedido = (lista.precio * 1) + this.precioTotalPedido;
      this.cantidadTotalPedido = (lista.cantidad * 1) + this.cantidadTotalPedido;
      //TODO: falta para precioTotalCompra;
    }
  }
}
