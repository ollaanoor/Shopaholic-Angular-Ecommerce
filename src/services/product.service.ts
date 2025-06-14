import { Injectable, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  categories = signal<any[]>([]);
  products = signal<any[]>([]);
  filteredProducts = signal<any[]>([]);

  wishlist = signal<any[]>([]);
  cart = signal<any[]>([]);

  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private authService: AuthService, private toastService: ToastService) {
    this.http.get<any[]>(`${this.apiUrl}/categories`).subscribe((data) => {
      this.categories.set(data);
    });

    this.http.get<any[]>(`${this.apiUrl}/products`).subscribe((data) => {
      this.products.set(data);
      this.filteredProducts.set(data);
    });

    // React to login / logout
    effect(() => {
      const id = this.authService.user()?.id;
      if (id) {
        this.loadUserData(id);
      } else {
        this.wishlist.set([]);
        this.cart.set([]);
      }
    });
  }

  loadUserData(userId: string) {
    this.http.get<any>(`${this.apiUrl}/users/${userId}`).subscribe((user) => {
      this.wishlist.set(user.wishlist || []);
      this.cart.set(user.cart || []);
    });
  }

  // clearUserData() {
  //   this.wishlist.set([]);
  //   this.cart.set([]);
  // }

  filterProducts(searchTerm: string) {
    const term = searchTerm.toLowerCase().trim();
    const filtered = this.products().filter((product) =>
      product.title.toLowerCase().includes(term)
    );
    this.filteredProducts.set(filtered);
  }

  // Fetch product details by ID
  getProductDetails(productId: string) {
    return this.http.get<any>(`${this.apiUrl}/products/${productId}`);
  }

  // Fetch products by category
  getProductsByCategory(categorySlug: string) {
    return this.http.get<any[]>(
      `${this.apiUrl}/products?category=${categorySlug}`
    );
  }

  addProduct(newProduct: any) {
    this.http
      .post<any[]>(`${this.apiUrl}/products`, newProduct)
      .subscribe((product) => {
        this.products.set([...this.products(), product]);
        this.toastService.showSuccess("Product added successfully");
      });
  }

  updateProduct(productId: string, updatedProduct: any) {
    this.http
      .put<any>(`${this.apiUrl}/products/${productId}`, updatedProduct)
      .subscribe(() => {
        const updatedProducts = this.products().map((product) =>
          product.id === productId ? updatedProduct : product
        );
        this.products.set(updatedProducts);
        this.toastService.showSuccess("Product updated successfully");
      });
  }

  deleteProduct(productId: string) {
    this.http.delete(`${this.apiUrl}/products/${productId}`).subscribe(() => {
      const updatedProducts = this.products().filter(
        (product) => product.id !== productId
      );
      this.products.set(updatedProducts);
      this.toastService.showSuccess("Product deleted successfully");
    });
  }

  saveCart() {
    const userId = this.authService.getUserId();

    this.http
      .patch(`${this.apiUrl}/users/${userId}`, { cart: this.cart() })
      .subscribe(() => console.log('Cart updated:', this.cart()));
  }

  addToCart(product: any) {
    const userId = this.authService.getUserId();
    if (!userId) {
      alert('Please log in to add to your cart.');
      return;
    }

    // Check if the product already exists in the cart
    const cart = this.cart();
    const existingItem = cart.find((item) => item.id === product.id);

    // If it exists, increase the quantity; otherwise, add it to the cart
    if (existingItem) {
      existingItem.quantity += product.quantity || 1;
    } else {
      product.quantity = product.quantity || 1;
      product.selectedSize = product.selectedSize || product.sizes?.[0] || '';
      cart.push(product);
    }

    this.saveCart();
    this.cart.set(cart);
    this.toastService.showSuccess("Product added to cart");
  }

  removeFromCart(item: any) {
    this.cart.set(this.cart().filter((i) => i.id !== item.id));
    this.saveCart();
    this.toastService.showSuccess("Product removed from cart");
  }

  clearCart() {
    this.cart.set([]);
    this.saveCart();
  }

  increaseQuantity(item: any) {
    const cart = this.cart();
    const index = cart.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      cart[index].quantity += 1;
      this.cart.set(cart);
      this.saveCart();
    }
  }

  decreaseQuantity(item: any) {
    const cart = this.cart();
    const index = cart.findIndex((i) => i.id === item.id);
    if (index !== -1 && cart[index].quantity > 1) {
      cart[index].quantity -= 1;
      this.cart.set(cart);
      this.saveCart();
    }
  }

  toggleWishlist(product: any) {
    const userId = this.authService.getUserId();
    if (!userId) {
      alert('Please log in to modify your wishlist.');
      return;
    }

    this.http.get<any>(`${this.apiUrl}/users/${userId}`).subscribe((user) => {
      let wishlist = user.wishlist || [];
      const exists = wishlist.some(
        (item: { id: any }) => item.id === product.id
      );

      // wishlist = exists
      //   ? wishlist.filter((item: { id: any }) => item.id !== product.id)
      //   : [...wishlist, product];

      if (exists) {
         wishlist = wishlist.filter((item: { id: any }) => item.id !== product.id)
        this.toastService.showSuccess("Product removed from wishlist");
      } else {
        wishlist = [...wishlist, product];
        this.toastService.showSuccess("Product added to wishlist");
      }

      this.http
        .patch(`${this.apiUrl}/users/${userId}`, { wishlist })
        .subscribe(() => {
          this.wishlist.set(wishlist);
          console.log('Wishlist updated:', this.wishlist());
        });
    });
  }

  isInCart(product: any): boolean {
    return this.cart().some((item) => item.id === product.id);
  }

  isInWishlist(product: any): boolean {
    return this.wishlist().some((item) => item.id === product.id);
  }
}
