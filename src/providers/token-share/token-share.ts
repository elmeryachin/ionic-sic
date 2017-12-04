import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";

/*
  Generated class for the TokenShareProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TokenShareProvider {
  private subject = new Subject<any>();
  constructor(public http: Http) {
    console.log('Hello TokenShareProvider Provider');
  }
  setData(data: any) {
    this.subject.next(data);
  }
  getData(): Observable<any> {
    return this.subject.asObservable();
  }
}
