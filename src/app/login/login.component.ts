import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { LoginService } from '../services/login.service';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  isFormValid = toSignal(
    this.loginForm.statusChanges.pipe(map(status => status === 'VALID')),
    { initialValue: this.loginForm.valid }
  );

  isLoggingIn = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);
  selectedRole = signal<string>('ADMIN');

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  selectRole(role: string) {
    this.selectedRole.set(role);
  }

  login() {
  if (this.loginForm.valid) {
    this.isLoggingIn.set(true);
    this.errorMessage.set('');

    this.loginService.login(this.loginForm.value.username, this.loginForm.value.password)
      .subscribe({
        next: (data) => {
          try {
            const payload = JSON.parse(atob(data.access_token.split('.')[1]));
            const roleFromToken = payload.role || '';

            if (!roleFromToken.includes(this.selectedRole())) {
              this.isLoggingIn.set(false);
              this.errorMessage.set('No tienes permiso para acceder con ese rol');
              return;
            }

            sessionStorage.setItem(environment.TOKEN_NAME, data.access_token);
            this.isLoggingIn.set(false);

            if (roleFromToken.includes('ADMIN')) {
              this.router.navigate(['/pages/administracion']);
            } else {
              this.router.navigate(['/pages/inventario']);
            }
          } catch {
            this.isLoggingIn.set(false);
            this.errorMessage.set('Error al procesar el token');
          }
        },
        error: () => {
          this.isLoggingIn.set(false);
          this.errorMessage.set('Usuario o contraseña incorrectos');
        }
      });
    }
  }
}

