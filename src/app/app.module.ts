import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {LoginPage} from "../pages/login/login";
import {CierreGestionPage} from "../pages/cierre-gestion/cierre-gestion";
import {DiscosPage} from "../pages/discos/discos";
import {EntregasPage} from "../pages/entregas/entregas";
import {EstadoCuentasPage} from "../pages/estado-cuentas/estado-cuentas";
import {NuevoProductoPage} from "../pages/nuevo-producto/nuevo-producto";
import {PedidosPage} from "../pages/pedidos/pedidos";
import {ReportesPage} from "../pages/reportes/reportes";
import { SicServiceProvider } from '../providers/sic-service/sic-service';
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {HttpModule} from "@angular/http";
import {ModalLlegadasPage} from "../pages/modal-llegadas/modal-llegadas";
import { DataShareProvider } from '../providers/data-share/data-share';
import {Device} from "@ionic-native/device";
import { TokenShareProvider } from '../providers/token-share/token-share';
import {BarcodeScanner} from "@ionic-native/barcode-scanner";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    CierreGestionPage,
    DiscosPage,
    EntregasPage,
    EstadoCuentasPage,
    NuevoProductoPage,
    PedidosPage,
    ReportesPage,
    ModalLlegadasPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    FormsModule,
    HttpModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    CierreGestionPage,
    DiscosPage,
    EntregasPage,
    EstadoCuentasPage,
    NuevoProductoPage,
    PedidosPage,
    ReportesPage,
    ModalLlegadasPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Device,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SicServiceProvider,
    DataShareProvider,
    TokenShareProvider,
    BarcodeScanner
  ]
})
export class AppModule {}
