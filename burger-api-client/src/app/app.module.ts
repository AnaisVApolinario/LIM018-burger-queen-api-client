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
import { NavegacionComponent } from './components/navegacion.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChefComponent,
    ManagedComponent,
    WaiterComponent,
    NavegacionComponent
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
