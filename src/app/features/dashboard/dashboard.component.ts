import { Component, OnInit } from '@angular/core';
import { ProductService, Product, ProductStatus } from '../../core/services/product.service';
import { Observable, combineLatest, map } from 'rxjs';

interface ProductStats{
  total: number;
  porEstado: {
    inicial: number;
    pendiente: number;
    completado: number;
  };
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{

  stats$: Observable<ProductStats> = new Observable<ProductStats>();
  
  colorMap ={
    inicial: 'bg-blue-500',
    pendiente: 'bg-yellow-500',
    completado: 'bg-green-500'
  };

  porcentajes: number[] = [];
  etiquetas: string[] = ['Inicial', 'Pendiente', 'Completado'];

  constructor(private productService: ProductService){}

  ngOnInit(): void {
      this.stats$ = this.productService.getProducts().pipe(
        map(products => {
          const stats: ProductStats = {
            total: products.length,
            porEstado: {
              inicial: products.filter(p => p.status === ProductStatus.inicial).length,
              pendiente: products.filter(p => p.status === ProductStatus.pendiente).length,
              completado: products.filter(p => p.status === ProductStatus.completado).length
            }
          };

          if (stats.total > 0){
            this.porcentajes = Object.values(stats.porEstado).map(count => (count / stats.total) * 100);
          }
          return stats;
        })
      );
  }

  getStatusName(status: ProductStatus): string{
    switch(status){
      case ProductStatus.inicial:
        return 'Inicial';
      case ProductStatus.pendiente:
        return 'Pendiente';
      case ProductStatus.completado:
        return 'Completado';
    }
  }

  getStatusColor(status: ProductStatus): string{
    switch(status){
      case ProductStatus.inicial:
        return 'bg-blue-500';
      case ProductStatus.pendiente:
        return 'bg-yellow-500';
      case ProductStatus.completado:
        return 'bg-green-500';
      default:
        return '';
    }
  }

}
