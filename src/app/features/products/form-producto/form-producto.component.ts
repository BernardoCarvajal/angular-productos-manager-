import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product, ProductStatus } from '../../../core/services/product.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-form-producto',
  standalone: false,
  templateUrl: './form-producto.component.html',
  styleUrl: './form-producto.component.css'
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
    return this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: [''],
      date: [new Date(), [Validators.required]],
      status: [ProductStatus.inicial, [Validators.required]]
    });
  }

  private initializeNewProductForm(): void {
    this.productForm.patchValue({
      nombre: '',
      descripcion: '',
      date: new Date(),
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
            date: new Date(product.date),
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
      
      const status = Number(formValues.status);
      
      const productData = {
        nombre: formValues.nombre,
        descripcion: formValues.descripcion,
        date: formValues.date instanceof Date ? formValues.date.toISOString() : formValues.date,
        status: status
      };

      console.log('Datos a enviar:', productData);
      console.log('Tipo de status a enviar:', typeof productData.status, productData.status);

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
}
