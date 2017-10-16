import {Articulo} from "../clases/articulo";

export class ResponseList {
  constructor(public lista: Articulo[], public respuesta: boolean, public mensaje: string) {

  }
}
