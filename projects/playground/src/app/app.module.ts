import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule],
  declarations: [AppComponent, HomeComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
