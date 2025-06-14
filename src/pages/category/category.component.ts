import { Component, effect, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category.component.html',
})
export class CategoryComponent {
  categoryTitle = signal<string>('');
  products = signal<any[]>([]);

  searchTerm: string = '';
  currentPage = 1;
  pageSize = 20;

  constructor(
    private route: ActivatedRoute,
    public productService: ProductService
  ) {
    this.route.paramMap.subscribe((params) => {
      const categorySlug = params.get('slug'); 
      this.categoryTitle.set(categorySlug ?? 'Category'); 

      // **Effect ensures products update when ProductService data loads**
      effect(() => {
        const allProducts = this.productService.products();
        if (allProducts.length > 0) {
          this.products.set(
            this.filterProductsByCategory(this.categoryTitle(), allProducts)
          );
        }
      });
    });
  }

  // filterProductsByCategory(categorySlug: string | null): any[] {
  //   if (!categorySlug) return this.productService.products();
  //   return this.productService
  //     .products()
  //     .filter((product) => product.category === categorySlug);
  // }
  filterProductsByCategory(categorySlug: string | null, allProducts: any[]): any[] {
    if (!categorySlug) return allProducts;
    return allProducts.filter((product) => product.category === categorySlug);
  }


  get totalPages(): number {
    return Math.ceil(this.productService.products().length / this.pageSize);
  }

  filterProducts() {
    this.productService.filterProducts(this.searchTerm);
  }

  toggleWishlist(product: any) {
    this.productService.toggleWishlist(product);
  }

  isInWishlist(product: any): boolean {
    return this.productService.isInWishlist(product);
  }

  addToCart(product: any) {
    this.productService.addToCart(product);
  }

  isInCart(product: any): boolean {
    return this.productService.isInCart(product);
  }
}
