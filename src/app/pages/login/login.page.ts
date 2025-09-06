import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService
      .login({ email: this.email, password: this.password })
      .subscribe({
        next: (res) => {
          console.log('Usuario logueado:', res.user);

          if (res.user.type === 'admin') {
            this.router.navigate(['/admin.home']);
            return;
          } else if (res.user.type === 'user') {
            this.router.navigate(['/home']);
            return;
          }
        },
        error: (err) => {
          console.error(err);
          alert('Email o contraseña incorrectos');
        },
      });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  goToRegister() {
    this.router.navigate(['/register']); // redirige a registro
  }
}
