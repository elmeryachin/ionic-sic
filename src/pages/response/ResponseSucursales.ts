export class ResponseSucursales{
  constructor(public list:Sucursales[], public respuesta:boolean, public mensaje:string) {
  }
}
export class Sucursales{
  constructor(public codigo:string, public nombre:string, public tipoAmbiente:String){

  }
}
