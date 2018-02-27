export class ResponseDatosProveedor{
  constructor(public codigo: string, public nombre: string, public respuesta : boolean, public mensaje: string ) {
  }
}
export class ResponseListProveedor {
  constructor(public list: ResumenDatosProveedor[], public respuesta:boolean, public mensaje: string) {
  }
}
export class ResumenDatosProveedor{
  constructor(public codigo:string, public nombre:string){

  }
}
