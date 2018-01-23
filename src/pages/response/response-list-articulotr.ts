export class ResponseListArticulotr {
  constructor(public lista: claseListaArticuloPr[],public list: claseListaArticuloPr[], public respuesta:boolean, public mensaje: string) {
  }
}
export class claseListaArticuloPr{
  constructor(public codigo:string, public nombre:string, public descripcion:string){

  }
}
