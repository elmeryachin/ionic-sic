import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EstadoCuentasPage } from './estado-cuentas';

@NgModule({
  declarations: [
    EstadoCuentasPage,
  ],
  imports: [
    IonicPageModule.forChild(EstadoCuentasPage),
  ],
})
export class EstadoCuentasPageModule {}
