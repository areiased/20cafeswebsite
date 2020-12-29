import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';

import { ProdutosService } from '../produtos.service';
import { Produtos } from '../produtos.model';
import { AuthService } from '../auth.service';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-shoppage',
  templateUrl: './shoppage.component.html',
  styleUrls: ['./shoppage.component.scss']
})
export class ShoppageComponent implements OnInit {

  currentlySelectedProductId: null;
  products: Produtos[];
  productsCollection: AngularFirestoreCollection;

  constructor(private produtosService: ProdutosService,
              public authService: AuthService,
              private toastr: ToastrService,
              private firestore: AngularFirestore,
              private firestorage: AngularFireStorage,)
              {

  }

  ngOnInit(): void {
    this.produtosService.getAllProducts().subscribe(data => {
      this.products = data.map(e => {
        return {
          id: e.payload.doc.id,
          productImageUrl: e.payload.doc.get('productImageUrl'),
          productImagePath: e.payload.doc.get('productImagePath'),
          description: e.payload.doc.get('description'),
          name: e.payload.doc.get('name'),
          basePrice: e.payload.doc.get('basePrice'),
          stock: e.payload.doc.get('stock'),
          createdAt: e.payload.doc.get('createdAt'),
          updatedAt: e.payload.doc.get('updatedAt'),
        } as Produtos;
      });
    });
  }

  viewProduct(productId) {
    this.currentlySelectedProductId = productId;
  }

  closeProduct(productId) {
    this.currentlySelectedProductId = null;
  }
}
