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
  /*data: any;
  dataChange: Observable<any>;
  dataChangeObserver = new Observer<any>();
  constructor(public http: Http) {
    this.dataChangeObserver = new Subject();
    this.dataChange = new Observable((observer:Observer<any>)=> {
      this.dataChangeObserver = observer;
    });
  }

  setData(data:any) {
    console.log(this.dataChangeObserver);
    this.dataChangeObserver = new Subject();
    this.data = data;
    this.dataChangeObserver.next(this.data);
  }*/
  private subject = new Subject<any>();
  constructor(public http: Http) {

  }

  setData(data: any) {
    this.subject.next(data);
  }
  getData(): Observable<any> {
    return this.subject.asObservable();
  }

}
