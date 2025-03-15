import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private dbNombre = 'db_productos';
  private storeNombre = 'store_productos';
  private db: IDBDatabase | null = null;

  constructor() { 
    this.inicializarIndexedDB();
  }

  private inicializarIndexedDB(): Promise<IDBDatabase>{
    return new Promise((resolve, reject) =>{
      if(this.db){
        resolve(this.db);
        return;
      }

      const request = indexedDB.open(this.dbNombre, 1);

      request.onerror = (event) => {
        console.error('Error al abrir la Base de datos indexada', event);
        reject('Error al abrir la Base de datos indexada');
      };

      request.onsuccess = (event) =>{
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) =>{
        const db = (event.target as IDBOpenDBRequest).result;

        if(!db.objectStoreNames.contains(this.storeNombre)){
          db.createObjectStore(this.storeNombre, {keyPath: 'id', autoIncrement: true});
        }
      };
    });
  }

  //CRUD DE BBDD

  async getAllProducts<T>(): Promise<T[]> {
    const db = await this.inicializarIndexedDB();
    return new Promise((resolve, reject) =>{
      const transaction = db.transaction(this.storeNombre, 'readonly');
      const store = transaction.objectStore(this.storeNombre);
      const request = store.getAll();

      request.onsuccess = () =>{
        resolve(request.result as T[]);
      };

      request.onerror = (event) =>{
        reject('Error al obtener todos los productos' + (event.target as IDBRequest).error);
      };
    });
  }

  async addProduct<T>(producto: T): Promise<T>{
    const db = await this.inicializarIndexedDB();
    return new Promise((resolve, reject) =>{
      const transaction = db.transaction(this.storeNombre, 'readwrite');
      const store = transaction.objectStore(this.storeNombre);
      const request = store.add(producto);

      request.onsuccess = (event)  =>{
        const id = (event.target as IDBRequest).result;
        resolve({...producto, id} as T);
      };

      request.onerror = (event) =>{
        reject('Error al agregar el producto' + (event.target as IDBRequest).error);
      };
    });
  }

  async updateProduct<T extends { id: number }>(item: T): Promise<T> {
    const db = await this.inicializarIndexedDB();
    return new Promise((resolve, reject) =>{
      const transaction = db.transaction(this.storeNombre, 'readwrite');
      const store = transaction.objectStore(this.storeNombre);
      const request = store.put(item);

      request.onsuccess = () =>{
        resolve(item);
      };

      request.onerror = (event) =>{
        reject('Error al obtener el producto' + (event.target as IDBRequest).error);
      }
    });
  }

  async deleteProduct(id: number): Promise<void>{
    const db = await this.inicializarIndexedDB();
    return new Promise((resolve, reject) =>{
      const transaction = db.transaction(this.storeNombre, 'readwrite');
      const store = transaction.objectStore(this.storeNombre);
      const request = store.delete(id);

      request.onsuccess = () =>{
        resolve();
      };

      request.onerror = (event) =>{
        reject('Error al eliminar el producto' + (event.target as IDBRequest).error);
      };
    });
  }

}
