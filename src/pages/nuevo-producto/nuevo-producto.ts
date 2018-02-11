import {Component, OnInit} from '@angular/core';
import {
  ActionSheetController, AlertController, IonicPage, LoadingController, NavController, NavParams,
  ToastController
} from 'ionic-angular';
import {MdlArticulo} from "../model/mdl-articulo";
import {ObjArticulo} from "../clases/obj-articulo";
import {SicServiceProvider} from "../../providers/sic-service/sic-service";
import {Ambientes, ResponseExistences} from "../response/response-existences";
import {ResponseSucursales, Sucursales} from "../response/ResponseSucursales";
import {MdlSucursales} from "../model/MdlSucursales";
import {RequestPedidosLista} from "../request/RequestPedidosLista";
import {ResponseListArticulotr} from "../response/response-list-articulotr";

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
  precioKilo:number = 0;
  pesoStock:number = 0;
  precioZonaLibre:number = 0;
  porcentajeGastos:number = 0;
  montoGasto:number = 0;
  precioCompra:number = 0;
  precioMercado:number = 0;
  precioVenta:number = 0;
  seActualiza: boolean;
  mensaje;
  mostrarExistencias = false;
  respuestaExistencias:ResponseExistences = new ResponseExistences(null,true,"");
    listaSucursales:Sucursales[];
  mdlSucursales:MdlSucursales[] = new Array();
  url:string = 'http://localhost:8080';//'https://app-pos.herokuapp.com';
  constructor(public navCtrl: NavController, public navParams: NavParams, private sicService: SicServiceProvider,
              public alertCtrl: AlertController, public toastCtrl: ToastController,
              public loadingCtrl: LoadingController, public actionSheetCtrl: ActionSheetController) {
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
  private CargarSucrsales(){

    const loading = this.loadingCtrl.create({
      content: 'Obteniendo los datos'
    });
    loading.present();
    var url = '/inventario/articulo/sucursales';
    this.sicService.getGlobal<ResponseSucursales>(url).subscribe(data => {
      loading.dismiss();
      if (data != null) {
        if(data.respuesta){
          this.listaSucursales = data.list;
          for(let i:number = 0; i < this.listaSucursales.length; i++){
            this.mdlSucursales.push(new MdlSucursales(this.listaSucursales[i].codigo,this.listaSucursales[i].nombre,0));
          }
        }else{
          this.presentToast("No se pudieron obtener los datos de sucursales.")
        }
      }
    }, error=>
    {
      loading.dismiss();
      this.presentToast("Error al obtener los datos");
    });
  }
  ngOnInit() {
    this.seActualiza = false;
    this.CargarSucrsales();

  }
  public calculaPrecioFinal() {
    this.mostrarExistencias = false;
    this.montoGasto = (this.porcentajeGastos * this.precioZonaLibre) / 100;

    this.precioCompra = (this.precioKilo * this.pesoStock) + (this.precioZonaLibre * 1) + (this.montoGasto*1);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad NuevoProductoPage');
  }


  public buscaProducto() {
    this.mostrarExistencias = true;
    const loading = this.loadingCtrl.create({
      content: 'Obteniendo los datos'
    });

    loading.present();
    if(this.codigoArticulo.trim()== 0){
      loading.dismiss();
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

          this.sicService.getGlobal<ResponseExistences>("/inventario/articulo/"+this.codigoArticulo.toUpperCase()+"/existence").subscribe(
            data2 => {
              console.log("*************")
              console.log(data2);

              this.respuestaExistencias = data2;
              let ambientes:Ambientes[] = new Array();
              ambientes = data2.list;
              console.log(this.respuestaExistencias.respuesta);
              if(this.respuestaExistencias.respuesta) {
                console.log("ingresa por true");
                for (let i = 0; i < ambientes.length; i++) {
                  for (let j = 0; j < this.mdlSucursales.length; j++) {
                    if (ambientes[i].codigoAmbiente == this.mdlSucursales[j].codigoSucursal) {
                      this.mdlSucursales[j].cantidadArticulo = ambientes[i].cantidad;
                    }
                  }
                }
              }else{
                console.log("ingresa por false");
                for(let j=0; j< this.mdlSucursales.length;j++){
                    this.mdlSucursales[j].cantidadArticulo = 0;
                }
              }
            },error=>{
              loading.dismiss();
              this.presentToast("Error al obtener los datos.");
            });
        }else{
          console.log("ingresa por false");
          for(let j=0; j< this.mdlSucursales.length;j++){
            this.mdlSucursales[j].cantidadArticulo = 0;
          }
        }
      },
      error =>{
        loading.dismiss();
        this.presentToast("Error al obtener los datos");
      });
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
          this.limpiarDatos();
          this.presentAlert('Información','Su producto fue registrado correctamente');
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
          this.limpiarDatos();
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

  public eliminarArticulo() {
    this.mostrarExistencias = false;
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
        }, error=>{
          loading.dismiss();
          this.presentToast("Error al obtener los datos.");
      });
    }
  }
  public limpiarDatos(){
    this.mostrarExistencias = false;
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
  public reportesPedidos(){
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


  public filtrarArticulo(){
    let alert = this.alertCtrl.create();
    alert.setTitle("Buscar Articulo");
    alert.addInput({
      type: 'text',
      placeholder:"Buscar",
      name:"txtBuscaArticulo"

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
