import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string, duration: number = 3000) {
    this.snackBar.open(message, '', {
      duration,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: ['bg-green-600', 'text-white'], 
    });
  }

  showError(message: string, duration: number = 3000) {
    this.snackBar.open(message, '', {
      duration,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: ['bg-red-600', 'text-white'], 
    });
  }
}