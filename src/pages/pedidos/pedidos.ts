import {Component, OnDestroy, OnInit, ViewChild, OnChanges, DoCheck, SimpleChanges} from '@angular/core';
import {
  AlertController, FabContainer, IonicPage, LoadingController, ModalController, NavController, NavParams,
  ToastController
} from 'ionic-angular';
import {ActionSheetController} from 'ionic-angular';
import {SicServiceProvider} from "../../providers/sic-service/sic-service";
import {ResponseIniPedido} from "../response/response-ini-pedido";
import {ResponseDatosProveedor, ResponseListProveedor} from "../response/response-datos-proveedor";
import {ResponseListaProveedor} from "../response/response-lista-proveedor";
import {ResponseGetArticuloPr} from "../response/response-get-articulo-pr";
import {ResponseListArticulotr, RequestProductoPatron} from "../response/response-list-articulotr";
import {ArticuloPedido, Pedido, RequestPedido, ResponsePedido} from "../request/request-pedido";
import {ResponseAddPedido} from "../response/response-add-pedido";
import {ModalLlegadasPage} from "../modal-llegadas/modal-llegadas";
import {ArticulosPedidosGet, DatosPedidos, ResponseListPedidos} from "../response/response-list-pedidos";
import {RequestProveedor} from "../request/request-proveedor";
import {GlobalResponse} from "../response/globalResponse";
import {DataShareProvider} from "../../providers/data-share/data-share";
import {Subscription} from "rxjs/Subscription";
import {RequestPedidosLista} from "../request/RequestPedidosLista";
import {Ambientes, ResponseExistences} from "../response/response-existences";
var Mousetrap = require('mousetrap');
var Mousetrap_global = require('mousetrap-global-bind');
var PHE = require("print-html-element");
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
export class PedidosPage implements OnDestroy, OnInit, OnChanges, DoCheck {

  txtNumMovimiento;
  txtFecha: any;
  txtCodProveedor;
  txtDescripcion;
  txtCodArticulo;
  txtCantidadCompra: number = null;
  txtPrecZonLib: number = null;
  txtNomProveedor;
  txtDescripcion2;
  txtCantidadTotal;
  txtPrecioTotal;
  convertedDate = '';
  txtFechaConvert;
  listadoInPedidos: ArticuloPedido[];
  pedidosGuardados: RequestPedido;
  pedidoInsertado: ResponsePedido;
  idPedidoRecuperado: number = null;
  listaPedidos: ResponseListPedidos;
  listaArticulosPorPedido: ArticulosPedidosGet[];
  cantidadPedidos: number = 0;
  precioPedidos: number = 0;

  cantidadTotalPedido: number = 0;
  precioTotalPedido: number = 0;
  precioTotalCompra: number = 0;

  pedidoBack: DatosPedidos;
  url:string = 'http://localhost:8080';

  message: any;
  subscription: Subscription;
  jsonConvert: any;

