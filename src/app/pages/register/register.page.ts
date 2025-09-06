import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, RegisterResponse } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage {
  name: string = '';
  surname: string = '';
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService
      .register({
        name: this.name,
        surname: this.surname,
        email: this.email,
        password: this.password,
        type: 'user',
      })
      .subscribe({
        next: (res: RegisterResponse) => {
          console.log('Respuesta del backend:', res.message);
          alert(
            'Registro exitoso. Revisa tu correo electrónico para activar tu cuenta.'
          );
          this.router.navigate(['/login']); // Redirige al login
        },
        error: (err) => {
          console.error(err);
          alert(err.error?.message || 'Error al registrar usuario');
        },
      });
  }
}
