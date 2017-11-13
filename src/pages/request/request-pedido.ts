export class RequestPedido{
  constructor(public pedidoObjeto: Pedido) {
  }
}
export class Pedido{
  constructor(public id: number, public fechaMovimiento:string, public nroMovimiento:number, public codigoProveedor:string, public observacion:string, public lista:ArticuloPedido[]){

  }
}
export class ArticuloPedido{
  constructor(public id:number, public codigoArticulo:string, public cantidad:number, public precio:number, public observacion:string){
  }
}
