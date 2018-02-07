export class ResponseExistences{
  constructor(public list: Ambientes[], public respuesta : boolean, public mensaje: string ) {
  }

}
export class Ambientes{
  constructor(public codigoAmbiente:string , public cantidad:number){

  }
}
