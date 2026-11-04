import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, GuestGuard } from './core/guards/auth.guard';
import { ProductFormComponent } from './features/admin/products/product-form.component';
import { ProductsListComponent } from './features/admin/products/products-list.component';
import { UserFormComponent } from './features/admin/users/user-form.component';
import { UsersListComponent } from './features/admin/users/users-list.component';
import { KitchenComponent } from './features/kitchen/kitchen.component';
import { LoginComponent } from './features/login/login.component';
import { NewOrderComponent } from './features/waiter/new-order/new-order.component';
import { ReadyOrdersComponent } from './features/waiter/ready-orders/ready-orders.component';

const waiter = { canActivate: [AuthGuard], data: { roles: ['waiter'] } };
const chef = { canActivate: [AuthGuard], data: { roles: ['chef'] } };
const admin = { canActivate: [AuthGuard], data: { roles: ['admin'] } };

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },

  { path: 'waiter', component: NewOrderComponent, ...waiter },
  { path: 'waiter/ready', component: ReadyOrdersComponent, ...waiter },

  { path: 'kitchen', component: KitchenComponent, ...chef },

  { path: 'admin', pathMatch: 'full', redirectTo: 'admin/users' },
  { path: 'admin/users', component: UsersListComponent, ...admin },
  { path: 'admin/users/new', component: UserFormComponent, ...admin },
  { path: 'admin/users/:id', component: UserFormComponent, ...admin },
  { path: 'admin/products', component: ProductsListComponent, ...admin },
  { path: 'admin/products/new', component: ProductFormComponent, ...admin },
  { path: 'admin/products/:id', component: ProductFormComponent, ...admin },

  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}



