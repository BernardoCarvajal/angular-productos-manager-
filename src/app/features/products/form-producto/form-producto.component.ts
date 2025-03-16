import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, ProductStatus } from '../../../core/services/product.service';

@Component({
  selector: 'app-form-producto',
  standalone: false,
  templateUrl: './form-producto.component.html',
  styleUrl: './form-producto.component.css'
})
export class FormProductoComponent implements OnInit{

  productForm: FormGroup;
  isEditMode = false;
  productId?: number;

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
    this.productForm = this.fb.group({
      nombre: ['Nuevo producto', Validators.required],
      descripcion: [''],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      status: [ProductStatus.inicial, Validators.required],
    });
  }

  ngOnInit(): void{
    const id = this.route.snapshot.params['id'];

    if(id){
      this.isEditMode = true;
      this.productId = +id;
      this.loadProduct(this.productId);
    }
  }

  async loadProduct(id: number): Promise<void>{
    try{
      const products = await this.productService.getProducts().toPromise();
      const product = products?.find(p => p.id === id);

      if(product){
        this.productForm.patchValue({
          nombre: product.nombre,
          descripcion: product.descripcion || '',
          date: product.date,
          status: product.status
        });
      }else{
        this.router.navigate(['/productos']);
      }
    }catch(error){
      console.error('Error al cargar el producto', error);
      this.router.navigate(['/productos']);
    }
  }

  async onSubmit(): Promise<void>{
    if (this.productForm.invalid){
      Object.keys(this.productForm.controls).forEach(key =>{
        const control = this.productForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    try{
      const productData = {
        nombre: this.productForm.value.nombre,
        descripcion: this.productForm.value.descripcion,
        date: this.productForm.value.date,
        status: this.productForm.value.status,
      };

      if(this.isEditMode && this.productId !== undefined){
        await this.productService.updateProduct({
          id: this.productId,
          ...productData
        });
      }else{
        await this.productService.addProduct(productData);
      }
      
      this.router.navigate(['/productos']);
    }catch(error){
      console.error('Error al guardar el producto', error);
    }
  }
}