  classIncorrecto: boolean = false;
  classIncorrectoPro: boolean = false;
  mostrarExistencias: boolean = false;
  respuestaExistencias:ResponseExistences = new ResponseExistences(null,true,"");
  mdlAmbiente:Ambientes[] = new Array();
  @ViewChild('idCodigoArticulo') idCodigoArticulo;
  @ViewChild('itemCodArt') itemCodArt;
  @ViewChild('cantidadCompra') cantidadCompra;
  @ViewChild('idTxtProveedor') idTxtProveedor;
  @ViewChild('idTxtPrecZonLib') idTxtPrecZonLib;

  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController,
              public loadingCtrl: LoadingController, private sicService: SicServiceProvider, public toastCtrl: ToastController,
              public alertCtrl: AlertController, public modalCtrl: ModalController, public sharedService: DataShareProvider) {

    this.subscription = this.sharedService.getData().subscribe(data => {
      if (data != null) {
        var valor = JSON.stringify(data);
        if (valor != null) {
          this.toDatosPedidos(valor);
        }
      }
    });
  }

  ionViewDidEnter(){
    Mousetrap.bindGlobal(['command+g', 'ctrl+g'], () => {
        this.confirmarAccion(null)
    })
    Mousetrap.bindGlobal(['command+n', 'ctrl+n'], () => {
      this.nuevoPedido()
    })
    Mousetrap.bindGlobal(['command+i', 'ctrl+i'], () => {
      console.log('Imprimiendo reporte...')
      this.generarReporte()
    })
  }

  generarReporte(){
    //console.log('idPedidoRecuperado::: ' + this.idPedidoRecuperado)
    if(this.idPedidoRecuperado==null) {
      let confirm = this.alertCtrl.create({
        title: 'Validacion',
        message: 'No se encontre registro para imprimir',
        buttons: [
          {
            text: 'Aceptar',
            handler: () => {
              setTimeout(() => {
                this.idTxtProveedor.setFocus()
              },400)
            }
          }
        ]
      });
      confirm.present();
      return true;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", this.url + "/reporte/porllegar_mov/html/view/"+this.idPedidoRecuperado, false);
    xhttp.setRequestHeader("Content-type", "text/plain");
    xhttp.send();
    PHE.printHtml(xhttp.responseText);

  }

  public nuevoPedido() {
    let confirm = this.alertCtrl.create({
      title: 'Alerta',
      message: 'Desea limpiar los campos para crear un nuevo pedido?',
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.iniciarNuevoPedido(null)
          }
        }
      ]
    });
    confirm.present();
  }

  ngOnInit() {
    console.log("obtiene String ngOnInit");

  }

  public toDatosPedidos(data: string) {
    if (data != null) {
      var jsonData: any = new Object();
      //try{
      jsonData = JSON.parse(data);
      this.jsonConvert = jsonData;
      console.log("JSON DATA");

      this.obtenerString();
    }
  }

  public obtenerString() {
    if(this.jsonConvert.id == 0){
      this.iniciarNuevoPedido();
    }else {
      this.idPedidoRecuperado = this.jsonConvert.id;
      this.txtFechaConvert = this.jsonConvert.fechaMovimiento;
      this.txtNumMovimiento = this.jsonConvert.nroMovimiento;
      this.txtCodProveedor = this.jsonConvert.codigoProveedor;
      this.infoProveedor();
      this.txtDescripcion = this.jsonConvert.observacion;
      this.listadoInPedidos = [];
      for (let articulo of this.jsonConvert.lista) {
        this.listadoInPedidos.push(new ArticuloPedido(articulo.id, articulo.codigoArticulo, articulo.cantidad, articulo.precio, articulo.observacion));
        this.txtCantidadTotal = (this.txtCantidadTotal * 1) + (articulo.cantidad * 1);
        this.txtPrecioTotal = (articulo.cantidad * articulo.precio) + (this.txtPrecioTotal * 1);
      }
    }
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
    console.log('Se va a eliminar el componente ngOnDestroy');
  }

  //debe obtener el ultimo numero de pedido
  public iniciarNuevoPedido(fab?: FabContainer) {
    if(fab!=null) {
      fab.close();
    }

    this.BuscarPedido();
    //this.txtNumMovimiento = 12312; //TODO: obtener los valores
    this.txtFecha = new Date();
    if (!this.txtFechaConvert) {
      this.txtFechaConvert = new Date(this.txtFecha).toISOString();
    }
    this.idPedidoRecuperado = null;
    this.txtDescripcion = '';
    this.txtCodProveedor = '';
    this.txtNomProveedor = '';
    this.txtCodArticulo = '';
    this.txtCantidadCompra = null;
    this.txtPrecZonLib = null;
    this.txtDescripcion2 = "";
    this.txtCantidadTotal = 0;
    this.txtPrecioTotal = 0;
    this.listadoInPedidos = [];
    setTimeout(() => {
      this.idTxtProveedor.setFocus();
    },400);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PedidosPage');
    this.iniciarNuevoPedido();
    //this.detallePedidos();
  }

  public presentToast(mensaje: string) {
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

  public BuscarPedido() {
    const loading = this.loadingCtrl.create({
      content: 'Obteniendo los datos'
    });
    //loading.present();
    this.limpiarDatos();
    var url = '/pedido/init';
    this.sicService.getGlobal<ResponseIniPedido>(url).subscribe(data => {
      //loading.dismiss();
      if (data != null) {
        if (data.respuesta) {
          this.txtNumMovimiento = data.nroMovimiento;
          this.txtFechaConvert = data.fechaMovimiento;
        } else {
          this.presentToast('No se pudo recuperar los datos solicitados.');
          this.txtNumMovimiento = 0;
        }
      }
    });
  }

  public infoProveedor(){
    this.classIncorrecto = false;
    this.txtNomProveedor = null;
    if(this.txtCodProveedor==null?false:this.txtCodProveedor == 'undefined'?false:(this.txtCodProveedor.valueOf().length > 0)) {
      let len = this.txtCodProveedor.valueOf().split('%').length;
      if(len == 1) {
        let _url = '/pedido/proveedor/quest/' + this.txtCodProveedor;
        this.sicService.getGlobal<ResponseDatosProveedor>(_url).subscribe(data => {
          if (data.respuesta) {
            this.txtCodProveedor = data.codigo;
            this.txtNomProveedor = data.nombre;
            this.idCodigoArticulo.setFocus();
          } else {
            this.txtNomProveedor = "NO EXISTE PROVEEDOR CON EL PATRON INGRESADO";
            this.classIncorrecto = true;
          }
        });
      } else {
        let _url = '/pedido/proveedor/list/';
        let _in: RequestPedidosLista = new RequestPedidosLista("");
        _in.patron = this.txtCodProveedor;
        this.sicService.postGlobal<ResponseListProveedor>(_in, _url).subscribe(data => {

          if (data.respuesta) {

            if (data.list.length == 0) {
              this.txtNomProveedor = "NO EXISTE PROVEEDOR(ES) CON EL PATRON INGRESADO";
              this.classIncorrecto = true;
            } else {

              let check: boolean = true;
              let alert = this.alertCtrl.create();
              alert.setTitle('Resultados');

              for (let item of data.list) {
                alert.addInput({
                  type: 'radio',
                  label: item.codigo + ' -- ' + item.nombre,
                  value: item.codigo + '+++' + item.nombre,
                  checked: check
                });
                check = false
              }

              alert.addButton({
                text:'Cancelar',
                handler: (data: any) => {
                  setTimeout(() => {
                    this.idTxtProveedor.setFocus();
                  },400);
                }
              });
              alert.addButton({
                text: 'Aceptar',
                handler: (data: any) => {
                  if (data != undefined) {
                    console.log('Datos Enviados:', data);
                    let arrayRespuesta = data.split('+++')
                    this.txtCodProveedor = arrayRespuesta[0];
                    this.txtNomProveedor = arrayRespuesta[1];
                    setTimeout(() => {
                      this.idCodigoArticulo.setFocus();
                    },400);
                  }
                }
              });
              alert.present();
            }
          } else {
            console.log('Error al ejecutar ' + _url)
          }
        });
      }
    } else {
      this.txtCodProveedor = null;
      this.txtNomProveedor = null;
    }
  }

  public infoProducto(){
    this.classIncorrectoPro = false;
    this.txtDescripcion2 = null;
    this.txtCantidadCompra = null;
    this.txtPrecZonLib = null;
    this.mostrarExistencias = false;
    if(this.txtCodArticulo==null?false:this.txtCodArticulo == 'undefined'?false:(this.txtCodArticulo.valueOf().length > 0)) {
      let len = this.txtCodArticulo.valueOf().split('%').length;
      console.log("len : " + len);
      if(len == 1) {
        let _url = '/pedido/articulo/quest/' + this.txtCodArticulo;
        this.sicService.getGlobal<ResponseGetArticuloPr>(_url).subscribe(data => {
          console.log("data.respuesta : " + data.respuesta);
          if (data.respuesta) {
            this.txtCodArticulo = data.codigo;
            this.txtDescripcion2 = data.nombre;
            this.txtPrecZonLib = data.precio;
            this.txtCantidadCompra = null;
            //this.cantidadCompra.setFocus();
            setTimeout(() => {
              this.cantidadCompra.setFocus();
            },400);

            this.sicService.getGlobal<ResponseExistences>("/inventario/articulo/"+this.txtCodArticulo+"/existence").subscribe(
              data2 => {
                this.respuestaExistencias = data2;
                console.log(this.respuestaExistencias.respuesta);
                if(this.respuestaExistencias.respuesta) {
                  this.mdlAmbiente = this.respuestaExistencias.list;
                  this.mostrarExistencias = true;
                }else{
                  this.mdlAmbiente = new Array();
                }
              },error=>{
                this.presentToast("Error al obtener los datos.");
              });

          } else {
            this.txtDescripcion2 = "NO EXISTE PRODUCTO CON EL PATRON INGRESADO";
            this.classIncorrectoPro = true;
            this.txtPrecZonLib = null;
            this.txtCantidadCompra = null;
          }
        });
      } else {
        let _url = '/pedido/articulo/list/';
        let _in: RequestProductoPatron = new RequestProductoPatron("");
        _in.patron = this.txtCodArticulo;
        this.sicService.postGlobal<ResponseListArticulotr>(_in, _url).subscribe(data => {

          if (data.respuesta) {

            if (data.list.length == 0) {
              this.txtDescripcion2 = "NO EXISTE PRODUCTO(S) CON EL PATRON INGRESADO";
              this.classIncorrectoPro = true;
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
                  },400);
                }
              });
              alert.addButton({
                text: 'Aceptar',
                handler: (data: any) => {
                  if (data != undefined) {
                    console.log('Datos Enviados:', data);
                    this.txtCodArticulo = data;
                    this.infoProducto();
                    /*setTimeout(() => {
                      this.cantidadCompra.setFocus();
                    },400);*/
                  }
                }
              });
              alert.present();
            }
          } else {
            console.log('Error al ejecutar ' + _url)
          }
        });
        console.log('Finalizando.... ');
      }
    } else {
      this.txtCodArticulo = null;
      this.txtDescripcion2 = null;
    }
  }

  private limpiarDatos() {
    this.txtNumMovimiento = 0; //TODO: obtener los valores
    this.txtFecha = new Date();
    this.txtFechaConvert = '';
    this.txtDescripcion = '';
    this.txtCodProveedor = '';
    this.txtNomProveedor = '';
    this.txtCodArticulo = '';
    this.txtCantidadCompra = null;
    this.txtPrecZonLib = null;
    this.txtDescripcion2 = 0;
    this.txtCantidadTotal = 0;
    this.txtPrecioTotal = 0;
    this.listadoInPedidos = [];
  }

  public accionPorLlegar(fab: FabContainer) {
    fab.close();
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
            this.confirmarAccion();
          }
        }, /* {
          text: 'Localizar Pedido',
          handler: () => {
            console.log('Localizar Pedido');
          }
        }, {
          text: 'Entrada - Almacen',
          handler: () => {
            console.log('Entrada Almacen');
          }
        },*/{
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

  public accionProveedor(fab: FabContainer) {
    fab.close();
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Proveedor',
      buttons: [
        {
          text: 'Localizar',
          handler: () => {
            this.listaProveedores();
          }
        },
        {
          text: 'Nuevo Proveedor',
          handler: () => {
            console.log('Nuevo Proveedor');
            this.presentPrompt();
          }
        }, {
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

  public accionPedidos(fab: FabContainer) {
    fab.close();
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Pedidos',
      buttons: [
        {
          text: 'Hojear Por Llegar',
          handler: () => {
            console.log('Accion Por Llegar');
            //this.detallePedidos();
            this.openModalWithParams();
          }
        },
        {
          text: 'Hojear Llegadas',
          handler: () => {
            console.log('Accion Llegadas');
            this.detalleLlegadas();
          }
        }, {
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

  public listaProveedores() {
    const loading = this.loadingCtrl.create({
      content: 'Listando Productos'
    });
    //loading.present();
    var urlListaProveedor = '/pedido/proveedor/list';
    this.sicService.getGlobal<ResponseListaProveedor>(urlListaProveedor).subscribe(
      data => {
        //loading.dismiss();
        let alert = this.alertCtrl.create();
        alert.setTitle('Seleccione un Item');


        for (let lista of data.list) {
          alert.addInput({
            type: 'radio',
            name: 'codigo',
            label: '' + lista.codigo + ' -- ' + lista.nombre,
            value: lista.codigo
          });
        }

        alert.addButton({
          text:'Cancelar',
          handler: (data: any) => {
            setTimeout(() => {
              this.idTxtProveedor.setFocus();
            },400);
          }
        });
        alert.addButton({
          text: 'Aceptar',
          handler: (data: any) => {
            console.log('Datos Enviados:', data);
            this.txtCodProveedor = data;
            this.infoProveedor();
            setTimeout(() => {
              this.idCodigoArticulo.setFocus();
            },400);
          }
        });

        alert.present();
        return data;
      });

  }

  public obtenerArticulo() {
    const loading = this.loadingCtrl.create({
      content: 'Listando Productos'
    });
    loading.present();
    var urlListaProveedor = '/pedido/articulo/quest/' + this.txtCodArticulo;
    this.sicService.getGlobal<ResponseGetArticuloPr>(urlListaProveedor).subscribe(
      data => {
        loading.dismiss();
        if (data != null) {
          if (data) {
            this.txtCodArticulo = data.codigo;
            this.txtDescripcion2 = data.nombre;
            this.txtPrecZonLib = data.precio;
          } else {
            this.presentToast('No se pudo recuperar los datos solicitados.');
          }
        }
      });
  }

  public listaExistenciasArticulos() {
    const loading = this.loadingCtrl.create({
      content: 'Listando Productos'
    });
    loading.present();
    var urlListaProveedor = '/pedido/articulo/' + this.txtCodArticulo + '/existence';
    this.sicService.getGlobal<ResponseListArticulotr>(urlListaProveedor).subscribe(
      data => {
        loading.dismiss();
        let alert = this.alertCtrl.create();
        alert.setTitle('Seleccione un Item');


        for (let lista of data.list) {
          alert.addInput({
            type: 'radio',
            name: 'codigo',
            label: '' + lista.codigo + ' -- ' + lista.nombre,
            value: lista.codigo
          });
        }

        alert.addButton('Cancelar');
        alert.addButton({
          text: 'Aceptar',
          handler: (data: any) => {
            console.log('Datos Enviados:', data);
            this.txtCodProveedor = data;
            this.infoProveedor();
          }
        });

        alert.present();
        return data;
      });
  }

  public listaArticulos() {
    const loading = this.loadingCtrl.create({
      content: 'Listando Productos'
    });
    loading.present();
    var urlListaProveedor = '/pedido/articulo/list';
    this.sicService.getGlobal<ResponseListArticulotr>(urlListaProveedor).subscribe(
      data => {
        loading.dismiss();
        let alert = this.alertCtrl.create();
        alert.setTitle('Seleccione un Item');


        for (let lista of data.list) {
          alert.addInput({
            type: 'radio',
            name: 'codigo',
            label: '' + lista.codigo + ' -- ' + lista.nombre,
            value: lista.codigo
          });
        }

        alert.addButton('Cancelar');
        alert.addButton({
          text: 'Aceptar',
          handler: (data: any) => {
            console.log('Datos Enviados:', data);
            this.txtCodArticulo = data;
            this.obtenerArticulo();
          }
        });

        alert.present();
        return data;
      });
  }

  public listaArticuloPatron() {
    const loading = this.loadingCtrl.create({
      content: 'Listando Productos'
    });
    loading.present();
    var urlListaProveedor = '/pedido/articulo/list/';
    this.sicService.getGlobal<ResponseListArticulotr>(urlListaProveedor).subscribe(
      data => {
        loading.dismiss();
        let alert = this.alertCtrl.create();
        alert.setTitle('Seleccione un Item');


        for (let lista of data.list) {
          alert.addInput({
            type: 'radio',
            name: 'codigo',
            label: '' + lista.codigo + ' -- ' + lista.nombre,
            value: lista.codigo
          });
        }

        alert.addButton('Cancelar');
        alert.addButton({
          text: 'Aceptar',
          handler: (data: any) => {
            console.log('Datos Enviados:', data);
            this.txtCodArticulo = data;
            this.obtenerArticulo();
          }
        });
        alert.present();
        return data;
      });
  }

  public confirmarAccion(fab?: FabContainer) {
    if(fab) {
      fab.close();
    }

    let alert = this.alertCtrl.create({
        title: 'Alerta de Confirmacion Operacion',
      message: 'Está seguro de ' +(this.idPedidoRecuperado==null?'guardar el nuevo ':'modificar el ')+ ' Pedido Nro.'+ this.txtNumMovimiento +' ? ',
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
            if(this.idPedidoRecuperado == null){
              this.crearPedido();
            }  else {
              this.actualizarPedido();
            }

          }
        }
      ]
    });
    alert.present();
  }

  public cambiarDatos(){
    this.txtPrecZonLib = this.round(this.txtPrecZonLib,2);
  }
  public round(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  }

  public actualizarPedido() {
    const loading = this.loadingCtrl.create({
      content: 'Obteniendo los datos'
    });
    loading.present();
    var id = '';
    var url = '/pedido/update';
    var pedido = new Pedido(this.idPedidoRecuperado, this.txtFechaConvert, this.txtNumMovimiento, this.txtCodProveedor, this.txtDescripcion, this.listadoInPedidos);
    var requestPedido = new RequestPedido(pedido);
    this.sicService.putGlobal<ResponseAddPedido>(requestPedido, url, id).subscribe(data => {
      loading.dismiss();
      let alert;
      if (data.respuesta) {
        alert = this.alertCtrl.create({
          title: 'Pedidos',
          subTitle: 'Se ha modificado el pedido correctamente',
          buttons: [{
            text: 'Aceptar',
            handler: () => {
              setTimeout(() => {
                this.idTxtProveedor.setFocus();
              },400);
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

  public crearPedido() {
    const loading = this.loadingCtrl.create({
      content: 'Listando Productos'
    });
    //loading.present();
    var urlListaProveedor = '/pedido/add';
    var pedido = new Pedido(null, this.txtFechaConvert, this.txtNumMovimiento, this.txtCodProveedor, this.txtDescripcion, this.listadoInPedidos);
    var requestPedido = new RequestPedido(pedido);
    this.sicService.postGlobal<ResponseAddPedido>(requestPedido, urlListaProveedor).subscribe(data => {
      //loading.dismiss();
      //this.iniciarNuevoPedido();
      //this.pedidosGuardados = data.pedidoObjeto;
      this.pedidoInsertado = data.pedidoObjeto;
      console.log(data.pedidoObjeto);
      console.log("*************************")
      console.log(this.pedidoInsertado)
      this.idPedidoRecuperado = this.pedidoInsertado.id;
      this.listadoInPedidos = this.pedidoInsertado.lista;
      if (data.respuesta) {
        // this.presentToast('Se guardo el pedido correctamente.');
        let alert = this.alertCtrl.create({
          title: 'Pedidos',
          subTitle: 'El pedido fue guardado correctamente.',
          buttons: [{
            text: 'Aceptar',
            handler: () => {
              setTimeout(() => {
                this.idTxtProveedor.setFocus();
              },400);
            }
          }]
        });
        alert.present();
      } else {
        this.presentToast(data.mensaje);
      }
    })

  }

  public validaCantidadPermitida(cantidadCompra: number) {
    if(cantidadCompra > 0 )
      this.idTxtPrecZonLib.setFocus();
  }

  public formatInt(event: any) {
    if(event.charCode >= 48 && event.charCode <= 57) {
      return true
    }
    return false;
  }

  public utilFormatNumber(event: any, len:number) {
    var value = event.value + '';
    console.log(value);
    var array = value.split('.');
    if( array.length == 2 ) {
      var decimal = array[1];
      if( decimal.length >= len ) {
        return false;
      }
    }
    return true;
  }

  public addListaPedidos(cantidadCompra: number) {
    if(this.txtCodArticulo==null?true:this.txtCodArticulo == 'undefined'?true:this.txtCodArticulo.valueOf().length <= 0) {
      this.idCodigoArticulo.setFocus();
      return;
    }

    if(cantidadCompra <= 0 ) {
      this.cantidadCompra.setFocus();
      return;
    }

    let _url = '/pedido/articulo/quest/' + this.txtCodArticulo;
    this.sicService.getGlobal<ResponseGetArticuloPr>(_url).subscribe(data => {
      if(data.respuesta) {
        var articuloPedido = new ArticuloPedido(null, this.txtCodArticulo, (cantidadCompra * 1), (this.txtPrecZonLib * 1), null);
        let modificar = true;
        for(let articulo of this.listadoInPedidos){
          if(this.txtCodArticulo == articulo.codigoArticulo){
            modificar = false;
            break;
          }
        }
        if (modificar) {
          this.listadoInPedidos.push(articuloPedido);
          this.txtCantidadTotal = 0;
          this.txtPrecioTotal = 0;
          for (let articulo of this.listadoInPedidos) {
            this.txtCantidadTotal = (this.txtCantidadTotal * 1) + (articulo.cantidad * 1);
            this.txtPrecioTotal = (articulo.cantidad * articulo.precio) + (this.txtPrecioTotal * 1);
          }
          this.txtCantidadCompra = null;
          this.txtPrecZonLib = null;
          this.txtDescripcion2 = null;
          this.txtCodArticulo = null;
          this.mostrarExistencias = false;
        } else {
          let alert = this.alertCtrl.create({
            title: 'Existen datos duplicados',
            subTitle: 'El codigo ' + this.txtCodArticulo + " se encuentra duplicado, desea reemplazar el articulo?.",
            buttons: [
              {
                text:'Cancelar',

              },{
                text: 'Aceptar',
                handler: data=>{
                  console.log(articuloPedido)
                  console.log(this.listadoInPedidos)
                  this.eliminarArticuloPedido(articuloPedido);
                  console.log(this.listadoInPedidos)
                  this.listadoInPedidos.push(articuloPedido);
                  this.txtCantidadTotal = 0;
                  this.txtPrecioTotal = 0;
                  for (let articulo of this.listadoInPedidos) {
                    this.txtCantidadTotal = (this.txtCantidadTotal * 1) + (articulo.cantidad * 1);
                    this.txtPrecioTotal = (articulo.cantidad * articulo.precio) + (this.txtPrecioTotal * 1);
                  }
                  this.txtCantidadCompra = null;
                  this.txtPrecZonLib = null;
                  this.txtDescripcion2 = null;
                  this.txtCodArticulo = null;
                  this.mostrarExistencias = false;

                }
              }
            ]
          });
          alert.present();
        }

        setTimeout(() => {
          this.idCodigoArticulo.setFocus();
        },400);
      } else {
        console.log("Error en el codigo del producto");
        this.txtDescripcion2 = "NO EXISTE PRODUCTO CON EL PATRON INGRESADO";
        this.classIncorrectoPro = true;
      }
    });
  }

  public eliminarArticuloPedido(item: ArticuloPedido) {
    var listaAuxiliar: ArticuloPedido[];
    listaAuxiliar = this.listadoInPedidos;
    this.listadoInPedidos = [];
    this.txtCantidadTotal = 0;
    this.txtPrecioTotal = 0;
    for (let articulo of listaAuxiliar) {
      if (articulo.codigoArticulo != item.codigoArticulo) {
        this.listadoInPedidos.push(articulo);
        this.txtCantidadTotal = (this.txtCantidadTotal * 1) + (articulo.cantidad * 1);
        this.txtPrecioTotal = (articulo.cantidad * articulo.precio) + (this.txtPrecioTotal * 1);
      }
    }
  }

  public openBasicModal() {
    let myModal = this.modalCtrl.create(ModalLlegadasPage);
    myModal.present();
  }

  public detallePedidos() {
    const loading = this.loadingCtrl.create({
      content: 'Listando Productos'
    });
    loading.present();
    var urlListaProveedor = '/pedido/list';
    this.sicService.getGlobal<ResponseListPedidos>(urlListaProveedor).subscribe(
      data => {
        console.log(data);
        loading.dismiss();
        if (data.respuesta) {
          this.listaPedidos = data;
          this.navCtrl.push(ModalLlegadasPage, {
            detallePedidos: this.listaPedidos,
            tipoPeticion: 0
          });
        } else {
          this.presentToast('No se pudo recuperar los datos solicitados.');
        }
      },error=>{
        loading.dismiss();
        this.presentToast("No se pudo obtener los datos");
        //TODO:generar mensaje de error
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

  public presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Nuevo Proveedor',
      inputs: [
        {
          name: 'codigo',
          placeholder: 'Código'
        },
        {
          name: 'nombre',
          placeholder: 'Nombre'
        },
        {
          name: 'direccion',
          placeholder: 'Dirección'
        },
        {
          name: 'telefono',
          placeholder: 'Teléfono'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Registrar',
          handler: data => {
            const loading = this.loadingCtrl.create({
              content: 'Listando Productos'
            });
            loading.present();
            var urlListaProveedor = '/pedido/proveedor/alta';
            var requestPedido: RequestProveedor;
            requestPedido.codigo = data.codigo;
            requestPedido.nombre = data.nombre;
            requestPedido.direccion = data.direccion;
            requestPedido.telefono = data.telefono;
            this.sicService.postGlobal<GlobalResponse>(requestPedido, urlListaProveedor).subscribe(
              data => {
                loading.dismiss();
                if (data.respuesta) {
                  this.presentToast('Se ha encontrado una coincidencia');
                } else {
                  this.presentToast(data.mensaje);
                }

              });
          }
        }
      ]
    });
    alert.present();
  }

  public filtrarArticulo(){
    let alert = this.alertCtrl.create();
    alert.setTitle("Buscar Articulo");
    alert.addInput({
      type: 'text',
      placeholder:"Buscar",
      name:"txtBuscaArticulo",
      id:"txtBuscarArticulo"

    });
    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        console.log(data.toString());
        const loading = this.loadingCtrl.create({
          content: 'Listando Productos'
        });
        loading.present();

        var urlListaProveedor = '/articulo/list';
        let requestArticulo:RequestPedidosLista = new RequestPedidosLista("");
        requestArticulo.patron = data.txtBuscaArticulo.trim();
        this.sicService.postGlobal<ResponseListArticulotr>(requestArticulo, urlListaProveedor).subscribe(data2 => {
          loading.dismiss();

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
                this.txtCodArticulo = data;
                this.obtenerArticulo();
              }
            }
          });
          alertInterno.present();
        });
      }
    });

    alert.present();
    //document.getElementById('txtBuscarArticulo').focus();
  }

  public openModalWithParams() {
    this.detallePedidos();
  }

  public keytab(event) {
    console.log("evento log")
    console.log(event);
  }

  public filtrarProveedor(){
    let alert = this.alertCtrl.create();
    alert.setTitle("Buscar Proveedor 123445");
    alert.addInput({
      type: 'text',
      placeholder:"Buscar",
      name:"txtBuscarProveedor"

    });
    alert.addButton({
      text:'Cancelar',
      handler: (data: any) => {
        setTimeout(() => {
          this.idTxtProveedor.setFocus();
        },400);
      }
    });
    alert.addButton({
      text: 'OK',
      handler: data => {
        console.log(data.toString());
        /*const loading = this.loadingCtrl.create({
          content: 'Listando Productos'
        });*/
        //loading.present();

        var urlListaProveedor = '/pedido/proveedor/list';
        let requestArticulo:RequestPedidosLista = new RequestPedidosLista("");
        requestArticulo.patron = data.txtBuscaArticulo.trim();
        this.sicService.postGlobal<ResponseListArticulotr>(requestArticulo, urlListaProveedor).subscribe(data2 => {
          //loading.dismiss();

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
          alertInterno.addButton({
            text:'Cancelar',
            handler: (data: any) => {
              setTimeout(() => {
                this.idTxtProveedor.setFocus();
              },400);
            }
          });
          alertInterno.addButton({
            text: 'Aceptar',
            handler: (data: any) => {
              if(data != undefined){
                console.log('Datos Enviados:', data);
                this.txtCodArticulo = data;
                this.obtenerArticulo();
                setTimeout(() => {
                  this.idCodigoArticulo.setFocus();
                },400);
              }
            }
          });
          //alertInterno.present();
        });
      }
    });

    //alert.present();
  }


  public ionViewWillEnter(){
    console.log("antes de activar la nueva pagina")
  }

  public ionViewWillLeave(){
    console.log("Saliendo de una pagina ionViewWillLeave")
  }

  public ionViewDidLeave() {
    console.log("Cuando ya saliste de la pagina ionViewDidLeave")
  }

  public ionViewWillUnload() {
    console.log("cuando se destruye una pagina ionViewWillUnload")
  }

  ngOnChanges(changes: SimpleChanges){
    console.log('metodod ngOnChanges')
    console.log(changes);
  }

  ngDoCheck(){
    //console.log('Método DoCheck lanzado ngDoCheck');
  }

}
