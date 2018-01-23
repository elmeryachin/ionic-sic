export class ResponseExistences{
  constructor(public lista: Ambientes[], public respuesta : boolean, public mensaje: string ) {
  }

}
export class Ambientes{
  constructor(public codigoAmbiente:string , public cantidad:number){

  }
}
