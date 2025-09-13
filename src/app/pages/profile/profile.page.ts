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

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (res) => (this.user = res), //console.log('Usuario cargado:', this.user)

        error: (err) => console.error('Error al obtener usuario', err),
      });
    }
  }

  addPoints(userId: string, amount: number) {
    if (userId) {
      this.userService.addPoints(userId, amount).subscribe({
        next: (res) => {
          this.user = res;
          //console.log('Puntos añadidos:', this.user);
        },
        error: (err) => console.error('Error al añadir puntos', err),
      });
    }
  }

  subtractPoints(userId: string, amount: number) {
    if (userId) {
      this.userService.subtractPoints(userId, amount).subscribe({
        next: (res) => {
          this.user = res;
          //console.log('Puntos restados:', this.user);
        },
        error: (err) => console.error('Error al restar puntos', err),
      });
    }
  }

  addCombo(userId: string, amount: number) {
    if (userId) {
      this.userService.addCombo(userId, amount).subscribe({
        next: (res) => {
          this.user = res;
          //console.log('Combos añadidos:', this.user);
        },
        error: (err) => console.error('Error al añadir combos', err),
      });
    }
  }

  subtractCombo(userId: string, amount: number) {
    if (userId) {
      this.userService.subtractCombo(userId, amount).subscribe({
        next: (res) => {
          this.user = res;
          //console.log('Combos restados:', this.user);
        },
        error: (err) => console.error('Error al restar combos', err),
      });
    }
  }

  goBack() {
    this.router.navigate(['/admin-home']);
  }
}
