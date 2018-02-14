import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  AlertController, IonicPage, LoadingController, ModalController, NavController, NavParams,
  ToastController
} from 'ionic-angular';
import {ActionSheetController} from 'ionic-angular';
import {SicServiceProvider} from "../../providers/sic-service/sic-service";
import {ResponseIniPedido} from "../response/response-ini-pedido";
import {ResponseDatosProveedor} from "../response/response-datos-proveedor";
import {ResponseListaProveedor} from "../response/response-lista-proveedor";
import {ResponseGetArticuloPr} from "../response/response-get-articulo-pr";
import {ResponseListArticulotr} from "../response/response-list-articulotr";
import {ArticuloPedido, Pedido, RequestPedido} from "../request/request-pedido";
import {ResponseAddPedido} from "../response/response-add-pedido";
import {ModalLlegadasPage} from "../modal-llegadas/modal-llegadas";
import {ArticulosPedidosGet, DatosPedidos, ResponseListPedidos} from "../response/response-list-pedidos";
import {RequestProveedor} from "../request/request-proveedor";
import {GlobalResponse} from "../response/globalResponse";
import {DataShareProvider} from "../../providers/data-share/data-share";
import {Subscription} from "rxjs/Subscription";
import {RequestPedidosLista} from "../request/RequestPedidosLista";

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
export class PedidosPage implements OnDestroy, OnInit {

  txtNumMovimiento;
  txtFecha: any;
  txtCodProveedor;
  txtDescripcion;
  txtCodArticulo;
  txtCantidadCompra: number = 0;
  txtPrecZonLib: number = 0;
  txtNomProveedor;
  txtDescripcion2;
  txtCantidadTotal;
  txtPrecioTotal;
  convertedDate = '';
  txtFechaConvert;
  listadoInPedidos: ArticuloPedido[];
  pedidosGuardados: RequestPedido;
  idPedidoRecuperado: number;
  listaPedidos: ResponseListPedidos;
  listaArticulosPorPedido: ArticulosPedidosGet[];
  cantidadPedidos: number = 0;
  precioPedidos: number = 0;

  cantidadTotalPedido: number = 0;
  precioTotalPedido: number = 0;
  precioTotalCompra: number = 0;

  pedidoBack: DatosPedidos;


  message: any;
  subscription: Subscription;
  jsonConvert: any;

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

  ngOnInit() {
    console.log("obtiene String");

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
      this.txtCodProveedor = this.jsonConvert.codigoProveedor.toUpperCase();
      this.BuscarProveedor();
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
  }

