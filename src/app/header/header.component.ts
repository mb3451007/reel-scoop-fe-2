import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userName: string | null = null;
  adminName: string | null = null;
  constructor(private userService: UserService, private router:Router) { }
  ngOnInit(): void {
    
      const admin = JSON.parse(localStorage.getItem('admin') || '{}');
      const user = JSON.parse(localStorage.getItem('User') || '{}');
  
      if (admin && admin.userName) {
        this.adminName = admin.userName;
      } else if (user && user.userName) {
        this.userName = user.userName;
      } else {
        // Subscribe to the UserService observables
        this.userService.currentUserName.subscribe((name) => {
          this.userName = name;
        });
        this.userService.currentAdminName.subscribe((name) => {
          this.adminName = name;
        });
      }
    }
  
  logOut() {
    // Clear all relevant storage items and redirect to auth page
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('User');
    localStorage.removeItem('admin');
    this.router.navigate(['/auth']);
  }
}
