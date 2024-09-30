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

  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit(): void {
    this.getData();
  }

  addData() {
    this.router.navigate(['/add-data']);
  }

  getData(): void {
   const user = JSON.parse(localStorage.getItem('User') || '{}');
   const userId= user.userId;
   const fromDate = '2024-09-23';
   const toDate = '2024-09-29';
    this.dataService.getData(this.currentPage, userId, fromDate, toDate).subscribe({
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
