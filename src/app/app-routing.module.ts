import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';
import { ServersComponent } from './home/servers/servers.component';
import { AuthService } from 'src/shared/services/auth.service';
import { ServerFullComponent } from './home/servers/server-full/server-full.component';
import { ServerResolver } from './home/servers/server-full/server.resolver';
import { CreateServerComponent } from './home/servers/create-server/create-server.component';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
    ],
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthService],
    children: [
      { path: 'dashboard', component: ServersComponent },
      { path: 'create-server', component: CreateServerComponent },
      { path: 'servers', component: ServersComponent },
      { path: 'servers/:serverUid', component: ServerFullComponent, resolve: { server$: ServerResolver } },
    ],
  },
  {
    path: '',
    redirectTo: 'home/servers',
    pathMatch: 'full',
  },
  { path: '**', redirectTo: 'home/servers' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
