export class ObjArticulo {
  constructor(public codigo: string,
              public nombre: string,
              public descripcion: string,
              public precioKilo: number,
              public peso: number,
              public precioZonaLibre: number,
              public porcentajeGasto: number,
              public gasto: number,
              public precioCompra: number,
              public precioVenta: number,
              public precioMercado: number) {

  }
}
