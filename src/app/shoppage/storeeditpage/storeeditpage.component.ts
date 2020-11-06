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

  downloadURL: Observable<string>;
  public imageUrl: string = null;
  imagePath: string = null;
  public currentlySelectedFile: any = null;
  products: Produtos[];
  productsCollection: AngularFirestoreCollection;
  user: any;

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
      Validators.min(1), Validators.max(999) ]),
  });

  ngOnInit() {
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
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  selectedFileChanged(selectedFile) {
    this.currentlySelectedFile = selectedFile.target.files[0];
  }

  processUploadedFile(uploadedFile): Promise<any> {
    return new Promise((resolve, reject) => {
    const n = Date.now();
    const name = uploadedFile.name.substring(0, 20).replace(/\s/g, '');
    const file = uploadedFile;
    const filePath = `product_images/${name}_${n}`;
    const fileRef = this.firestorage.ref(filePath);
    const task = this.firestorage.upload(`product_images/${name}_${n}`, file);
    this.imagePath = filePath;
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.imageUrl = url;
            }
            console.log(this.imageUrl);
            resolve(this.imageUrl);
          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
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
      this.processUploadedFile(this.currentlySelectedFile).then((res) => {
        if (this.imageUrl) {
          this.productForm.value.productImageUrl = this.imageUrl;
          this.productForm.value.productImagePath = this.imagePath;
          this.productForm.value.createdAt = Date.now();
          this.productForm.value.updatedAt = Date.now();
          let productDetails = this.productForm.value;
          this.createProduct(productDetails)
          .then(res => {
            this.imageUrl = null;
            this.productForm.reset();
          });
        }
        else {
          this.imageUrl = null;
          this.showErrorToaster('F*ck. Ocorreu algo de errado ao dar upload do ficheiro! (URL do ficheiro após upload não encontrado, o upload falhou?)');
        }
      });
    }
    else {
      this.showErrorToaster('YO! Tens algo de errado no que introduziste!');
    }
}

  createProduct(productDetails: Produtos){
    return new Promise<any>((resolve, reject) =>{
      this.firestore
          .collection('produtos')
          .add(productDetails)
          .then(res => {this.showSuccessToaster('O produto "' + productDetails.name + '" foi criado com sucesso!');
                        this.productForm.reset();
                        this.imageUrl = null;
          },
            err => reject(err));
    });
  }

  updateForm(product) {
    this.productForm.setValue({
      name: product.name,
      description: product.description,
      basePrice: product.basePrice,
      stock: product.stock,
    });
  }

  update(product: Produtos) {
    console.log(product);
    
    this.produtosService.updateProduct(product);
    this.showSuccessToaster('asd');
  }

  deleteProduct(id: string, name: string, productImagePath: string) {
      this.produtosService.deleteProduct(id, productImagePath);
      this.showSuccessToaster('O produto "' + name + '" foi REMOVIDO, juntamente com a sua imagem!');
  }
}
