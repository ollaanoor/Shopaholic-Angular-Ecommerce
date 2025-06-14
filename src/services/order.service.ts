import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/orders';
  //   orders = signal<any>(null);

  constructor(private http: HttpClient, private authService: AuthService) {}

  placeOrder(orderData: any) {
    // const userData = localStorage.getItem('userToken');
    // if (!userData) return null;

    // const { userId } = JSON.parse(userData);
    // orderData.userId = userId;

    return this.http.post<any>(this.apiUrl, orderData);
  }

  getOrders() {
    const userData = localStorage.getItem('userToken');
    if (!userData) return null;

    return this.http.get<any[]>(this.apiUrl);
  }

  getUserOrders(userId: string) {
    const userData = localStorage.getItem('userToken');
    if (!userData) return null;

    return this.http.get<any[]>(`${this.apiUrl}?userId=${userId}`);
  }

  cancelOrder(orderId: string) {
    const userData = localStorage.getItem('userToken');
    if (!userData) return null;

    return this.http.delete(`${this.apiUrl}/${orderId}`);
  }

  updateOrderStatus(orderId: string, status: string) {
    const userData = localStorage.getItem('userToken');
    if (!userData) return null;

    return this.http.patch(`${this.apiUrl}/${orderId}`, { status });
  }
}
