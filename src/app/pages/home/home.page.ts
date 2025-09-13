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
  combosArray: any[] = []; // Ejemplo de array de combos
  pointsArray: any[] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; // Ejemplo de array de puntos
  userUrl!: string;
  mostrarCodigoQR: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Suponemos que el AuthService tiene un método para obtener el ID del usuario actual
    const userId = this.userService.getCurrentUserId();

    //console.log('User ID:', userId);
    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (res) => {
          this.user = res;
          this.combosArray = Array.from(
            { length: this.user.combos },
            (_, i) => i
          );
        },
        error: (err) => {
          console.error('Error al obtener usuario:', err);
        },
      });
    }

    // Construir la URL del usuario
    this.userUrl = `${environment.frontUrl}/profile/${userId}`;
  }

  switchCodigoQR() {
    this.mostrarCodigoQR = !this.mostrarCodigoQR;
  }

  logout() {
    localStorage.removeItem('token');
    this.user = null;
    this.router.navigate(['/login']);
    //console.log('Usuario desconectado');
  }
}
