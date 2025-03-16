import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductStatus } from '../../../core/services/product.service';

@Component({
  selector: 'app-filtro-producto',
  standalone: false,
  templateUrl: './filtro-producto.component.html',
  styleUrl: './filtro-producto.component.css'
})
export class FiltroProductoComponent {
  @Input() activeFilter: ProductStatus | null = null;
  @Output() filterChange = new EventEmitter<ProductStatus | null>();

  filters = [
    { value: null, label: 'Todos' },
    { value: ProductStatus.inicial, label: 'Inicial' },
    { value: ProductStatus.pendiente, label: 'Pendiente' },
    { value: ProductStatus.completado, label: 'Completado' }
  ];

  onFilterClick(filter: ProductStatus | null): void {
    this.activeFilter = filter;
    this.filterChange.emit(filter);
  }
}
