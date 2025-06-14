import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { ProductService } from './product.service';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //   private currentUserId: number | null = null;
  private apiUrl = 'http://localhost:3000';
  user = signal<any>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastService: ToastService
  ) {
    // Check if user is logged in on service initialization
    // const userData = localStorage.getItem('userToken');
    // if (userData) {
    //   const { user } = JSON.parse(userData);
    //   this.user.set(user);
    // }
    const storedData = localStorage.getItem('userToken');
    if (storedData) {
      const parsed = JSON.parse(storedData);
      const now = new Date().getTime();

      if (now > parsed.expiresAt) {
        // Token expired, clear stored data
        this.logout();
      } else {
        // Fetch user details using the token
        this.http
          .get(`${this.apiUrl}/users/${parsed.userId}`)
          .subscribe((user) => {
            this.user.set(user);
          });
      }
    }
  }

  //   login(userId: number) {
  //     this.currentUserId = userId;
  //     localStorage.setItem('userId', userId.toString());
  //   }

  //   logout() {
  //     this.currentUserId = null;
  //     localStorage.removeItem('userToken');
  //   }

  register(userData: any) {
    return this.http
      .post<any>(`${this.apiUrl}/register`, userData)
      .subscribe((response) => {
        // Set user in the signal
        this.user.set(response.user);
        // Set expiry time (after 1 hour) -> to match json-server-auth
        const expiresAt = new Date().getTime() + 60 * 60 * 1000;

        // Store user token in local storage
        localStorage.setItem(
          'userToken',
          JSON.stringify({
            token: response.accessToken,
            expiresAt: expiresAt,
            userId: response.user.id,
          })
        );

        // Redirect to home page
        if (this.user()?.role === 'admin') {
          this.router.navigate(['/admin/products']);
        } else {
          this.router.navigate(['']);
        }
      });
  }

  login(credentials: { email: string; password: string }) {
    return this.http
      .post(`${this.apiUrl}/login`, credentials, { withCredentials: true })
      .subscribe((response: any) => {
        this.user.set(response.user);
        // this.productService.loadUserData(); // Load favorites & cart after login
        // Set expiry time (after 1 hour) -> to match json-server-auth
        const expiresAt = new Date().getTime() + 60 * 60 * 1000;
        // Store the user data in local storage
        localStorage.setItem(
          'userToken',
          JSON.stringify({
            token: response.accessToken,
            expiresAt: expiresAt,
            userId: response.user.id,
          })
        );

        // Redirect to home page
        if (this.user()?.role === 'admin') {
          this.router.navigate(['/admin/products']);
        } else {
          this.router.navigate(['']);
        }
      });
  }

  logout() {
    this.user.set(null);
    localStorage.removeItem('userToken');
    this.router.navigate(['/login']);
    // this.productService.clearUserData();
  }

  // getUserId(): number | null {
  //   return this.user()?.id || null;
  // }

  // loadUserData() {
  //   const userId = this.getUserId();
  //   if (!userId) return;

  //   this.http.get<any>(`${this.apiUrl}/users/${userId}`).subscribe(user => {
  //     this.user.set(user);
  //   });
  // }

  getUserId(): string | null {
    const userData = localStorage.getItem('userToken');
    if (userData) {
      // console.log(JSON.parse(userData).user);
      // return JSON.parse(userData).user.id;
      const { token, expiresAt } = JSON.parse(userData);
      const now = new Date().getTime();

      if (now > expiresAt) {
        // Token has expired
        this.logout();
        return null;
      }
      return this.user()?.id;
    }
    return null;
  }

  getUserById(userId: string) {
    return this.http.get(`${this.apiUrl}/users/${userId}`);
  }

  isLoggedIn(): boolean {
    return this.getUserId() !== null;
  }

  updateUser(updatedUser: any) {
    return this.http.patch(
      `${this.apiUrl}/users/${updatedUser.id}`,
      updatedUser
    );
  }

  updatePassword(currentPassword: string, newPassword: string) {
    const userData = localStorage.getItem('userToken');
    if (!userData) return null;

    const { token, userId } = JSON.parse(userData);

    return this.http
      .put(
        `${this.apiUrl}/users/${userId}`,
        {
          password: newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .subscribe(() => {
        this.toastService.showSuccess(
          'Password updated successfully! Please log in again.'
        );
        this.logout();
      });
  }
}
