import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuClientesPageRoutingModule } from './menu-clientes-routing.module';

import { MenuClientesPage } from './menu-clientes.page';
import { PipesModule } from 'src/app/pipes/pipes.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule

  ],
  declarations: [MenuClientesPage]
})
export class MenuClientesPageModule {}
