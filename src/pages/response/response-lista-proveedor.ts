export class ResponseListaProveedor {
  constructor(public list: ObjProveedor[], public respuesta: boolean, public mensaje: string) {

  }
}
export class ObjProveedor{
  constructor(public codigo: string, public nombre: string){

  }
}
