import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MdlArticulo} from "../../pages/model/mdl-articulo";
import {ResponseGetArticulo} from "../../pages/response/response-get-articulo";
import {AlertController} from "ionic-angular";
import {ResponseList} from "../../pages/response/responseList";

/*
  Generated class for the SicServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SicServiceProvider {
  headers: HttpHeaders;
  url: string;
  valor: string;
  jsonNew: string;
  constructor(private http: HttpClient) {
    console.log('Hello SicServiceProvider Provider');
    this.url = 'https://app-pos.herokuapp.com';
  }

  listArticulos() {
    return this.http.get<ResponseList>(this.url + '/articulo/list');
  }

  getArticulo(codigoArticulo: string) {
    return this.http.get<ResponseGetArticulo>(this.url + '/articulo/quest/' + codigoArticulo);
  }

  addArticulo(articulo: MdlArticulo) {
    this.valor = JSON.stringify(articulo);
    return this.http.post(this.url + '/articulo/add', this.valor, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  updateArticulo(articulo: MdlArticulo) {
    this.valor = JSON.stringify(articulo);
    return this.http.put(this.url + '/articulo/update/' + articulo.objetoArticulo.codigo, this.valor, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  deleteArticulo(codigo: string) {
    return this.http.delete(this.url + '/articulo/delete/' + codigo, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }
}
