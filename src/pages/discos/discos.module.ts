import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DiscosPage } from './discos';

@NgModule({
  declarations: [
    DiscosPage,
  ],
  imports: [
    IonicPageModule.forChild(DiscosPage),
  ],
})
export class DiscosPageModule {}
