export class ModeloSucursales{
  constructor(public listaSucursal:MdlSucursales[]){

  }
}
export class MdlSucursales{
  constructor(public codigoSucursal:string, public nombreSucursal:string, public cantidadArticulo:number){

  }
}
