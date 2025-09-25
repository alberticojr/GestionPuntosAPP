import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/services/auth.service';
import { RegisterResponse } from 'src/services/auth.service';

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
  confirmPassword: string = '';

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  // Validaciones
  isNameValid: boolean = true;
  isSurnameValid: boolean = true;
  isEmailValid: boolean = true;
  passwordsMatch: boolean = true;
  isPasswordValid: boolean = true;

  constructor(
    private alertCtrl: AlertController,
    private authService: AuthService
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  validateName() {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    this.isNameValid = regex.test(this.name) || this.name === '';
  }

  validateSurname() {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    this.isSurnameValid = regex.test(this.surname) || this.surname === '';
  }

  validateEmail() {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.isEmailValid = regex.test(this.email) || this.email === '';
  }

  validatePassword() {
    // Al menos 8 caracteres, 1 mayúscula, 1 número, acepta especiales
    const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&.,;:_\-]{8,}$/;
    this.isPasswordValid = regex.test(this.password) || this.password === '';
  }

  checkPasswords() {
    this.passwordsMatch =
      this.password === this.confirmPassword || this.confirmPassword === '';
  }

  async register() {
    // Comprobamos validaciones
    if (!this.isNameValid || !this.isSurnameValid || !this.isEmailValid) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Revisa los campos: Nombre, Apellido o Email inválidos.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    // Comprobamos contraseñas
    if (this.password !== this.confirmPassword) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Las contraseñas no coinciden.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    // Validación contraseña
    this.validatePassword();
    if (!this.isPasswordValid) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message:
          'La contraseña debe tener al menos 6 caracteres, 1 letra mayúscula y 1 número.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    // Aquí iría la lógica de registro real

    this.register2();
  }

  register2() {
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
          //console.log('Respuesta del backend:', res.message);
          alert(
            'Registro exitoso. Revisa tu correo electrónico para activar tu cuenta.'
          );
          // Redirige al login
        },
        error: (err) => {
          console.error(err);
          alert(err.error?.message || 'Error al registrar usuario');
        },
      });
  }
}
