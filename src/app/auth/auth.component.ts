import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  signUpForm:FormGroup
  loginForm:FormGroup
  loginMode:boolean = false;
constructor(private router:Router, private fb:FormBuilder ,private userService:UserService,private toastr: ToastrService){
  this.signUpForm = this.fb.group({
    firstName:['', Validators.required],
    lastName:['', Validators.required],
    email:['', Validators.required,Validators.email],
    password:['', Validators.required],
    userType: ['', Validators.required]
  })
  this.loginForm = this.fb.group({
    email:['',Validators.required , Validators.email],
    password:['', Validators.required]
  })
}
  changeMode(){
    this.loginMode = !this.loginMode;
  }
  signUp(){
   const userData ={
      first_name: this.signUpForm.value.firstName,
      last_name: this.signUpForm.value.lastName,
      email: this.signUpForm.value.email,
      password: this.signUpForm.value.password,
      user_type: this.signUpForm.value.userType
    }
    console.log(userData,'User data to be added')
  this.userService.signUp(userData).subscribe({
    next :(response:any) =>{
      console.log('User signed up successfully', response);
      this.toastr.success('Signed up successfully!');
      const user ={
        userId : response.user._id,
        userName : response.user.first_name,
      }
      this.router.navigate(['/data']);
      localStorage.setItem('token', response.token,);
      localStorage.setItem('User', JSON.stringify(user));
      this.userService.setUserName(response.user.first_name);
    },
    error: (error) => {
      console.error('Error:', error)
      console.log(error.status);
      if(error.status===409){
        this.toastr.error('Email already exists. Please use a different email.');
        this.signUpForm.reset();
      }
      else{
        this.toastr.error('Error signing up! Please try again.');
      }
    }
    
  })

  }
  login(){
    const loginData ={
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    }
    console.log(loginData,'User data to be logged in')
   this.userService.login(loginData).subscribe({
    next :(response) =>{
      console.log('User logged in successfully', response);
      this.toastr.success('User logged in successfully!');
      const user ={
        userId : response.user._id,
        userName : response.user.first_name,
      }
      this.router.navigate(['/data']);
      localStorage.setItem('token', response.token);
      localStorage.setItem('User',JSON.stringify(user)  );
      this.userService.setUserName(response.user.first_name);
    },
    error: (error) => {
      console.error('Error:', error)
      if(error.status === 401){
        this.toastr.error('Invalid credentials. Please try again.');
        this.loginForm.reset();
      }
      else{
        this.toastr.error('Error logging in! Please try again.');
      }
    }
   })
  }
}
