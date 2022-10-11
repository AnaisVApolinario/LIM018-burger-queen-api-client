import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChefComponent } from './view/chef/chef.component';
import { LoginComponent } from './view/login/login.component';
import { ManagedComponent } from './view/managed/managed.component';
import { WaiterComponent } from './view/waiter/waiter.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'waiter', component: WaiterComponent },
  { path: 'chef', component: ChefComponent },
  { path: 'managed', component: ManagedComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



