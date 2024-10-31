import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.baseUrl;
  
 // Create BehaviorSubjects for user and admin names
 private userName = new BehaviorSubject<string | null>(localStorage.getItem('userName'));
 private adminName = new BehaviorSubject<string | null>(localStorage.getItem('adminName')); // Changed from 'admin' to 'adminName'
 
 // Expose observables
 currentUserName = this.userName.asObservable();
 currentAdminName = this.adminName.asObservable();

 constructor(private http: HttpClient) { }

 setUserName(name: string | null) {
   if (name) {
     localStorage.setItem('userName', name);
   } else {
     localStorage.removeItem('userName');
   }
   this.userName.next(name);
 }

 setAdminName(name: string | null) {
   if (name) {
     localStorage.setItem('adminName', name); // Store admin name
   } else {
     localStorage.removeItem('adminName');
   }
   this.adminName.next(name);
 }
  // Signup method
  signUp(user: any) {
    return this.http.post<any>(`${this.baseUrl}/user/signup`, user);
  }

  // Login method
  login(user: any) {
    return this.http.post<any>(`${this.baseUrl}/user/login`, user);
  }
  adminlogin(user: any) {
    console.log(user, 'admin login')
    return this.http.post<any>(`${this.baseUrl}/user/adminlogin`, user);
  }
}
