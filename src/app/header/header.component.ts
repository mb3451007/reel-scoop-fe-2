import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userName: any;
  constructor(private userService: UserService, private router:Router) { }
  ngOnInit(): void {
    this.getUserName();
  }
  getUserName() {
    this.userService.currentUserName.subscribe((name) => {
      console.log(name)
      this.userName = name;
    })
  }
  logOut(){
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('User');
    this.router.navigate(['/auth']);
  }
}
