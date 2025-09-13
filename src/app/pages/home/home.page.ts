import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  user: User | null = null;
  combosArray: any[] = [];
  pointsArray: any[] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  userUrl!: string;
  mostrarCodigoQR: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  // Nueva función para cargar los datos del usuario
  loadUserData() {
    const userId = this.userService.getCurrentUserId();
    if (userId) {
      this.user = null; // Reset mientras carga para mostrar el spinner
      this.userService.getUserById(userId).subscribe({
        next: (res) => {
          this.user = res;
          this.combosArray = Array.from(
            { length: this.user.combos },
            (_, i) => i
          );
          this.userUrl = `${environment.frontUrl}/profile/${userId}`;
        },
        error: (err) => {
          console.error('Error al obtener usuario:', err);
        },
      });
    }
  }

  // Refrescar datos manualmente desde el botón
  refreshUserData() {
    this.loadUserData();
  }

  switchCodigoQR() {
    this.mostrarCodigoQR = !this.mostrarCodigoQR;
  }

  logout() {
    localStorage.removeItem('token');
    this.user = null;
    this.router.navigate(['/login']);
  }
}
