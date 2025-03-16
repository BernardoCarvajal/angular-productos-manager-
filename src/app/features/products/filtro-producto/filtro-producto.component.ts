import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductStatus } from '../../../core/services/product.service';

export interface ProductFilter {
  status: ProductStatus | null;
  nombre?: string;
  descripcion?: string;
  fechaDesde?: Date | null;
  fechaHasta?: Date | null;
}

@Component({
  selector: 'app-filtro-producto',
  standalone: false,
  templateUrl: './filtro-producto.component.html',
  styleUrl: './filtro-producto.component.css'
})
export class FiltroProductoComponent {
  @Input() activeFilter: ProductStatus | null = null;
  @Output() filterChange = new EventEmitter<ProductFilter>();
  
  filterForm: FormGroup;
  showAdvancedFilters = false;

  filters = [
    { value: null, label: 'Todos' },
    { value: ProductStatus.inicial, label: 'Inicial' },
    { value: ProductStatus.pendiente, label: 'Pendiente' },
    { value: ProductStatus.completado, label: 'Completado' }
  ];

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      nombre: [''],
      descripcion: [''],
      fechaDesde: [null],
      fechaHasta: [null]
    });
  }

  onFilterClick(filter: ProductStatus | null): void {
    this.activeFilter = filter;
    this.applyFilters();
  }

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  applyFilters(): void {
    const formValues = this.filterForm.value;
    
    const filters: ProductFilter = {
      status: this.activeFilter,
      nombre: formValues.nombre ? formValues.nombre.trim() : undefined,
      descripcion: formValues.descripcion ? formValues.descripcion.trim() : undefined,
      fechaDesde: formValues.fechaDesde,
      fechaHasta: formValues.fechaHasta
    };
    
    this.filterChange.emit(filters);
  }
  
  clearFilters(): void {
    this.activeFilter = null;
    this.filterForm.reset();
    this.applyFilters();
  }
}
