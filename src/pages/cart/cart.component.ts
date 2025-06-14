import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { RouterModule, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterModule, RouterModule],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  constructor(
    private router: Router,
    public productService: ProductService,
    public authService: AuthService,
    public orderService: OrderService,
    private toastService: ToastService
  ) {}

  increaseQuantity(item: any) {
    this.productService.increaseQuantity(item);
  }

  decreaseQuantity(item: any) {
    this.productService.decreaseQuantity(item);
  }

  removeFromCart(item: any) {
    this.productService.removeFromCart(item);
  }

  getTotal(): number {
    return this.productService.cart().reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }

  placeOrder() {
    const userData = localStorage.getItem('userToken');
    if (!userData) return;

    const { userId } = JSON.parse(userData);
    const orderData = {
      userId,
      username: this.authService.user().username,
      items: this.productService.cart(),
      date: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      total: this.getTotal(),
      status: 'Pending',
    };

    this.orderService.placeOrder(orderData)?.subscribe((response) => {
      // Clear cart after placing order
      this.productService.clearCart();
      this.toastService.showSuccess('Order placed successfully.');
      // Redirect to home page or show success message
      this.router.navigate(['']);
    });
  }
}
