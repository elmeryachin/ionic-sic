import { ResponsePedido} from "../request/request-pedido";

export class ResponseAddPedido{
  constructor(public pedidoObjeto:ResponsePedido, public respuesta:boolean, public mensaje:string){
  }
}
