import {Articulo} from "../clases/articulo";
export class ResponseArticulo {
  constructor(public lista: Articulo[], public respuesta: boolean, public mensaje: string) {

  }
}
