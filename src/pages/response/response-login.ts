export class ResponseLogin{
  constructor(public nombreUsuario:string, public nombreAmbiente:string, public fechaInicioCiclo:string,
              public token:string, public respuesta:boolean, public mensaje:string, public tipo:string ){

  }
}
