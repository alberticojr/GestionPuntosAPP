import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService, User } from '../../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  user: User | null = null;
  private userId: string | null = null;
  loading: boolean = false; // Para feedback visual opcional

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.refreshUser();
    }
  }

  /** 🔄 Recargar datos del usuario */
  private refreshUser() {
    if (!this.userId) return;
    this.loading = true;
    this.userService.getUserById(this.userId).subscribe({
      next: (res) => {
        this.user = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener usuario', err);
        this.loading = false;
      },
    });
  }

  /** 🟢 Añadir puntos */
  addPoints(userId: string, amount: number) {
    this.userService.addPoints(userId, amount).subscribe({
      next: () => this.refreshUser(),
      error: (err) => console.error('Error al añadir puntos', err),
    });
  }

  /** 🔴 Restar puntos */
  subtractPoints(userId: string, amount: number) {
    this.userService.subtractPoints(userId, amount).subscribe({
      next: () => this.refreshUser(),
      error: (err) => console.error('Error al restar puntos', err),
    });
  }

  /** 🟢 Añadir combo */
  addCombo(userId: string, amount: number) {
    this.userService.addCombo(userId, amount).subscribe({
      next: () => this.refreshUser(),
      error: (err) => console.error('Error al añadir combos', err),
    });
  }

  /** 🔴 Restar combo */
  subtractCombo(userId: string, amount: number) {
    this.userService.subtractCombo(userId, amount).subscribe({
      next: () => this.refreshUser(),
      error: (err) => console.error('Error al restar combos', err),
    });
  }

  /** ⬅️ Volver al home de admin */
  goBack() {
    this.router.navigate(['/admin-home']);
  }
}
