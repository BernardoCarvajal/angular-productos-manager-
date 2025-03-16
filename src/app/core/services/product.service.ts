import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs';
import { StorageService } from './storage.service';

export interface NewProduct{
  id?: number;
  nombre: string;
  descripcion?: string;
  date: string;
  status: ProductStatus;
}

export enum ProductStatus{
  inicial = 1,
  pendiente = 2,
  completado = 3
}

export interface Product extends NewProduct{
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(
    private storageService: StorageService
  ) { 
    this.loadProducts();
  }

  private async loadProducts(): Promise<void>{
    try{
      const products = await this.storageService.getAllProducts<Product>();
      this.productsSubject.next(products);
    } catch(error){
      console.error('Error al cargar productos', error);
      this.productsSubject.next([]);
    }
  }

  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  getProductsByStatus(status: number): Observable<Product[]>{
    return this.products$.pipe(
      map(products => products.filter(product => product.status === status))
    );
  }

  async addProduct(product: Omit<Product, 'id'>): Promise<Product>{
    try{
      const newProduct = await this.storageService.addProduct<Product>(product as Product);
      const currentProducts = this.productsSubject.value;
      this.productsSubject.next([...currentProducts, newProduct]);
      return newProduct;
    }catch(error){
      console.error('Error al agregar producto', error);
      throw error;
    }
  }

  async updateProduct(product: Product): Promise<Product>{
    try{
      const updateProduct = await this.storageService.updateProduct<Product>(product);
      const currentProducts = this.productsSubject.value;
      const updatedProducts = currentProducts.map(p =>
        p.id === product.id ? updateProduct : p
      );
      this.productsSubject.next(updatedProducts);
      return updateProduct;
    }catch(error){
      console.error('Error al actualizar producto', error);
      throw error;
    }
  }

  async deleteProduct(id: number): Promise<void>{
    try{
      await this.storageService.deleteProduct(id);
      const currentProducts = this.productsSubject.value;
      const updatedProducts = currentProducts.filter(p => p.id !== id);
      this.productsSubject.next(updatedProducts);
    }catch(error){
      console.error('Error al eliminar producto', error);
      throw error;
    }
  }

  async updateProductStatus(id: number, status: ProductStatus): Promise<Product>{
    const currentProducts = this.productsSubject.value;
    const product = currentProducts.find(p => p.id === id);

    if(!product){
      throw new Error('Producto no encontrado');
    }

    const updatedProduct = { ...product, status };
    return this.updateProduct(updatedProduct);
  }
}
