import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaProductoComponent } from './products/lista-producto/lista-producto.component';
import { FormProductoComponent } from './products/form-producto/form-producto.component';

const routes: Routes = [
  {
    path: '',
    component: ListaProductoComponent
  },
  {
    path: 'nuevo',
    component: FormProductoComponent
  },
  {
    path: 'editar/:id',
    component: FormProductoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
