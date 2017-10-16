import {ObjArticulo} from "../clases/obj-articulo";

export class ResponseGetArticulo {
  constructor(public articulo: ObjArticulo, public respuesta: boolean, public mensaje: string) {

  }
}
