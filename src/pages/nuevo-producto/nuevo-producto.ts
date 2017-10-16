import {Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {MdlArticulo} from "../model/mdl-articulo";
import {ObjArticulo} from "../clases/obj-articulo";
import {SicServiceProvider} from "../../providers/sic-service/sic-service";

/**
 * Generated class for the NuevoProductoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-nuevo-producto',
  templateUrl: 'nuevo-producto.html',
})
export class NuevoProductoPage implements OnInit {

  codigoArticulo;
  descripcion;
  precioKilo = 0;
  pesoStock = 0;
  precioZonaLibre = 0;
  porcentajeGastos = 0;
  montoGasto = 0;
  precioCompra = 0;
  precioMercado = 0;
  precioVenta = 0;
  seActualiza: boolean;
  mensaje;
  constructor(public navCtrl: NavController, public navParams: NavParams, private sicService: SicServiceProvider) {
  }
  ngOnInit() {
    this.seActualiza = false;

  }
  public calculaPrecioFinal() {
    this.montoGasto = (this.porcentajeGastos * this.precioZonaLibre) / 100;
    this.precioCompra = (this.precioKilo * this.pesoStock) + this.precioZonaLibre + this.montoGasto;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad NuevoProductoPage');
  }
  public buscaProducto() {
    this.seActualiza = false;
    this.descripcion = '';
    this.precioKilo = 0;
    this.pesoStock = 0;
    this.precioZonaLibre = 0;
    this.porcentajeGastos = 0;
    this.precioCompra = 0;
    this.precioMercado = 0;
    this.precioVenta = 0;
    this.mensaje = '';
    this.montoGasto = 0;
    this.sicService.getArticulo(this.codigoArticulo).subscribe(
      data => {
        console.log(data);
        //this.respuestaArticulo = data;
        if (data.articulo != null) {
          this.seActualiza = true;
          this.descripcion = data.articulo.nombre;
          this.precioKilo = data.articulo.precioKilo;
          this.pesoStock = data.articulo.peso;
          this.precioZonaLibre = data.articulo.precioZonaLibre;
          this.porcentajeGastos = data.articulo.porcentajeGasto;
          this.precioCompra = data.articulo.precioCompra;
          this.precioMercado = data.articulo.precioMercado;
          this.precioVenta = data.articulo.precioVenta;
          this.montoGasto = (this.porcentajeGastos * this.precioZonaLibre) / 100;
          this.mensaje = data.articulo.descripcion;
        }
      });
  }

  public guardarArticulo() {
    if (!this.seActualiza) {
      this.sicService.addArticulo(new MdlArticulo(new ObjArticulo(this.codigoArticulo, this.descripcion,
        this.mensaje, this.precioKilo, this.pesoStock, this.precioZonaLibre, this.porcentajeGastos,
        this.montoGasto, this.precioCompra, this.precioVenta, this.precioMercado)));
    } else {
      this.sicService.updateArticulo(new MdlArticulo(new ObjArticulo(this.codigoArticulo, this.descripcion,
        this.mensaje, this.precioKilo, this.pesoStock, this.precioZonaLibre, this.porcentajeGastos,
        this.montoGasto, this.precioCompra, this.precioVenta, this.precioMercado)));
    }
  }

  public eliminarArticulo() {
    if (this.seActualiza) {
      console.log(this.seActualiza)
      this.sicService.deleteArticulo(this.codigoArticulo);
    }
  }

}
