import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { SharedModule } from '@shared/shared.module';
import { GifsModule } from './gifs/gifs.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({ declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        SharedModule,
        GifsModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
