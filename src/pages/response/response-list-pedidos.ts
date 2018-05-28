export class ResponseListPedidos{
  constructor(public list:DatosPedidos[], public respuesta:boolean, public mensaje:string){

  }
}
export class DatosPedidos{
  constructor(public id:string, public fechaMovimiento:string, public nroMovimiento:number, public codigo:string,
              public observacion:string, public seleccionado:string, public lista:ArticulosPedidosGet[]){

  }
}
export class ArticulosPedidosGet{
  constructor(public id:string, public codigoArticulo:string, public cantidad:number,
              public precio:number, public cantidadOficial:number, public precioOficial:number,
              public observacion:string){

  }
}
