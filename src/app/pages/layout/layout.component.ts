import { Component, HostListener, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-layout',
  imports: [
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterLinkActive,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);

  isMobile = typeof window !== 'undefined' ? window.innerWidth <= 768 : false;

  @HostListener('window:resize')
  onResize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  closeSidenavOnMobile(sidenav: MatSidenav): void {
    if (this.isMobile) {
      sidenav.close();
    }
  }

  get isAdmin(): boolean {
    const token = sessionStorage.getItem(environment.TOKEN_NAME);
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role && payload.role.includes('ADMIN');
    } catch {
      return false;
    }
  }

  logout() {
    this.loginService.logout().subscribe({
      next: () => this.finalizarSesion(),
      error: () => this.finalizarSesion()
    });
  }

  private finalizarSesion() {
    sessionStorage.removeItem(environment.TOKEN_NAME);
    this.router.navigate(['/login']);
  }
}