import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: false,
})
export class ResetPasswordPage implements OnInit {
  newPassword: string = '';
  confirmPassword: string = '';
  token: string | null = null;
  email: string = '';

  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  isPasswordValid: boolean = true;
  passwordsMatch: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token');
  }

  validatePassword() {
    // Regex: al menos 8 caracteres, 1 mayúscula, 1 número
    const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    this.isPasswordValid =
      regex.test(this.newPassword) || this.newPassword === '';
  }

  checkPasswords() {
    this.passwordsMatch =
      this.newPassword === this.confirmPassword || this.confirmPassword === '';
  }

  async resetPassword() {
    this.validatePassword();
    this.checkPasswords();

    if (!this.newPassword || !this.confirmPassword) {
      this.showAlert('Error', 'Debes rellenar ambos campos');
      return;
    }

    if (!this.isPasswordValid) {
      this.showAlert(
        'Error',
        'La contraseña debe tener al menos 8 caracteres, 1 mayúscula y 1 número.'
      );
      return;
    }

    if (!this.passwordsMatch) {
      this.showAlert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (!this.token) {
      this.showAlert('Error', 'Token inválido');
      return;
    }

    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: async (res) => {
        await this.showAlert('Éxito', res.message);
        this.router.navigate(['/login']);
      },
      error: async (err) => {
        await this.showAlert(
          'Error',
          err.error?.message || 'Token inválido o expirado'
        );
      },
    });
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
    console.log('Usuario desconectado');
  }
}
