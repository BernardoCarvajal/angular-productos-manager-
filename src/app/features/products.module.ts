import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsRoutingModule } from './products-routing.module';
import { ListaProductoComponent } from './products/lista-producto/lista-producto.component';
import { FiltroProductoComponent } from './products/filtro-producto/filtro-producto.component';
import { FormProductoComponent } from './products/form-producto/form-producto.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgxMaskDirective } from 'ngx-mask';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    ListaProductoComponent,
    FiltroProductoComponent,
    FormProductoComponent,
    DashboardComponent
  ],
  imports: [
    SharedModule,
    ProductsRoutingModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    DialogModule,
    CalendarModule,

  ]
})
export class ProductsModule { }
