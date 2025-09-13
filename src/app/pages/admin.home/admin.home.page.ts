import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  User,
  UserService,
  UserResponse,
} from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

@Component({
  selector: 'app-admin.home',
  templateUrl: './admin.home.page.html',
  styleUrls: ['./admin.home.page.scss'],
  standalone: false,
})
export class AdminHomePage {
  allUsers: User[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 1; // inicializamos a 1 para evitar undefined
  pageSize: number = 10;
  loading: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ionViewWillEnter() {
    this.loadUsers();
    //console.log(this.allUsers);
    //console.log('AdminHomePage cargada: ' + this.authService.isAdmin());
  }

  // Cargar usuarios desde backend
  loadUsers(page: number = 1) {
    this.currentPage = page;
    this.loading = true;

    // Solo enviamos "query" al backend
    const filters = this.searchTerm ? { query: this.searchTerm } : {};

    this.userService
      .getAllUsers(this.currentPage, this.pageSize, filters)
      .subscribe({
        next: (res: UserResponse) => {
          // Validamos que metadata exista
          if (res && res.metadata) {
            this.allUsers = res.data;
            this.totalPages = res.metadata.pages || 1;
          } else {
            // fallback si no hay metadata
            this.allUsers = Array.isArray(res.data) ? res.data : [];
            this.totalPages = 1;
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al obtener usuarios:', err);
          this.loading = false;
        },
      });
  }

  // Buscar usuarios al escribir en la barra
  onSearchChange(event: any) {
    this.searchTerm = event.detail.value;
    this.loadUsers(1); // resetear a página 1 cuando se filtra
  }

  // Navegar al perfil
  goToProfile(userId: string) {
    this.router.navigate(['/profile', userId]);
  }

  // Logout
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
    //console.log('Usuario desconectado');
  }

  // Navegación de páginas
  prevPage() {
    if (this.currentPage > 1) this.loadUsers(this.currentPage - 1);
  }

  nextPage() {
    if (this.currentPage < this.totalPages)
      this.loadUsers(this.currentPage + 1);
  }

  async escanearQR() {
    const permission = await BarcodeScanner.requestPermissions();

    if (permission.camera !== 'granted') {
      console.error('Permiso de cámara no concedido');
      return;
    }

    const { barcodes } = await BarcodeScanner.scan();

    if (barcodes.length > 0) {
      const scannedData = barcodes[0].rawValue;

      if (scannedData.startsWith('/profile/')) {
        this.router.navigateByUrl(scannedData);
      } else {
        this.router.navigate(['/profile', scannedData]);
      }
    }
  }
}
