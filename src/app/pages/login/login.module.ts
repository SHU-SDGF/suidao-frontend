import { LoginComponent } from './login.component';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from 'ionic-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    FormsModule, IonicModule,
    ReactiveFormsModule, BrowserModule, SharedModule
  ],
  exports: [LoginComponent],
  entryComponents: [LoginComponent],
  providers: []
})
export class LoginModule {}