import { ResponsePedido} from "../request/request-pedido";

export class ResponseAddPedido{
  constructor(public transaccionObjeto:ResponsePedido, public respuesta:boolean, public mensaje:string){
  }
}
