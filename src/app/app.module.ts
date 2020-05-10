import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFireModule } from '@angular/fire';

import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';
import { ServersComponent } from './home/servers/servers.component';
import { LayoutComponent } from './home/layout/layout.component';

import { environment } from '../environments/environment';

import {
  NbThemeModule,
  NbLayoutModule,
  NbActionsModule,
  NbSidebarModule,
  NbCardModule,
  NbIconModule,
  NbSpinnerModule,
  NbToastrService,
  NbToastrModule,
  NbInputModule,
  NbButtonModule,
  NbCheckboxModule,
  NbUserModule,
  NbContextMenuModule,
  NbMenuModule,
  NbStepperModule,
  NbListModule,
  NbSelectModule,
  NbPopoverModule,
  NbDialogModule,
  NbBadgeModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateServerComponent } from './home/servers/create-server/create-server.component';
import { CreateServerAComponent } from './home/servers/create-server/create-server-a/create-server-a.component';
import { CreateServerBComponent } from './home/servers/create-server/create-server-b/create-server-b.component';
import { CreateServerPayComponent } from './home/servers/create-server/create-server-pay/create-server-pay.component';
import { ServerComponent } from './home/servers/server/server.component';
import { DialogComponent } from 'src/shared/ui/dialog/dialog.component';
import { ServerConfigComponent } from './home/servers/server/server-config/server-config.component';
import { HttpClientModule } from '@angular/common/http';
import { ServerLogsComponent } from './home/servers/server/server-logs/server-logs.component';
import { SafePipe } from 'src/shared/safe-html.pipe';
import { ServerPropertiesComponent } from './home/servers/server/server-properties/server-properties.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ServersComponent,
    LayoutComponent,
    CreateServerComponent,
    CreateServerAComponent,
    CreateServerBComponent,
    CreateServerPayComponent,
    DialogComponent,
    ServerComponent,
    ServerConfigComponent,
    ServerLogsComponent,
    SafePipe,
    ServerPropertiesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    NbThemeModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbToastrModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDialogModule.forRoot(),
    NbEvaIconsModule,
    NbStepperModule,
    NbBadgeModule,
    NbContextMenuModule,
    NbSelectModule,
    NbLayoutModule,
    NbUserModule,
    NbListModule,
    NbActionsModule,
    NbSidebarModule,
    NbCardModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    NbIconModule,
    NbPopoverModule,
    NbSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
