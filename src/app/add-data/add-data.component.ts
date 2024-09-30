import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-data',
  templateUrl: './add-data.component.html',
  styleUrls: ['./add-data.component.css']
})
export class AddDataComponent {
  addDataForm:FormGroup
  constructor(private dataService:DataService, private fb: FormBuilder ,private router:Router) { 
    this.addDataForm = this.fb.group({
      location: [''],
      quantity: [''],
      species: [''],
      bait: [''],
    })
  }
addData(){
  const user = JSON.parse(localStorage.getItem('User') || '{}')
  const userId= user.userId;
  console.log(userId,'this is userId')
const  data={
    location: this.addDataForm.value.location,
    quantity: this.addDataForm.value.quantity,
    species: this.addDataForm.value.species,
    bait: this.addDataForm.value.bait,
    userId: userId,  
  }
  console.log(data,'data to be added')
this.dataService.addData(data).subscribe({
  next :(response) =>{
    console.log('Data added successfully:', response)
    this.addDataForm.reset()
    this.router.navigate(['/data']);
  }
})
}
}
