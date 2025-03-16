import { Component, OnInit, HostListener } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductService, Product, ProductStatus } from '../../../core/services/product.service';
import { ProductFilter } from '../filtro-producto/filtro-producto.component';

export type SortColumn = 'nombre' | 'descripcion' | 'date' | 'status';
export type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-lista-producto',
  standalone: false,
  templateUrl: './lista-producto.component.html',
  styleUrl: './lista-producto.component.css'
})
export class ListaProductoComponent implements OnInit {
  
  product$!: Observable<(Product & { showStatusMenu?: boolean })[]>;
  activeFilter: ProductStatus | null = null;
  activeFilters: ProductFilter = { status: null };
  ProductStatus = ProductStatus;
  openDropdownId: number | null = null;

  sortColumn: SortColumn = 'nombre';
  sortDirection: SortDirection = 'asc';

  showStatusModal: boolean = false;
  selectedProduct: Product | null = null;
  newStatus: number | null = null;

  constructor(private productService: ProductService){}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void{
    if (this.activeFilter === null){
      this.product$ = this.productService.getProducts().pipe(
        map(products => products.map(product => ({ ...product, showStatusMenu: false }))),
        map(products => this.sortProducts(products))
      );
    }else{
      this.product$ = this.productService.getProductsByStatus(this.activeFilter).pipe(
        map(products => products.map(product => ({ ...product, showStatusMenu: false }))),
        map(products => this.sortProducts(products))
      );
    }
  }

  sortProducts(products: (Product & { showStatusMenu?: boolean })[]): (Product & { showStatusMenu?: boolean })[] {
    return [...products].sort((a, b) => {
      let comparison = 0;
      
      switch(this.sortColumn) {
        case 'nombre':
          comparison = a.nombre.localeCompare(b.nombre);
          break;
        case 'descripcion':
          const descA = a.descripcion || '';
          const descB = b.descripcion || '';
          comparison = descA.localeCompare(descB);
          break;
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'status':
          comparison = a.status - b.status;
          break;
      }
      
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  onSort(column: SortColumn): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    
    if (this.activeFilter === null) {
      this.loadProducts();
    } else {
      this.applyAdvancedFilters(this.activeFilters);
    }
  }

  getSortIcon(column: SortColumn): string {
    if (this.sortColumn !== column) {
      return 'sort';
    }
    return this.sortDirection === 'asc' ? 'sort-up' : 'sort-down';
  }

  onFilterChange(filter: ProductFilter): void {
    console.log('Filtros recibidos:', filter);
    this.activeFilters = filter;
    this.activeFilter = filter.status;
    
    if (filter.nombre || filter.descripcion) {
      this.applyAdvancedFilters(filter);
    } else {
      this.loadProducts();
    }
  }
  
  applyAdvancedFilters(filter: ProductFilter): void {
    this.productService.getProducts().subscribe(products => {
      let filteredProducts = [...products];
      
      if (filter.status !== null) {
        filteredProducts = filteredProducts.filter(p => p.status === filter.status);
      }
      
      if (filter.nombre) {
        const searchText = filter.nombre.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.nombre.toLowerCase().includes(searchText)
        );
      }
      
      if (filter.descripcion) {
        const searchText = filter.descripcion.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.descripcion?.toLowerCase().includes(searchText)
        );
      }
      
      console.log('Productos filtrados:', filteredProducts.length);
      
      // Aplicar ordenamiento después de filtrar
      filteredProducts = this.sortProducts(filteredProducts);
      
      this.product$ = of(filteredProducts.map(product => ({ 
        ...product, 
        showStatusMenu: false 
      })));
    });
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

  async updateStatus(id: number, status: ProductStatus): Promise<void> {
    try {
      await this.productService.updateProductStatus(id, status);
      this.loadProducts();
      this.openDropdownId = null;
    } catch(error) {
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

  toggleDropdown(productId: number): void {
    if (this.openDropdownId === productId) {
      this.openDropdownId = null;
    } else {
      this.openDropdownId = productId;
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event): void {
    const dropdown = (event.target as HTMLElement).closest('.relative.inline-block');
    if (!dropdown) {
      this.openDropdownId = null;
    }
  }

  openChangeStatusModal(product: Product): void {
    this.selectedProduct = product;
    this.newStatus = null;
    this.showStatusModal = true;
  }

  closeChangeStatusModal(): void {
    this.showStatusModal = false;
    this.selectedProduct = null;
    this.newStatus = null;
  }

  confirmStatusChange(): void {
    if (this.selectedProduct && this.selectedProduct.id && this.newStatus !== null) {
      const statusNumber = parseInt(this.newStatus.toString(), 10);
      this.updateStatus(this.selectedProduct.id, statusNumber);
      this.closeChangeStatusModal();
    }
  }

}
