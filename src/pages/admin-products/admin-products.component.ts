import { Component, signal } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-products',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.component.html',
  styles: ``,
})
export class AdminProductsComponent {
  selectedProduct = signal<any | null>(null);
  isModalOpen = signal(false);
  modalTitle = signal('Add Product');
  actionButtonText = signal('Create');

  products = signal<any[]>([]);
  searchTerm = '';

  selectedProductData = {
    id: '',
    title: '',
    category: '',
    image: '',
    price: '',
    sizes: [],
    description: '',
  };

  constructor(private productService: ProductService) {
    this.loadProducts();
  }

  loadProducts() {
    this.products.set(this.productService.products());
  }

  filteredProducts() {
    const all = this.productService.products();
    const term = this.searchTerm.toLowerCase().trim();

    return term ? all.filter((p) => p.title.toLowerCase().includes(term)) : all;
  }

  addProduct() {
    this.isModalOpen.set(true);
  }

  openModal(product: any | null = null) {
    if (product) {
      // this.selectedProduct.set({ ...product });
      this.selectedProductData = {
        ...product,
        sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : '', // Convert array to string
      };
      this.modalTitle.set('Update Product');
      this.actionButtonText.set('Update');
    } else {
      // this.selectedProduct.set({
      //   title: '',
      //   category: '',
      //   image: '',
      //   price: '',
      //   sizes: '',
      //   description: '',
      // });
      this.selectedProductData = {
        id: '',
        title: '',
        category: '',
        image: '',
        price: '',
        sizes: [],
        description: '',
      };
      this.modalTitle.set('Add Product');
      this.actionButtonText.set('Add');
    }
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.selectedProduct.set(null);
  }

  submitProduct(formValues: any) {
    const formattedValues = {
      ...formValues,
      sizes: formValues.sizes
        ? formValues.sizes.split(',').map((size: string) => size.trim())
        : [],
    };

    console.log(formattedValues);
    if (this.selectedProductData.id) {
      // Update existing product
      this.productService.updateProduct(this.selectedProductData.id, formattedValues);
      this.loadProducts();
      this.closeModal();
    } else {
      // Create new product
      this.productService.addProduct(formattedValues);
      this.loadProducts();
      this.closeModal();
    }
  }

  // submitProduct(formValues: any) {
  //   this.productService.addProduct(formValues).subscribe(() => {
  //     this.loadProducts(); // refresh list
  //     this.isModalOpen.set(false);
  //   });
  // }

  deleteProduct(productId: string) {
    this.productService.deleteProduct(productId);
    this.loadProducts();
  }

  updateProduct(product: any) {
    this.productService.updateProduct(product.id, product);
    this.loadProducts();
  }
}
