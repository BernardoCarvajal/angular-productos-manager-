import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductService, Product, ProductStatus } from '../../../core/services/product.service';

@Component({
  selector: 'app-lista-producto',
  standalone: false,
  templateUrl: './lista-producto.component.html',
  styleUrl: './lista-producto.component.css'
})
export class ListaProductoComponent implements OnInit {
  
  product$!: Observable<Product[]>;
  activeFilter: ProductStatus | null = null;
  ProductStatus = ProductStatus;

  constructor(private productService: ProductService){}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void{
    if (this.activeFilter === null){
      this.product$ = this.productService.getProducts();
    }else{
      this.product$ = this.productService.getProductsByStatus(this.activeFilter);
    }
  }

  onFilterChange(filter: ProductStatus | null): void{
    this.activeFilter = filter;
    this.loadProducts();
  }

  async deleteProduct(id: number): Promise<void>{
    if (confirm( '¿Estás seguro de querer eliminar este producto?')){
      try{
        await this.productService.deleteProduct(id);
      }catch(error){
        console.error('Error al eliminar el producto', error);
        alert('Error al eliminar el producto');
      }
    }
  }

  async updateStatus(id: number, status: ProductStatus): Promise<void>{
    try{
      await this.productService.updateProductStatus(id, status);
    }catch(error){
      console.error('Error al actualizar el estado del producto', error);
      alert('Error al actualizar el estado del producto');
    }
  }

  getStatusName(status: ProductStatus): string{
    switch (status){
      case ProductStatus.inicial:
        return 'Inicial';
      case ProductStatus.pendiente:
        return 'Pendiente';
      case ProductStatus.completado:
        return 'Completado';
      default:
        return '';
    }
  }

}
