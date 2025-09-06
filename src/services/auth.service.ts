import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

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
  private apiUrl = 'http://localhost:5000/api/auth';

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

  // VERIFICAR CUENTA POR TOKEN
  verifyAccount(token: string): Observable<VerifyResponse> {
    return this.http.get<VerifyResponse>(`${this.apiUrl}/verify/${token}`);
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
