import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './view/login/login.component';
import { ChefComponent } from './view/chef/chef.component';
import { ManagedComponent } from './view/managed/managed.component';
import { WaiterComponent } from './view/waiter/waiter.component';
import { FormsModule } from '@angular/forms';

// Componentes
import { NavegacionComponent } from './view/waiter/components/navegacion.component';
import { NombresComponent } from './view/waiter/nombres/nombres.component';
import { DesayunoComponent } from './view/waiter/desayuno/desayuno.component';
import { AlmuerzoComponent } from './view/waiter/almuerzo/almuerzo.component';
import { CajaPedidosComponent } from './view/waiter/caja-pedidos/caja-pedidos.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChefComponent,
    ManagedComponent,
    WaiterComponent,
    NavegacionComponent,
    NombresComponent,
    DesayunoComponent,
    AlmuerzoComponent,
    CajaPedidosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
