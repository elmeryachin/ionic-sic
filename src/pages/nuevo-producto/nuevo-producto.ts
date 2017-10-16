import {Component, OnInit} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, private sicService: SicServiceProvider,
              public alertCtrl: AlertController, public toastCtrl: ToastController,
              public loadingCtrl: LoadingController) {
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
  presentAlert(titulo:string, mensaje:string) {
    const alert = this.alertCtrl.create({
      title: titulo,
      subTitle: mensaje,
      buttons: ['Aceptar']
    });
    alert.present();
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

  public buscaProducto() {
    const loading = this.loadingCtrl.create({
      content: 'Obteniendo los datos'
    });

    loading.present();
    //this.presentLoadingDefault();
    this.limpiarDatos();
    this.sicService.getArticulo(this.codigoArticulo).subscribe(
      data => {
        loading.dismiss();
        //this.dimmisLoading();
        console.log(data);
        //this.respuestaArticulo = data;
        if (data.articulo != null) {
          this.presentToast('Se ha encontrado una coincidencia');

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
    const loading = this.loadingCtrl.create({
      content: 'Registrando los datos...'
    });

    loading.present();
    if (!this.seActualiza) {
      this.sicService.addArticulo(new MdlArticulo(new ObjArticulo(this.codigoArticulo, this.descripcion,
        this.mensaje, this.precioKilo, this.pesoStock, this.precioZonaLibre, this.porcentajeGastos,
        this.montoGasto, this.precioCompra, this.precioVenta, this.precioMercado))).subscribe(
        data => {
          loading.dismiss();
          this.limpiarDatos();
          this.presentAlert('Información','Su producto fue registrado correctamente');
          return data;
        });

    } else {
      this.sicService.updateArticulo(new MdlArticulo(new ObjArticulo(this.codigoArticulo, this.descripcion,
        this.mensaje, this.precioKilo, this.pesoStock, this.precioZonaLibre, this.porcentajeGastos,
        this.montoGasto, this.precioCompra, this.precioVenta, this.precioMercado))).subscribe(
        data => {
          this.limpiarDatos();
          loading.dismiss();
          this.presentAlert('Información','Su producto fué actualizado correctamente');
          return data;
        });
    }
  }

  public eliminarArticulo() {
    const loading = this.loadingCtrl.create({
      content: 'Registrando los datos...'
    });

    loading.present();
    if (this.seActualiza) {
      console.log(this.seActualiza)
      this.sicService.deleteArticulo(this.codigoArticulo).subscribe(
        data => {
          loading.dismiss();
          this.limpiarDatos();
          this.presentAlert('Información','Su producto fué eliminado correctamente');
          return data;
        });
    }
  }
  public limpiarDatos(){
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
  }
  public listarProductos(){
    const loading = this.loadingCtrl.create({
      content: 'Listando Productos'
    });

    loading.present();



    this.sicService.listArticulos().subscribe(
      data => {
        loading.dismiss();
        let alert = this.alertCtrl.create();
        alert.setTitle('Seleccione un Item');


        for (let lista of data.lista){
          alert.addInput({
            type: 'radio',
            name: 'codigo',
            label: '' + lista.codigo + ' -- '+ lista.nombre,
            value: lista.codigo
          });
        }

        alert.addButton('Cancelar');
        alert.addButton({
          text: 'Aceptar',
          handler: (data: any) => {
            console.log('Datos Enviados:', data);
            this.codigoArticulo = data;
            this.buscaProducto();
          }
        });

        alert.present();
        return data;
      });
  }

}
