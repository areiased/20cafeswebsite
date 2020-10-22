import { Component, OnInit } from '@angular/core';
import { ProdutosService } from '../../produtos.service';
import { Produtos } from '../../produtos.model';
import { AuthService } from '../../auth.service';
import { ToastrService } from 'ngx-toastr';
import { finalize, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-storeeditpage',
  templateUrl: './storeeditpage.component.html',
  styleUrls: ['./storeeditpage.component.scss']
})
export class StoreeditpageComponent implements OnInit {

  selectedProductImage: File = null;
  downloadURL: Observable<string>;

  products: Produtos[];
  productsCollection: AngularFirestoreCollection;

  constructor(private produtosService: ProdutosService,
              public authService: AuthService,
              private toastr: ToastrService,
              private firestore: AngularFirestore,
              private firestorage: AngularFireStorage,
              ) {}

  productForm = new FormGroup({
    name: new FormControl('', [ Validators.required, Validators.minLength(4), Validators.maxLength(30) ]),
    description: new FormControl('', [ Validators.required, Validators.minLength(5), Validators.maxLength(200) ]),
    basePrice: new FormControl('', [ Validators.required, Validators.minLength(4), Validators.maxLength(6),
      Validators.pattern('^[0-9]\\d*(\\.\\d{1,2})?$') ]),
    stock: new FormControl('', [ Validators.required, Validators.minLength(1), Validators.maxLength(3),
      Validators.pattern('^[0-9]\\?$') ]),
    createdAt: new FormControl(Date()),
    updatedAt: new FormControl(Date()),
  });

  ngOnInit() {
    this.produtosService.getAllProducts().subscribe(data => {
      this.products = data.map(e => {
        return {
          id: e.payload.doc.id,
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

  processUploadedFile(uploadedFile) {
    const n = Date.now();
    const file = uploadedFile.target.files[0];
    const filePath = `ProductImages/${n}`;
    const fileRef = this.firestorage.ref(filePath);
    const task = this.firestorage.upload(`RoomsImages/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.fb = url;
            }
            console.log(this.fb);
          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
  }

  showSuccessToaster(message: string) {
    this.toastr.success(message);
  }

  showErrorToaster(message: string) {
    this.toastr.error(message);
  }

  onSubmit() {
    if (this.productForm.valid) {
      let productDetails = this.productForm.value;
      productDetails.basePrice = this.productForm.value.basePrice;
      this.createProduct(productDetails)
        .then(res => {
          this.showSuccessToaster('O produto foi criado com sucesso!');
          this.productForm.reset();
      });}
    else {
      this.showErrorToaster('Tens algo de errado no que introduziste!');
    }
}

  createProduct(productDetails: Produtos){
    return new Promise<any>((resolve, reject) =>{
      this.firestore
          .collection('produtos')
          .add(productDetails)
          .then(res => {this.showSuccessToaster('O produto "' + productDetails.name + '" foi criado com sucesso!');},
            err => reject(err));
    });
  }

  update(product: Produtos) {
    this.produtosService.updateProduct(product);
    this.showSuccessToaster('asd');
  }

  deleteProduct(id: string, name: string) {
      this.produtosService.deleteProduct(id);
      this.showSuccessToaster('O produto "' + name + '" foi REMOVIDO!');
  }
}
