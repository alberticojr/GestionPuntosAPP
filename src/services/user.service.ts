import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

export interface User {
  _id: string;
  name: string;
  surname: string;
  email: string;
  type: string;
  points: number;
  combos: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserResponse {
  metadata: {
    page: number;
    pageSize: number;
    pages: number;
    totalDocuments: number;
  };
  data: User[];
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getAuthHeaders() {
    const token = this.getToken();
    console.log('Token recibido en el front:', token);
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  }

  private apiUrl = 'http://localhost:5000/api/users';

  constructor(private http: HttpClient) {}

  getCurrentUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return decoded.userId || null; // <-- aquí usamos userId, no _id
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  }

  getAllUsers(
    page: number = 1,
    pageSize: number = 10,
    filters?: {
      name?: string;
      surname?: string;
      email?: string;
      query?: string;
    } // ✅ añadimos query
  ): Observable<UserResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (filters?.name) params = params.set('name', filters.name);
    if (filters?.surname) params = params.set('surname', filters.surname);
    if (filters?.email) params = params.set('email', filters.email);
    if (filters?.query) params = params.set('query', filters.query); // ✅ añadimos query

    const options = { ...this.getAuthHeaders(), params };
    return this.http.get<UserResponse>(this.apiUrl, options);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user, this.getAuthHeaders());
  }

  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.http.put<User>(
      `${this.apiUrl}/${id}`,
      user,
      this.getAuthHeaders()
    );
  }

  deleteUser(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/${id}`,
      this.getAuthHeaders()
    );
  }

  addPoints(id: string, amount: number): Observable<User> {
    return this.http.patch<User>(
      `${this.apiUrl}/${id}/add-points`,
      { amount },
      this.getAuthHeaders()
    );
  }

  subtractPoints(id: string, amount: number): Observable<User> {
    return this.http.patch<User>(
      `${this.apiUrl}/${id}/subtract-points`,
      { amount },
      this.getAuthHeaders()
    );
  }

  addCombo(id: string, amount: number): Observable<User> {
    return this.http.patch<User>(
      `${this.apiUrl}/${id}/add-combos`,
      { amount },
      this.getAuthHeaders()
    );
  }

  subtractCombo(id: string, amount: number): Observable<User> {
    return this.http.patch<User>(
      `${this.apiUrl}/${id}/subtract-combos`,
      { amount },
      this.getAuthHeaders()
    );
  }
}
