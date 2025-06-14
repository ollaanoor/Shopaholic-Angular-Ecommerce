import { Component, effect, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  user = signal<any | null>(null);
  editing = signal<boolean>(false);
  orders = signal<any[]>([]);

  // userData = { username: '', email: '' };
  profileForm!: FormGroup;

  expandedOrder: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private orderService: OrderService,
    private toastService: ToastService
  ) {
    this.profileForm = this.formBuilder.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        gender: ['', Validators.required],
        password: ['', [Validators.minLength(6)]],
        confirmPassword: [''],
      },
      { validators: this.passwordMatchValidator }
    );

    effect(() => {
      // this.user.set(this.authService.user());
      const userInfo = this.authService.user();
      if (userInfo) {
        this.user.set(userInfo);
        // this.userData = { ...userInfo };
        this.profileForm.patchValue(userInfo);
      }

      const userId = this.authService.getUserId();
      if (userId) {
        this.orderService.getUserOrders(userId)?.subscribe((orders: any[]) => {
          this.orders.set(orders);
        });
      } else {
        this.orders.set([]);
      }
    });
  }

  toggleEdit() {
    this.editing.set(!this.editing());
  }

  saveChanges() {
    if (this.profileForm.invalid) return;
    const updatedUser = {
      ...this.profileForm.value,
      id: this.user().id,
    };
    this.authService.updateUser(updatedUser).subscribe(() => {
      this.user.set(updatedUser);
      this.toggleEdit();
      this.toastService.showSuccess('Profile updated successfully');
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  cancelOrder(orderId: string) {
    this.orderService.cancelOrder(orderId)?.subscribe(() => {
      this.orders.set(this.orders().filter((order) => order.id !== orderId));
      this.toastService.showSuccess('Your order has been cancelled');
    });
  }

  toggleDetails(orderId: string) {
    this.expandedOrder = this.expandedOrder === orderId ? null : orderId;
  }
}
