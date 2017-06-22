import { HttpModule } from '@angular/http';
import { MainModule } from './pages/main/main.module';
import { LoginModule } from './pages/login/login.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { SharedModule } from './shared/shared.module';
import { APP_SERVICES } from './providers/index';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      backButtonText: '返回',
      mode: 'ios',
    }),
    SharedModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    LoginModule,
    MainModule,
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ...APP_SERVICES
  ]
})
export class AppModule {}
