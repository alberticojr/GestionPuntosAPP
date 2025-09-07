import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AlertController } from '@ionic/angular';

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

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  login() {
    this.authService
      .login({ email: this.email, password: this.password })
      .subscribe({
        next: (res) => {
          //console.log('Usuario logueado:', res.user);

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

  // 🔹 Nuevo: mostrar modal para recuperar contraseña
  async forgotPassword() {
    const modal = await this.alertController.create({
      header: 'Recuperar contraseña',
      message:
        'Introduce tu correo electrónico para enviar el enlace de recuperación.',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Correo electrónico',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Enviar',
          handler: (data) => {
            if (!data.email) {
              // Si no hay email, evitamos cerrar el modal
              this.alertController
                .create({
                  header: 'Error',
                  message: 'Debes introducir un correo válido',
                  buttons: ['OK'],
                })
                .then((alert) => alert.present());
              return false;
            }

            // Si hay email, enviamos solicitud al backend
            this.authService.forgotPassword(data.email).subscribe({
              next: async (res) => {
                // Cerramos el modal y mostramos mensaje de éxito
                await modal.dismiss();
                const successAlert = await this.alertController.create({
                  header: 'Éxito',
                  message: 'Correo enviado. Revisa tu bandeja de entrada.',
                  buttons: ['OK'],
                });
                await successAlert.present();
              },
              error: async (err) => {
                const errorAlert = await this.alertController.create({
                  header: 'Error',
                  message: 'No se pudo enviar el correo. Intenta de nuevo.',
                  buttons: ['OK'],
                });
                await errorAlert.present();
              },
            });

            return true; // cerramos el modal principal
          },
        },
      ],
    });

    await modal.present();
  }
}
