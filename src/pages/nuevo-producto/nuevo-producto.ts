import {Component, OnInit, ViewChild} from '@angular/core';
import {
  ActionSheetController, AlertController, FabContainer, IonicPage, LoadingController, NavController, NavParams,
  ToastController
} from 'ionic-angular';
import {MdlArticulo} from "../model/mdl-articulo";
import {ObjArticulo} from "../clases/obj-articulo";
import {SicServiceProvider} from "../../providers/sic-service/sic-service";
import {Ambientes, ResponseExistences} from "../response/response-existences";
import {RequestPedidosLista} from "../request/RequestPedidosLista";
import {ResponseListArticulotr} from "../response/response-list-articulotr";
import {QRScanner, QRScannerStatus} from "@ionic-native/qr-scanner";
import {ResponseGetArticuloPr} from "../response/response-get-articulo-pr";
import {RequestProductoPatron} from "../response/response-list-articulotr";

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
  precioKilo:number = null;
  pesoStock:number = null;
  precioZonaLibre:number = null;
  porcentajeGastos:number = null;
  montoGasto:number = null;
  precioCompra:number = null;
  precioMercado:number = null;
  precioVenta:number = null;
  seActualiza: boolean;
  mensaje;
  mostrarExistencias = false;
  respuestaExistencias:ResponseExistences = new ResponseExistences(null,true,"");
  mdlAmbiente:Ambientes[] = new Array();
  url:string = 'http://localhost:8080';
  codBarras:string;
  classNuevo: boolean = false;
  @ViewChild('idCodigoArticulo') idCodigoArticulo;
  @ViewChild('idDescripcion') idDescripcion;
  @ViewChild('idPrecioKilo') idPrecioKilo;
  @ViewChild('idPesoStock') idPesoStock;
  @ViewChild('idPrecioZonaLibre') idPrecioZonaLibre;
  @ViewChild('idPorcentajeGastos') idPorcentajeGastos;
  @ViewChild('idMontoGasto') idMontoGasto;
  @ViewChild('idPrecioCompra') idPrecioCompra;
  @ViewChild('idPrecioVenta') idPrecioVenta;
  @ViewChild('idPrecioMercado') idPrecioMercado;
  @ViewChild('idMensaje') idMensaje;
  constructor(public navCtrl: NavController, public navParams: NavParams, private sicService: SicServiceProvider,
              public alertCtrl: AlertController, public toastCtrl: ToastController,
              public loadingCtrl: LoadingController, public actionSheetCtrl: ActionSheetController, public qrScanner: QRScanner) {
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
      console.log('Toast Dimissed');
    });

    toast.present();
  }

  ngOnInit() {
    setTimeout(() => {
      this.idCodigoArticulo.setFocus();
    },150);
    this.seActualiza = false;

  }
  public round(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  };

  public calculaPrecioFinal() {
    this.mostrarExistencias = false;
    this.montoGasto = (this.porcentajeGastos * this.precioZonaLibre) / 100;
    this.montoGasto = this.round(this.montoGasto,2);


    this.precioCompra = (this.precioKilo * this.pesoStock) + (this.precioZonaLibre * 1) + (this.montoGasto*1);
    this.precioCompra = this.round(this.precioCompra,2)
  }

  public escanearCodigo(){
    // Optionally request the permission early
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        console.log("Antes de consultar: " +status.authorized);
        if (status.authorized) {
          // camera permission was granted
          console.log("status OK")
          console.log(status)
          // start scanning
          let scanSub = this.qrScanner.scan().subscribe((text) => {
            console.log('Scanned something', text);

            this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning

          });

          // show camera preview
          this.qrScanner.show();

          // wait for user to scan something, then the observable callback will be called

        } else if (status.denied) {
          console.log("Status dennied: " +status.denied);
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          console.log("Status dennied2");
          console.log(status);
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log('Error is: ', e));
  }

  ionViewDidLeave() {
    window.document.querySelector('ion-app').classList.remove('transparentBody')
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NuevoProductoPage');
    setTimeout(() => {
      this.idCodigoArticulo.setFocus();
    },150);
  }

  ionViewLoaded() {

    setTimeout(() => {
      this.idCodigoArticulo.setFocus();
    },150);

  }

  public onKey(event:any){
    if(this.codigoArticulo) {
      this.codigoArticulo = this.codigoArticulo.toUpperCase();
    }
  }

  public infoProducto(){
    this.limpiarDatos();
    this.classNuevo = false;

    if(this.codigoArticulo==null?false:this.codigoArticulo == 'undefined'?false:(this.codigoArticulo.valueOf().length > 0)) {
      let len = this.codigoArticulo.valueOf().split('%').length;
      if(len == 1) {
        let _url = '/pedido/articulo/quest/' + this.codigoArticulo;
        this.sicService.getGlobal<ResponseGetArticuloPr>(_url).subscribe(data => {
          if (data.respuesta) {
            this.buscaProducto();
          } else {
            this.descripcion = null;//"NO EXISTE PRODUCTO CON EL PATRON INGRESADO";
            this.classNuevo = true;
            this.idDescripcion.setFocus();
          }
        });
      } else {
        let _url = '/pedido/articulo/list/';
        let _in: RequestProductoPatron = new RequestProductoPatron("");
        _in.patron = this.codigoArticulo;
        this.sicService.postGlobal<ResponseListArticulotr>(_in, _url).subscribe(data => {

          if (data.respuesta) {

            if (data.list.length == 0) {
              this.descripcion = null;//"NO EXISTE PRODUCTO(S) CON EL PATRON INGRESADO";
              this.classNuevo = true;
            } else {

              let check: boolean = true;
              let alert = this.alertCtrl.create();
              alert.setTitle('Resultados');

              for (let item of data.list) {
                alert.addInput({
                  type: 'radio',
                  label: item.codigo + ' -- ' + item.nombre,
                  value: item.codigo,
                  checked: check
                });
                check = false
              }

              alert.addButton({
                text: 'Cancelar',
                handler: (data:any) => {
                  setTimeout(() => {
                    this.idCodigoArticulo.setFocus();
                  },150);
                }
              });
              alert.addButton({
                text: 'Aceptar',
                handler: (data: any) => {
                  if (data != undefined) {
                    console.log('Datos Enviados:', data);
                    this.codigoArticulo = data;
                    this.infoProducto();
                    setTimeout(() => {
                      this.idCodigoArticulo.setFocus();
                    },150);
                  }
                }
              });
              alert.present();
            }
          } else {
            console.log('Error al ejecutar ' + _url)
          }
        });
        console.log('Finalizando.... ')
      }
    } else {
      this.codigoArticulo = null;
      this.descripcion = null;
      //completar
    }
  }

  public infoDescripcion(){
    this.idPrecioKilo.setFocus();
  }

  public infoPrecioKilo() {
    this.idPesoStock.setFocus();

  }

  public infoPesoStock() {
    this.idPrecioZonaLibre.setFocus();
  }

  public inforPrecioZonaLibre() {
    this.idPorcentajeGastos.setFocus();
  }

  public infoPorcentajeGastos() {
    this.idPrecioVenta.setFocus();
  }

  /*public infoMontoGasto(){
    this.idPrecioCompra.setFocus();
  }

  public infoPrecioCompra(){
    this.idPrecioVenta.setFocus();
  }*/

  public infoPrecioVenta(){
    this.idPrecioMercado.setFocus();
  }

  public infoPrecioMercado(){
    this.idMensaje.setFocus();
  }

  public infoMensaje(){
    this.confirmarGuardado(null);
  }
  public buscaProducto() {
    this.mostrarExistencias = true;
    const loading = this.loadingCtrl.create({
      content: 'Obteniendo los datos'
    });

    //loading.present();
    if(this.codigoArticulo.trim()== 0){
      //loading.dismiss();
      this.presentToast("El valor de articulo no es correcto");
      return;
    }
    //this.presentLoadingDefault();
    this.limpiarDatos();
    this.sicService.getArticulo(this.codigoArticulo.toUpperCase()).subscribe(
      data => {
        loading.dismiss();
        //this.dimmisLoading();

        //this.respuestaArticulo = data;
        if (data.articulo != null) {
          this.seActualiza = true;
          this.descripcion = data.articulo.nombre;
          this.precioKilo = this.round(data.articulo.precioKilo,2);
          this.pesoStock = this.round(data.articulo.peso,2);
          this.precioZonaLibre = this.round(data.articulo.precioZonaLibre,2);
          this.porcentajeGastos = this.round(data.articulo.porcentajeGasto,2);
          this.precioCompra = this.round(data.articulo.precioCompra,2);
          this.precioMercado = this.round(data.articulo.precioMercado,2);
          this.precioVenta = this.round(data.articulo.precioVenta,2);
          this.montoGasto = (this.porcentajeGastos * this.precioZonaLibre) / 100;
          this.montoGasto = this.round(this.montoGasto,2);
          this.mensaje = data.articulo.descripcion;
          this.idDescripcion.setFocus();
          this.sicService.getGlobal<ResponseExistences>("/inventario/articulo/"+this.codigoArticulo+"/existence").subscribe(
            data2 => {
              this.respuestaExistencias = data2;
              console.log(this.respuestaExistencias.respuesta);
              if(this.respuestaExistencias.respuesta) {
                this.mdlAmbiente = this.respuestaExistencias.list;
              }else{
                this.mdlAmbiente = new Array();
              }

            },error=>{
              this.presentToast("Error al obtener los datos.");
            });
        }else{
          console.log("ingresa articulo nulo");
          this.mdlAmbiente = new Array();
        }
      },
      error =>{
        loading.dismiss();
        this.presentToast("Error al obtener los datos");
      });
  }

  public confirmarGuardado(fab: FabContainer){
    if(fab!=null)
      fab.close();
    let confirm = this.alertCtrl.create({
      title: 'Alerta Nuevo/Actualizacion de Articulos',
      message: 'Desea ' + (this.seActualiza?'actualizar':'guardar') + ' el articulo '+this.codigoArticulo+'?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            console.log('Agree clicked');
            this.guardarArticulo();
          }
        }
      ]
    });
    confirm.present();
  }

  public guardarArticulo() {
    this.mostrarExistencias = false;
    const loading = this.loadingCtrl.create({
      content: 'Registrando los datos...'
    });

    loading.present();
    if(this.codigoArticulo != undefined){
      this.codigoArticulo.toUpperCase()
    }else{
      loading.dismiss();
    let alert;
        alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: 'Debe ingresar los datos solicitados.',
          buttons: ['Aceptar']
        });
        alert.present();
        return;

    }
    if (!this.seActualiza) {
      this.sicService.addArticulo(new MdlArticulo(new ObjArticulo(this.codigoArticulo, this.descripcion,
        this.mensaje, this.precioKilo, this.pesoStock, this.precioZonaLibre, this.porcentajeGastos,
        this.montoGasto, this.precioCompra, this.precioVenta, this.precioMercado))).subscribe(
        data => {
          loading.dismiss();
          //this.limpiarDatos();
          this.presentAlert('Información','Su producto fue registrado correctamente');
          console.log('respuesta al guardar ADD ' + data);
          this.classNuevo = false;
          this.buscaProducto();
          this.mdlAmbiente = new Array();
          return data;
        }, error =>{
          let alert;
          loading.dismiss();
          alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: 'Error al guardar el articulo.',
            buttons: ['Aceptar']
          });
          alert.present();
          return;
        });

    } else {
      this.sicService.updateArticulo(new MdlArticulo(new ObjArticulo(this.codigoArticulo.toUpperCase(), this.descripcion,
        this.mensaje, this.precioKilo, this.pesoStock, this.precioZonaLibre, this.porcentajeGastos,
        this.montoGasto, this.precioCompra, this.precioVenta, this.precioMercado))).subscribe(
        data => {
          //this.limpiarDatos();
          loading.dismiss();
          this.presentAlert('Información','Su producto fué actualizado correctamente');
          return data;
        }, error =>{
          let alert;
          loading.dismiss();
          alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: 'Error al actualizar el articulo',
            buttons: ['Aceptar']
          });
          alert.present();
          return;
        });
    }
  }

  public confirmarEliminado(fab: FabContainer){
    fab.close();
    let confirm = this.alertCtrl.create({
      title: 'Alerta',
      message: 'Desea eliminar el articulo?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            console.log('Agree clicked');
            this.eliminarArticulo();
          }
        }
      ]
    });
    confirm.present();
  }

  public eliminarArticulo() {
    this.mostrarExistencias = false;
    const loading = this.loadingCtrl.create({
      content: 'Registrando los datos...'
    });

    loading.present();
    console.log(this.seActualiza);
    if (this.seActualiza) {
      console.log(this.seActualiza)
      this.sicService.deleteArticulo(this.codigoArticulo).subscribe(
        data => {
          loading.dismiss();
          this.limpiarDatos();
          this.presentAlert('Información','Su producto fué eliminado correctamente');
          return data;
        }, error=>{
          loading.dismiss();
          this.presentToast("Error al eliminar los datos.");
      });
    }else {
      loading.dismiss();
      this.presentToast("Error al eliminar los datos.");
    }
  }

  public limpiarDatos(){
    this.mostrarExistencias = false;
    this.seActualiza = false;
    this.descripcion = '';
    this.precioKilo = null;
    this.pesoStock = null;
    this.precioZonaLibre = null;
    this.porcentajeGastos = null;
    this.precioCompra = null;
    this.precioMercado = null;
    this.precioVenta = null;
    this.mensaje = '';
    this.montoGasto = null;
    this.mdlAmbiente = null;
  }

  public listarProductos(){
    this.mostrarExistencias = false;
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
      },error =>{
        loading.dismiss();
        this.presentToast("Error al obtener los datos.");
      });
  }

  public reportesPedidos(fab: FabContainer){
    fab.close();
    this.mostrarExistencias = false;
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Reportes',
      buttons: [
        {
          text: 'Stock PDF',
          handler: () => {
            console.log('Destructive clicked');
            window.open(this.url + "/reporte/stock/pdf/download", "_blank");
          }
        },
        {
          text: 'Stock Excel',
          handler: () => {
            console.log('Destructive clicked');
            window.open(this.url + "/reporte/stock/xls/download", "_blank");
          }
        },
        {
          text: 'Existencias PDF',
          handler: () => {
            console.log('Archive clicked');
           // /reporte/existencia/{formato}/download
            window.open(this.url + "/reporte/existencia/pdf/download", "_blank");
          }
        },
        {
          text: 'Existencias Excel',
          handler: () => {
            console.log('Archive clicked');
            window.open(this.url + "/reporte/existencia/xls/download", "_blank");
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

  public filtrarArticulo(fab: FabContainer){
    fab.close();
    let alert = this.alertCtrl.create();
    alert.setTitle("Buscar Articulo");
    alert.setMessage("Ingrese el codigo de articulo.");
    alert.addInput({
      type: 'text',
      placeholder:'Buscar',
      name:'txtBuscaArticulo',
      id:'txtBuscaArticulo'
    });
    alert.addButton('Cancelar');
    alert.addButton({
      text: 'Buscar',
      handler: data => {
        console.log(data.toString());
        const loading = this.loadingCtrl.create({
          content: 'Listando Productos'
        });
        loading.present();
        if(data.txtBuscaArticulo.trim().toUpperCase() == '%' || data.txtBuscaArticulo.trim().toUpperCase() == '%%'){
          this.presentToast("Debe ingresar un codigo");
          loading.dismiss();
          return;
        }
        var urlListaProveedor = '/articulo/list';
        let requestArticulo:RequestPedidosLista = new RequestPedidosLista("");
        requestArticulo.patron = data.txtBuscaArticulo.trim().toUpperCase();
        this.sicService.postGlobal<ResponseListArticulotr>(requestArticulo, urlListaProveedor).subscribe(data2 => {
          loading.dismiss();
          console.log("data:2");
          console.log(data2);
          let alertInterno = this.alertCtrl.create();
          alertInterno.setTitle('Resultados');
          if(data2.respuesta){
            console.log("respuesta ok")
            let check:boolean = true;


            for(let item of data2.lista){
              console.log("lista")
              alertInterno.addInput({
                type: 'radio',
                label: item.codigo + '-' + item.nombre,
                value: item.codigo,
                checked: check
              });
              check = false
            }



          }else{
            alertInterno.addInput({
              type: 'text',
              label: data2.mensaje,
              value: data2.mensaje,
              disabled : true
            });
          }
          alertInterno.addButton('Cancelar');
          alertInterno.addButton({
            text: 'Aceptar',
            handler: (data: any) => {
              if(data != undefined){
                console.log('Datos Enviados:', data);
                this.codigoArticulo = data.toUpperCase();
                this.buscaProducto();
              }
            }
          });
          alertInterno.present();
        },error =>{
          loading.dismiss();
          this.presentToast("Error al obtener los datos");
        });
      }
    });

    alert.present();
  }

}
