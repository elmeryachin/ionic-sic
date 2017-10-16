import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EntregasPage } from './entregas';

@NgModule({
  declarations: [
    EntregasPage,
  ],
  imports: [
    IonicPageModule.forChild(EntregasPage),
  ],
})
export class EntregasPageModule {}
