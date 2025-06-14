import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { RouterModule } from '@angular/router';
import { AboutComponent } from '../about/about.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, RouterModule, AboutComponent],
  templateUrl: './home.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent {
  swiperConfig = {
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    navigation: true,
    breakpoints: {
      640: { slidesPerView: 2, spaceBetween: 20 },
      768: { slidesPerView: 3, spaceBetween: 24 },
      1024: { slidesPerView: 4, spaceBetween: 24 },
    },
  };

  // private CategoryApiUrl = 'http://localhost:3000/categories';
  // private ProductApiUrl = 'http://localhost:3000/products';

  // categories: any[] = [];
  // products: any[] = [];
  searchTerm: string = '';
  // filteredProducts: any[] = [];

  currentPage = 1;
  pageSize = 8;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    public productService: ProductService
  ) {}

  // ngOnInit() {
  //   this.getCategories().subscribe((data) => {
  //     this.categories = data;
  //   });

  //   this.getProducts().subscribe((data) => {
  //     this.products = data;
  //   });
  // }

  // getCategories() {
  //   return this.http.get<any[]>(this.CategoryApiUrl);
  // }

  // getProducts() {
  //   return this.http.get<any[]>(this.ProductApiUrl);
  // }

  // // getFilteredProducts() {
  // //   if (!this.searchTerm.trim()) return this.products;
  // //   return this.products.filter((product) =>
  // //     product.title.toLowerCase().includes(this.searchTerm.toLowerCase())
  // //   );
  // // }
  // getFilteredProducts() {
  //   const term = this.searchTerm.toLowerCase().trim();

  //   this.filteredProducts = this.products.filter((product) =>
  //     product.title.toLowerCase().includes(term)
  //   );
  // }

  get totalPages(): number {
    return Math.ceil(this.productService.products().length / this.pageSize);
  }

  // getCategories() {
  //   return this.productService.categories();
  // }

  // getProducts() {
  //   return this.productService.products();
  // }

  // getFilteredProducts() {
  //   return this.productService.filteredProducts();
  // }

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
