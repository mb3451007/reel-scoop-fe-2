import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {
  data: any[] = [];
  currentPage: number = 1; 
  limit: number = 5; 
  totalPages: number = 1; 
  pages: number[] = [];
  fromDate: string = '';
  toDate: string = '';

  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit(): void {
    this.setDateRange('thisWeek');
    this.getData();
  }
  onDateRangeChange(event: any): void {
    const selectedValue = event.target.value;
    this.setDateRange(selectedValue);
    this.getData(); 
  }
    
  setDateRange(range: string): void {
    const today = new Date();
    let startOfWeek, endOfWeek;
  
    switch (range) {
      case 'thisWeek':
        startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        this.fromDate = startOfWeek.toISOString().split('T')[0];
        this.toDate = endOfWeek.toISOString().split('T')[0];
        break;
  
      case 'lastWeek':
        startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() - 7);
        endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        this.fromDate = startOfWeek.toISOString().split('T')[0];
        this.toDate = endOfWeek.toISOString().split('T')[0];
        break;
  
      case 'twoWeeksAgo':
        startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() - 14);
        endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        this.fromDate = startOfWeek.toISOString().split('T')[0];
        this.toDate = endOfWeek.toISOString().split('T')[0];
        break;
  
      case 'threeWeeksAgo':
        startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() - 21);
        endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        this.fromDate = startOfWeek.toISOString().split('T')[0];
        this.toDate = endOfWeek.toISOString().split('T')[0];
        break;
  
      default:
        this.fromDate = '';
        this.toDate = '';
    }
  }
  addData() {
    this.router.navigate(['/add-data']);
  }

  getData(): void {
   const user = JSON.parse(localStorage.getItem('User') || '{}');
   const userId= user.userId;
    this.dataService.getData(this.currentPage, userId, this.fromDate, this.toDate).subscribe({
      next: (response) => {
        this.data = response.data;
        this.totalPages = Math.ceil(response.totalDataCount / this.limit); 
        this.generatePageNumbers();
        console.log('Data:', this.data);
        console.log('Data:', response);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.getData();
    }
  }

  private generatePageNumbers(): void {
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
