import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChefComponent } from './view/chef/chef.component';
import { LoginComponent } from './view/login/login.component';
import { EditarComponent } from './view/managed/editar/editar.component';
import { ManagedComponent } from './view/managed/managed.component';
import { NuevoComponent } from './view/managed/nuevo/nuevo.component';
import { WaiterComponent } from './view/waiter/waiter.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'waiter', component: WaiterComponent },
  { path: 'chef', component: ChefComponent },
  { path: 'managed', component: ManagedComponent },
  { path: 'managed/nuevo', component: NuevoComponent },
  { path: 'managed/editar/:id', component: EditarComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



