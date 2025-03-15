import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from './services/storage.service';
import { ProductService } from './services/product.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers:[
    StorageService,
    ProductService
  ]  
})
export class CoreModule { }
