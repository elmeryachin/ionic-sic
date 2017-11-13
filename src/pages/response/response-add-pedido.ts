import {RequestPedido} from "../request/request-pedido";

export class ResponseAddPedido{
  constructor(public pedidoObjeto:RequestPedido, public respuesta:boolean, public mensaje:string){
  }
}
