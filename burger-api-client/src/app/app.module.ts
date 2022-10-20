import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './view/login/login.component';
import { ChefComponent } from './view/chef/chef.component';
import { ManagedComponent } from './view/managed/managed.component';
import { WaiterComponent } from './view/waiter/waiter.component';
import { BotonHechoComponent } from './view/chef/boton-hecho/boton-hecho.component'

// Componentes
import { NavegacionComponent } from './view/waiter/navegador/navegacion.component';
import { NombresComponent } from './view/waiter/nombres/nombres.component';
import { CatalogoProductoComponent } from './view/waiter/menu/catalago-producto.component';
import { ShoppingCartComponent } from './view/waiter/shopping-cart/shopping-cart.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ShoppingCartItemComponent } from './view/waiter/shopping-cart/shopping-cart-item.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChefComponent,
    ManagedComponent,
    WaiterComponent,
    BotonHechoComponent,
    NavegacionComponent,
    NombresComponent,
    CatalogoProductoComponent,
    ShoppingCartComponent,
    ShoppingCartItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
