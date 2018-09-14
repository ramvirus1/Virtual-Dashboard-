import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './material.module';

import { ToolbarComponent } from './views/dashboard/toolbar/toolbar.component';
import { LoginComponent } from './views/dashboard/login/login.component';
import { OnlineUsersComponent } from './views/dashboard/onlineUsers/onlineUsers.component';
import { CanvasComponent } from './views/dashboard/canvas.component';

import { AppService } from './app.service';

@NgModule({
  declarations: [
    LoginComponent,
    ToolbarComponent,
    OnlineUsersComponent,
    CanvasComponent
  ],
  imports: [
    BrowserModule,FlexLayoutModule,MaterialModule
  ],
  providers: [AppService],
  bootstrap: [CanvasComponent]
})
export class AppModule { }
