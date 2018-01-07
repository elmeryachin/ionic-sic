import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";

/*
  Generated class for the DataShareProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataShareProvider {

  private subject = new Subject<any>();
  private utilSubject = new Subject<any>();
  constructor(public http: Http) {

  }

  setData(data: any) {
    this.subject.next(data);
  }
  getData(): Observable<any> {
    return this.subject.asObservable();
  }
  setUtilData(data:any){
    this.utilSubject.next(data);
  }
  getUtilData(): Observable<any>{
    return this.utilSubject.asObservable();
  }

}
