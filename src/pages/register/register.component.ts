import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm!: FormGroup;
  currentStep: number = 1;
  totalSteps: number = 2;
  previewUrl: string | ArrayBuffer | null = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Initialize the form with fields for both steps.
    this.registerForm = this.formBuilder.group(
      {
        // Step 1 fields
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
        // Step 2 fields
        profileImage: [null],
        gender: ['male', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // Custom validator to check password and confirm password match
  // passwordMatchValidator(group: FormGroup) {
  //   return group.get('password')?.value === group.get('confirmPassword')?.value
  //     ? null
  //     : { mismatch: true };
  // }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (confirmPassword && password?.value !== confirmPassword?.value) {
      confirmPassword.setErrors({ mismatch: true });
    } else if (confirmPassword) {
      confirmPassword.setErrors(null);
    }

    return null;
  }

  // nextStep(): void {
  //   if (this.currentStep < this.totalSteps) {
  //     this.currentStep++;
  //   }
  // }

  // nextStep(): void {
  //   if (this.currentStep === 1) {
  //     if (
  //       this.registerForm.get('username')?.invalid ||
  //       this.registerForm.get('email')?.invalid ||
  //       this.registerForm.get('password')?.invalid ||
  //       this.registerForm.get('confirmPassword')?.invalid
  //     ) {
  //       this.registerForm.markAllAsTouched(); // Show validation errors
  //       return; // Stop navigation if fields are invalid
  //     } else if (
  //       this.registerForm.get('confirmPassword')?.value !==
  //       this.registerForm.get('password')?.value
  //     ) {
  //       this.registerForm.setErrors({ mismatch: true }); // Set custom error for password mismatch
  //       this.getErrorMessage('confirmPassword'); // Call to get error message
  //       return; // Stop navigation if passwords do not match
  //     }
  //   } else if (this.currentStep === 2) {
  //     if (this.registerForm.get('gender')?.invalid) {
  //       this.registerForm.markAllAsTouched();
  //       return;
  //     }
  //   }

  //   if (this.currentStep < this.totalSteps) {
  //     this.currentStep++;
  //   }
  // }

  nextStep(): void {
    if (this.currentStep === 1) {
      this.registerForm.markAllAsTouched(); // Show all validation errors

      if (
        this.registerForm.get('username')?.invalid ||
        this.registerForm.get('email')?.invalid ||
        this.registerForm.get('password')?.invalid ||
        this.registerForm.get('confirmPassword')?.invalid
      ) {
        return; // Stop navigation if fields are invalid
      }
    } else if (this.currentStep === 2) {
      if (this.registerForm.get('gender')?.invalid) {
        this.registerForm.markAllAsTouched();
        return;
      }
    }

    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      this.registerForm.patchValue({ profileImage: file });

      // generate preview
      const reader = new FileReader();
      reader.onload = (e) => (this.previewUrl = reader.result);
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formData = new FormData();
      formData.append('username', this.registerForm.get('username')?.value);
      formData.append('email', this.registerForm.get('email')?.value);
      formData.append('password', this.registerForm.get('password')?.value);
      formData.append('gender', this.registerForm.get('gender')?.value);

      const file = this.registerForm.get('profileImage')?.value;
      if (file) {
        formData.append('profileImage', file);
      }

      const userData = {
        username: this.registerForm.get('username')?.value,
        email: this.registerForm.get('email')?.value,
        password: this.registerForm.get('password')?.value,
        gender: this.registerForm.get('gender')?.value,
        profileImage: file ? file.name : null, // Store the file name or path
        role: 'user', // Default role for new users
        cart: [], // Initialize an empty cart
        wishlist: [], // Initialize an empty wishlist
        // If you want to store the file itself, you can use FormData instead
      };

      this.authService.register(userData);
    } else {
      console.log('Form invalid!', this.registerForm.errors);
    }
  }

  getErrorMessage(field: string): string {
    const control = this.registerForm.get(field);

    if (control?.hasError('required'))
      return `${this.formatFieldName(field)} is required.`;
    if (control?.hasError('email')) return 'Enter a valid email.';
    if (control?.hasError('minlength'))
      return `${this.formatFieldName(field)} must be at least ${
        control.errors?.['minlength'].requiredLength
      } characters.`;
    if (field === 'confirmPassword' && control?.hasError('mismatch'))
      return 'Passwords do not match.';

    return '';
  }

  // Converts camelCase to readable text
  formatFieldName(field: string): string {
    return (
      field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')
    );
  }
}
