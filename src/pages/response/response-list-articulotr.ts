export class ResponseListArticulotr {
  constructor(public list: claseListaArticuloPr[], public rspuesta:boolean, public mensaje: string) {
  }
}
export class claseListaArticuloPr{
  constructor(public codigo:string, public nombre:string){

  }
}
