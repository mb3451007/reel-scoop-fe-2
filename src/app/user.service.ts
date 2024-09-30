import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:3000/user';
  
  // Initialize the BehaviorSubject with the value from localStorage, if present
  private userName = new BehaviorSubject<string | null>(localStorage.getItem('userName'));
  currentUserName = this.userName.asObservable();

  constructor(private http: HttpClient) { }

  // Method to update the user name and store it in localStorage
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
    return this.http.post<any>(`${this.baseUrl}/signup`, user);
  }

  // Login method
  login(user: any) {
    return this.http.post<any>(`${this.baseUrl}/login`, user);
  }
}
