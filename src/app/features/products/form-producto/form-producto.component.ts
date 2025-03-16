import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product, ProductStatus } from '../../../core/services/product.service';

@Component({
  selector: 'app-form-producto',
  standalone: false,
  templateUrl: './form-producto.component.html',
  styleUrl: './form-producto.component.css',
})
export class FormProductoComponent implements OnInit{
  productForm: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  isLoading = false;

  productStatus = ProductStatus;
  statusOption = [
    {value: ProductStatus.inicial, label: 'Inicial'},
    {value: ProductStatus.pendiente, label: 'Pendiente'},
    {value: ProductStatus.completado, label: 'Completado'},
  ];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
  ){
    this.productForm = this.createForm();
  }

  ngOnInit(): void{
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.productId = Number(id);
        this.loadProductData(this.productId);
      } else {
        this.isEditMode = false;
        this.productId = null;
        this.productForm.reset();
        this.initializeNewProductForm();
      }
    });
  }

  private createForm(): FormGroup {
    const today = new Date().toISOString().split('T')[0];
    
    return this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: [''],
      date: [today, [Validators.required]],
      status: [ProductStatus.inicial, [Validators.required]]
    });
  }

  private initializeNewProductForm(): void {
    this.productForm.patchValue({
      nombre: '',
      descripcion: '',
      date: new Date().toISOString().split('T')[0],
      status: ProductStatus.inicial
    });
  }

  private async loadProductData(id: number): Promise<void> {
    try {
      this.isLoading = true;
      
      const product = await new Promise<Product | undefined>((resolve) => {
        this.productService.getProducts().subscribe(products => {
          const found = products.find(p => p.id === id);
          resolve(found);
        });
      });
      
      if (product) {
        console.log('Cargando producto para editar:', product);
        setTimeout(() => {
          this.productForm.patchValue({
            nombre: product.nombre,
            descripcion: product.descripcion,
            date: new Date(product.date).toISOString().split('T')[0],
            status: product.status
          });
          console.log('Formulario después de cargar:', this.productForm.value);
        }, 0);
      } else {
        console.error('No se encontró el producto con ID:', id);
        this.router.navigate(['/productos']);
      }
    } catch (error) {
      console.error('Error al cargar los datos del producto:', error);
      alert('Error al cargar los datos del producto');
    } finally {
      this.isLoading = false;
    }
  }

  async onSubmit(): Promise<void>{
    if (this.productForm.invalid) {
      return;
    }

    try {
      const formValues = this.productForm.getRawValue();
      
      const productData = {
        nombre: formValues.nombre,
        descripcion: formValues.descripcion,
        date: formValues.date,
        status: Number(formValues.status)
      };

      console.log('Datos a enviar:', productData);

      if (this.isEditMode && this.productId !== null) {
        await this.productService.updateProduct({
          id: this.productId,
          ...productData
        });
      } else {
        await this.productService.addProduct(productData);
      }

      this.router.navigate(['/productos']);
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  }

  formatDate(date: string | null): string {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

  onDateChange(event: any): void {
    const date = event.target.value;
    if (date) {
      this.productForm.patchValue({
        date: date
      });
    }
  }
}
