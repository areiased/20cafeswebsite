import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Produtos } from './produtos.model';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {

  products: Observable<Produtos[]>;
  productsCollection: AngularFirestoreCollection<Produtos>;

  constructor(private readonly firestore: AngularFirestore) { }

  getAllProducts() {
    return this.firestore.collection('produtos', prod => prod.orderBy('updatedAt')).snapshotChanges();
  }

  createProduct(product: Produtos) {
    return new Promise<any>((resolve, reject) =>{
        this.firestore
            .collection('produtos')
            .add(product)
            .then(res => {}, err => reject(err));
    });
  }

  // createProduct(product: Produtos){
  //   console.log('tentamos criar um produto!');
  //   console.log(product);
  //   return this.firestore.collection('produtos').add(product);
  // }

  updateProduct(product: Produtos){
    delete product.id;
    this.firestore.doc('produtos/' + product.id).update(product);
  }

  deleteProduct(productId: string){
    this.firestore.doc('produtos/' + productId).delete();
  }

}
