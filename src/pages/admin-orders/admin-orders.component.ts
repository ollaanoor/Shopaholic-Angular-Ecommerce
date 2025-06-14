import { Component, signal } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-orders',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-orders.component.html',
  styles: ``,
})
export class AdminOrdersComponent {
  orders = signal<any[]>([]);

  constructor(
    private orderService: OrderService,
    public authService: AuthService,
    private toastService: ToastService
  ) {
    this.loadOrders();
  }

  // expandedOrder = signal<number | null>(null);
  expandedOrder: string | null = null;

  toggleDetails(orderId: string) {
    this.expandedOrder = this.expandedOrder === orderId ? null : orderId;
  }

  loadOrders() {
    this.orderService.getOrders()?.subscribe((data) => {
      this.orders.set(data);
    });
  }

  updateOrderStatus(orderId: string, status: string) {
    this.orderService.updateOrderStatus(orderId, status)?.subscribe(() => {
      this.loadOrders();
      this.toastService.showSuccess('Order status updated');
    });
  }
}
