import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  username: string;
  name: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(private router: Router) {
    const raw = localStorage.getItem('sea_user');
    if (raw) {
      try {
        this.userSubject.next(JSON.parse(raw));
      } catch (e) {
        localStorage.removeItem('sea_user');
      }
    }
  }

  get user(): User | null {
    return this.userSubject.value;
  }

  login(username: string, _password?: string): boolean {
    if (!username) return false;
    const u: User = {
      username,
      name: username.charAt(0).toUpperCase() + username.slice(1),
      role: 'Administrador'
    };
    localStorage.setItem('sea_user', JSON.stringify(u));
    this.userSubject.next(u);
    return true;
  }

  logout(): void {
    localStorage.removeItem('sea_user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
}
