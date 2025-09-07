import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';

export interface AuthResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    surname: string;
    email: string;
    type: string;
    points: number;
  };
}

export interface VerifyResponse {
  message: string;
}

export interface RegisterData {
  name: string;
  surname: string;
  email: string;
  password: string;
  type: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/api/auth';

  constructor(private http: HttpClient) {}

  // REGISTRAR USUARIO
  register(data: RegisterData): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, data);
  }

  // LOGIN USUARIO
  login(data: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
      })
    );
  }

  isAdmin(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.type === 'admin';
  }

  // VERIFICAR CUENTA POR TOKEN
  verifyAccount(token: string): Observable<VerifyResponse> {
    return this.http.get<VerifyResponse>(`${this.apiUrl}/verify/${token}`);
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/forgot-password`,
      { email }
    );
  }

  resetPassword(
    token: string,
    newPassword: string
  ): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/reset-password/${token}`,
      { newPassword }
    );
  }

  // OBTENER TOKEN GUARDADO
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // CERRAR SESIÓN
  logout(): void {
    localStorage.removeItem('token');
  }

  // VERIFICAR SI HAY USUARIO LOGUEADO
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
