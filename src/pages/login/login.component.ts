import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const userData = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value,
      };

      // this.http
      //   .post<any[]>('http://localhost:3000/login', userData)
      //   .subscribe((response) => {
      //     console.log('Login successful:', response);
      //     // Store the user data in local storage
      //     localStorage.setItem('userToken', JSON.stringify(response));
      //     // Redirect to home
      //     this.router.navigate(['']);
      //   });
      this.authService.login(userData);
    } else {
      this.loginForm.markAllAsTouched();
      console.log('Form invalid!', this.loginForm.errors);
    }
  }

  getEmailError(): string {
    const emailControl = this.loginForm.get('email');
    if (emailControl?.hasError('required')) return 'Email is required.';
    if (emailControl?.hasError('email')) return 'Enter a valid email.';
    return '';
  }

  getPasswordError(): string {
    const passwordControl = this.loginForm.get('password');
    if (passwordControl?.hasError('required')) return 'Password is required.';
    return '';
  }
}
