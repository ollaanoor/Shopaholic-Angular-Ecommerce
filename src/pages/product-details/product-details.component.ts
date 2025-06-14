import { Component, signal, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent {
  product = signal<any | null>(null);

  selectedSize: string = '';
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    public productService: ProductService
  ) {
    // Extract the product ID from the route and load its details
    this.route.paramMap.subscribe((params) => {
      const productId = params.get('id');
      if (productId) {
        this.loadProduct(productId);
      }
    });
  }

  loadProduct(productId: string) {
    this.productService.getProductDetails(productId).subscribe((res) => {
      this.product.set(res);
      // If sizes exist, default to the first one.
      if (res.sizes && res.sizes.length > 0) {
        this.selectedSize = res.sizes[0];
      }
    });
  }

  // Increments the quantity.
  incrementQuantity() {
    this.quantity++;
  }

  // Decrements the quantity (cannot go below 1).
  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (this.product()) {
      const productToAdd = {
        ...this.product(),
        selectedSize: this.selectedSize,
        quantity: this.quantity,
      };
      this.productService.addToCart(productToAdd);
    }
  }

  toggleWishlist() {
    // If the product exists and is not already in the wishlist, add it.
    if (this.product() && !this.productService.isInWishlist(this.product())) {
      this.productService.toggleWishlist(this.product());
    }
  }
}
