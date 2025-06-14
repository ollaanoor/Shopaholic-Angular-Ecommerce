import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  isMenuOpen = false;
  isCategoriesOpen = false;
  // isLoggedIn = false;
  // username: string | null = null;

  // Using a signal for the dropdown state. When it changes, Angular updates the UI.
  isProfileDropdownOpen = signal(false);

  // Using a signal for the cart count. When it changes, Angular updates the UI.
  cartCount = signal(0);

  constructor(
    public authService: AuthService,
    public productService: ProductService
  ) {}

  getHomeLink(): string {
    const user = this.authService.user();
    if (user?.role === 'admin') {
      return '/admin/products';
    }
    return '/';
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleCategories() {
    this.isCategoriesOpen = !this.isCategoriesOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.isCategoriesOpen = false;
  }

  toggleProfileDropdown() {
    this.isProfileDropdownOpen.set(!this.isProfileDropdownOpen());
  }

  closeProfileDropdown() {
    this.isProfileDropdownOpen.set(false);
  }

  logout() {
    this.authService.logout();
    this.closeProfileDropdown();
  }

  getCartCount() {
    const cart = this.productService.cart();
    return cart ? cart.length : 0;
  }

  // private apiUrl = 'http://localhost:3000/categories';
  // categories: any[] = [];

  // getCategories() {
  //   return this.http.get<any[]>(this.apiUrl);
  // }

  // ngOnInit() {
  //    // Check if user is logged in
  //   const userToken = localStorage.getItem('userToken');
  //   if (userToken) {
  //     this.isLoggedIn = true;
  //     const userData = JSON.parse(userToken);
  //     this.username = userData.username;
  //   } else {
  //     this.isLoggedIn = false;
  //     this.username = null;
  //   }

  //   // Fetch categories from the API
  //   this.getCategories().subscribe((data) => {
  //     this.categories = data;
  //   });
  // }
}
