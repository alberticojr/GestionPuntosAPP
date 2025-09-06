import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService, VerifyResponse } from '../../../services/auth.service';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.page.html',
  styleUrls: ['./activate-account.page.scss'],
  standalone: false,
})
export class ActivateAccountPage implements OnInit {
  message: string = '';

  private apiUrl = 'http://localhost:5000/api/auth';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.paramMap.get('token');
    if (token) {
      this.authService.verifyAccount(token).subscribe({
        next: (res: VerifyResponse) => {
          this.message = res.message;
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          this.message = err.error?.message || 'Error al verificar la cuenta';
        },
      });
    } else {
      this.message = 'Token no proporcionado';
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
