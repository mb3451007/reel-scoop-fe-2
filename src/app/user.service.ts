import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.baseUrl;
  
  private userName = new BehaviorSubject<string | null>(localStorage.getItem('userName'));
  currentUserName = this.userName.asObservable();

  constructor(private http: HttpClient) { }

  setUserName(name: string | null) {
    if (name) {
      localStorage.setItem('userName', name);
    } else {
      localStorage.removeItem('userName');
    }
    this.userName.next(name);
  }

  // Signup method
  signUp(user: any) {
    return this.http.post<any>(`${this.baseUrl}/user/signup`, user);
  }

  // Login method
  login(user: any) {
    return this.http.post<any>(`${this.baseUrl}/user/login`, user);
  }
}
