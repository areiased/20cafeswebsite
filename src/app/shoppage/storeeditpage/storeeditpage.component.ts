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
  public imagePath: string = null;
  public currentlySelectedFile: any = null;
  public currentlySelectedImagePreview: any = null;
  products: Produtos[];
  productsCollection: AngularFirestoreCollection;
  user: any;
  editingProduct = false;

  constructor(private produtosService: ProdutosService,
              public authService: AuthService,
              private toastr: ToastrService,
              private firestore: AngularFirestore,
              private firestorage: AngularFireStorage,
              ) {}

  productForm = new FormGroup({
    id: new FormControl({value: '', disabled: true}),
    name: new FormControl('', [ Validators.required, Validators.minLength(4), Validators.maxLength(30) ]),
    description: new FormControl('', [ Validators.required, Validators.minLength(5), Validators.maxLength(1000) ]),
    basePrice: new FormControl('', [ Validators.required, Validators.minLength(4), Validators.maxLength(6),
      Validators.pattern('^[0-9]\\d*(\\.\\d{1,2})?$') ]),
    stock: new FormControl('', [ Validators.required, Validators.minLength(1), Validators.maxLength(3),
      Validators.min(0), Validators.max(999) ]),
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
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile.target.files[0]);
    reader.onload = (_event) => { 
      this.currentlySelectedImagePreview = reader.result; 
    }
  }

  processUploadedFile(uploadedFile): Promise<any> {
    return new Promise((resolve, reject) => {
    this.imagePath = null;
    this.imageUrl = null;
    const dateNow = new Date();
    const name = uploadedFile.name.substring(0, 20).replace(/\s/g, '');
    const file = uploadedFile;
    const filePath = `product_images/${name}_${dateNow.toISOString()}`;
    const fileRef = this.firestorage.ref(filePath);
    const task = this.firestorage.upload(`product_images/${name}_${dateNow.toISOString()}`, file);
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
      if (!this.imageUrl) {
        this.processUploadedFile(this.currentlySelectedFile).then((res) => {
          if (this.imageUrl) {
            const dateNow = new Date();
            this.productForm.value.productImageUrl = this.imageUrl;
            this.productForm.value.productImagePath = this.imagePath;
            this.productForm.value.createdAt = dateNow.toISOString();
            this.productForm.value.updatedAt = dateNow.toISOString();
            let productDetails = this.productForm.value;
            this.createProduct(productDetails)
            .then(res => {
              this.imageUrl = null;
              this.imagePath = null;
              this.currentlySelectedFile = null;
              this.productForm.reset();
            });
          }
          else {
            this.showErrorToaster('Ocorreu algo de errado ao dar upload do ficheiro! (URL do ficheiro após upload não encontrado, o upload falhou?)');
          }
        });
      }
      if (this.imageUrl) {
        const dateNow = new Date();
        this.productForm.value.productImageUrl = this.imageUrl;
        this.productForm.value.productImagePath = this.imagePath;
        this.productForm.value.createdAt = dateNow.toISOString();
        this.productForm.value.updatedAt = dateNow.toISOString();
        let productDetails = this.productForm.value;
        this.createProduct(productDetails)
        .then(res => {
          this.imageUrl = null;
          this.imagePath = null;
          this.currentlySelectedFile = null;
          this.productForm.reset();
        });
      }
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
                        this.imagePath = null;
                        this.currentlySelectedFile = null;
                        this.currentlySelectedImagePreview = null;
          },
            err => reject(err));
    });
  }

  updateForm(product) {
    this.editingProduct = true;
    this.imagePath = product.productImagePath;
    this.imageUrl = product.productImageUrl;
    this.productForm.setValue({
      id: product.id,
      name: product.name,
      description: product.description,
      basePrice: product.basePrice,
      stock: product.stock,
    });
  }

  cancelProductEdit() {
    this.productForm.reset();
    this.imageUrl = null;
    this.imagePath = null;
    this.currentlySelectedFile = null;
    this.editingProduct = false;
    this.currentlySelectedImagePreview = null;
  }

  updateProduct() {
    if (this.productForm.valid) {
      const id = this.productForm.getRawValue().id;

      if (this.currentlySelectedFile) {
        this.produtosService.deleteProductImage(this.imagePath); // delete old image
        this.imagePath = null;
        this.imageUrl = null;
        this.processUploadedFile(this.currentlySelectedFile) // create and upload new image, returns path and URL to imagePath and imageUrl vars
        .then((res) => {
          this.produtosService.updateProduct(id, this.productForm.getRawValue(), this.imagePath, this.imageUrl);
          this.productForm.reset();
          this.imageUrl = null;
          this.imagePath = null;
          this.editingProduct = false;
          this.currentlySelectedFile = null;
          this.currentlySelectedImagePreview = null;
          this.showSuccessToaster('O produto foi atualizado com sucesso.');
        });
      } else {
        this.produtosService.updateProduct(id, this.productForm.getRawValue(), this.imagePath, this.imageUrl);
        this.productForm.reset();
        this.imageUrl = null;
        this.imagePath = null;
        this.editingProduct = false;
        this.currentlySelectedFile = null;
        this.currentlySelectedImagePreview = null;
        this.showSuccessToaster('O produto foi atualizado com sucesso.');
      }
    } else {
      this.showErrorToaster('Oops, algo correu mal! Verifica se tens os campos todos corretos.');
    }
  }

  deleteProduct(id: string, name: string, productImagePath: string) {
      this.produtosService.deleteProduct(id, productImagePath);
      this.showSuccessToaster('O produto "' + name + '" foi REMOVIDO com sucesso, juntamente com a sua imagem!');
  }
}