  public confirmarActualizacion() {
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
            this.actualizarPedido();
          }
        }
      ]
    });
    alert.present();
  }

  public actualizarPedido() {
    const loading = this.loadingCtrl.create({
      content: 'Obteniendo los datos'
    });
    loading.present();
    var id = '';
    var url = '/pedido/update';
    var pedido = new Pedido(this.idPedidoRecuperado, this.txtFechaConvert, this.txtNumMovimiento, this.txtCodProveedor.toUpperCase(), this.txtDescripcion, this.listadoInPedidos);
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
              this.iniciarNuevoPedido();
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

  //debe obtener el ultimo numero de pedido
  public iniciarNuevoPedido() {
    this.BuscarPedido();
    //this.txtNumMovimiento = 12312; //TODO: obtener los valores
    this.txtFecha = new Date();
    if (!this.txtFechaConvert) {
      this.txtFechaConvert = new Date(this.txtFecha).toISOString();
    }
    this.txtDescripcion = '';
    this.txtCodProveedor = '';
    this.txtNomProveedor = '';
    this.txtCodArticulo = '';
    this.txtCantidadCompra = 0;
    this.txtPrecZonLib = 0;
    this.txtDescripcion2 = "";
    this.txtCantidadTotal = 0;
    this.txtPrecioTotal = 0;
    this.listadoInPedidos = [];
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
    loading.present();
    this.limpiarDatos();
    var url = '/pedido/init';
    this.sicService.getGlobal<ResponseIniPedido>(url).subscribe(data => {
      loading.dismiss();
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

  public BuscarProveedor() {
    const loading = this.loadingCtrl.create({
      content: 'Obteniendo los datos'
    });
    loading.present();
    var url = '/pedido/proveedor/quest/' + this.txtCodProveedor.toUpperCase();
    this.sicService.getGlobal<ResponseDatosProveedor>(url).subscribe(data => {
      loading.dismiss();
      if (data != null) {
        if (data.respuesta) {
          this.txtCodProveedor = data.codigo.toUpperCase();
          this.txtNomProveedor = data.nombre;
        } else {
          this.presentToast('No se pudo recuperar los datos solicitados.');
        }
      }
    });
  }

  private limpiarDatos() {
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
    this.listadoInPedidos = [];
  }

  public accionPorLlegar() {
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

  public accionArticulo() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Artículo',
      buttons: [
        {
          text: 'Localizar',
          handler: () => {
            console.log('Localizar Artículo');
            this.listaArticulos();
          }
        }, /*
        {
          text: 'Estado General',
          handler: () => {
            console.log('Estado General');
          }
        }, */{
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

  public accionProveedor() {
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

  public accionPedidos() {
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
    loading.present();
    var urlListaProveedor = '/pedido/proveedor/list';
    this.sicService.getGlobal<ResponseListaProveedor>(urlListaProveedor).subscribe(
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
            this.txtCodProveedor = data.toUpperCase();
            this.BuscarProveedor();
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
    var urlListaProveedor = '/pedido/articulo/quest/' + this.txtCodArticulo.toUpperCase();
    this.sicService.getGlobal<ResponseGetArticuloPr>(urlListaProveedor).subscribe(
      data => {
        loading.dismiss();
        if (data != null) {
          if (data) {
            this.txtCodArticulo = data.codigo.toUpperCase();
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
    var urlListaProveedor = '/pedido/articulo/' + this.txtCodArticulo.toUpperCase() + '/existence';
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
            this.txtCodProveedor = data.toUpperCase();
            this.BuscarProveedor();
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
            this.txtCodArticulo = data.toUpperCase();
            this.obtenerArticulo();
          }
        });

        alert.present();
        return data;
      });
  }

  //TODO: preguntar este metodo
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
            this.txtCodArticulo = data.toUpperCase();
            this.obtenerArticulo();
          }
        });
        alert.present();
        return data;
      });
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
            this.crearPedido();
          }
        }
      ]
    });
    alert.present();
  }

  public crearPedido() {


    const loading = this.loadingCtrl.create({
      content: 'Listando Productos'
    });
    loading.present();
    var urlListaProveedor = '/pedido/add';
    var pedido = new Pedido(null, this.txtFechaConvert, this.txtNumMovimiento, this.txtCodProveedor.toUpperCase(), this.txtDescripcion, this.listadoInPedidos);
    var requestPedido = new RequestPedido(pedido);
    this.sicService.postGlobal<ResponseAddPedido>(requestPedido, urlListaProveedor).subscribe(data => {
      loading.dismiss();
      this.iniciarNuevoPedido();
      this.pedidosGuardados = data.pedidoObjeto;
      if (data.respuesta) {
        this.presentToast('Se guardo el pedido correctamente.');
      } else {
        this.presentToast(data.mensaje);
      }
    })

  }

  public addListaPedidos(cantidadCompra: number) {
    var articuloPedido = new ArticuloPedido(null, this.txtCodArticulo.toUpperCase(), (cantidadCompra * 1), (this.txtPrecZonLib * 1), null);
    let modificar = true;
    //var articuloAdiciona = this.listadoInPedidos.filter(item => item.codigoArticulo = articuloPedido.codigoArticulo);
    for(let articulo of this.listadoInPedidos){
      if(this.txtCodArticulo.toUpperCase() == articulo.codigoArticulo.toUpperCase()){
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
    } else {
      let alert = this.alertCtrl.create({
        title: 'Existen datos duplicados',
        subTitle: 'El codigo ' + this.txtCodArticulo + " se encuentra duplicado, debe eliminar el articulo para registrar uno nuevo.",
        buttons: ['Aceptar']
      });
      alert.present();
    }

  }

  public eliminarArticuloPedido(item: ArticuloPedido) {
    var listaAuxiliar: ArticuloPedido[];
    listaAuxiliar = this.listadoInPedidos;
    this.listadoInPedidos = [];
    this.txtCantidadTotal = 0;
    this.txtPrecioTotal = 0;
    for (let articulo of listaAuxiliar) {
      if (articulo != item) {
        this.listadoInPedidos.push(articulo);
        this.txtCantidadTotal = (this.txtCantidadTotal * 1) + (articulo.cantidad * 1);
        this.txtPrecioTotal = (articulo.cantidad * articulo.precio) + (this.txtPrecioTotal * 1);
      }
    }
  }

  public buscarPedido() {

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
        requestArticulo.patron = data.txtBuscaArticulo.trim().toUpperCase();
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
                this.txtCodArticulo = data.toUpperCase();
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
    console.log(event.srcElement.attrs);
    let element = event.srcElement.nextElementSibling;
    console.log(element);

  }

  public filtrarProveedor(){
    let alert = this.alertCtrl.create();
    alert.setTitle("Buscar Proveedor");
    alert.addInput({
      type: 'text',
      placeholder:"Buscar",
      name:"txtBuscarProveedor"

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

        var urlListaProveedor = '/pedido/proveedor/list';
        let requestArticulo:RequestPedidosLista = new RequestPedidosLista("");
        requestArticulo.patron = data.txtBuscaArticulo.trim().toUpperCase();
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
                this.txtCodArticulo = data.toUpperCase();
                this.obtenerArticulo();
              }
            }
          });
          alertInterno.present();
        });
      }
    });

    alert.present();
  }



}
