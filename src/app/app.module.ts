import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './providers/electron.service';

import { WebviewDirective } from './directives/webview.directive';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// Custom Material Module
import { AppMaterialModule } from './angular-material.module';

// Ngx File Drop Module
import { FileDropModule } from 'ngx-file-drop';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { EmployeePreviewListComponent } from './components/employee-preview-list/employee-preview-list.component';
import { EmployeePreviewComponent } from './components/employee-preview/employee-preview.component';
import { EmployeeStatsComponent } from './components/employee-stats/employee-stats.component';
import { EmployeeStatsChartComponent } from './components/employee-stats/employee-stats-chart/employee-stats-chart.component';

// Services
import { EmployeeDataService } from './providers/employee-data.service';

// Pipes
import { EllipsisPipe } from './pipes/ellipsis';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EmployeePreviewListComponent,
    EmployeePreviewComponent,
    EmployeeStatsComponent,
    EmployeeStatsChartComponent,
    WebviewDirective,
    EllipsisPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    FileDropModule,
    AppMaterialModule,
  ],
  providers: [ElectronService, EmployeeDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
