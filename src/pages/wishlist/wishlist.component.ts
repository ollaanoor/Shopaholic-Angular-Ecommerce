import { Component } from '@angular/core';
// import { AuthService } from '../../services/auth.service';
// import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule, RouterModule],
  templateUrl: './wishlist.component.html',
})
export class WishlistComponent {
  // wishlist: any[] = [];

  // constructor(private http: HttpClient, private authService: AuthService) {}

  // ngOnInit() {
    // const userId = this.authService.getUserId();
    // if (!userId) {
    //   alert('Please log in to view your wishlist.');
    //   return;
    // }

    // this.http.get<any>(`http://localhost:3000/users/${userId}`).subscribe(
    //   (user) => {
    //     this.wishlist = user.wishlist || [];
    //     console.log('Wishlist loaded:', this.wishlist);
    //   },
    //   (error) => {
    //     console.error('Error loading wishlist:', error);
    //   }
    // );
  // }
  

  constructor(public productService: ProductService) {}

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
