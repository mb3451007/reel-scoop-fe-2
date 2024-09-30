import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { HeaderComponent } from './header/header.component';
import { DataComponent } from './data/data.component';
import { AddDataComponent } from './add-data/add-data.component';
import { authGuard } from './auth.guard';

const routes: Routes = [
  {path:'', redirectTo:'/data', pathMatch:'full',},
  {path:'auth', component:AuthComponent , canActivate:[authGuard]},
  {path:'header', component:HeaderComponent },
  {path:'data', component:DataComponent , canActivate:[authGuard]},
  {path:'add-data', component:AddDataComponent , canActivate:[authGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
