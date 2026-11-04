import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ProductFormComponent } from './features/admin/products/product-form.component';
import { ProductsListComponent } from './features/admin/products/products-list.component';
import { UserFormComponent } from './features/admin/users/user-form.component';
import { UsersListComponent } from './features/admin/users/users-list.component';
import { KitchenComponent } from './features/kitchen/kitchen.component';
import { LoginComponent } from './features/login/login.component';
import { NewOrderComponent } from './features/waiter/new-order/new-order.component';
import { OrderSummaryComponent } from './features/waiter/order-summary/order-summary.component';
import { ProductCardComponent } from './features/waiter/product-card/product-card.component';
import { ReadyOrdersComponent } from './features/waiter/ready-orders/ready-orders.component';
import { HeaderComponent } from './shared/header/header.component';
import { OrderCardComponent } from './shared/order-card/order-card.component';
import { ToastComponent } from './shared/toast/toast.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ToastComponent,
    OrderCardComponent,
    LoginComponent,
    NewOrderComponent,
    ProductCardComponent,
    OrderSummaryComponent,
    ReadyOrdersComponent,
    KitchenComponent,
    UsersListComponent,
    UserFormComponent,
    ProductsListComponent,
    ProductFormComponent,
  ],
  imports: [BrowserModule, HttpClientModule, ReactiveFormsModule, AppRoutingModule],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule {}