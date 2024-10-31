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
  isSuperAdmin: boolean = false;
  isAdmin: boolean = false;

  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit(): void {
  
    this.setDateRange('thisWeek');
    this.getData();
    this.checkAdmin();
  }

  checkAdmin(){
    const user = JSON.parse(localStorage.getItem('User') || '{}');
    const admin = localStorage.getItem('admin');
    console.log(user, 'user');
    console.log(admin, 'admin');
  
    if (user && admin) {
      // If both user and admin are present in localStorage
      this.isSuperAdmin = true;
      this.isAdmin = false;
    } else if (user) {
      // If only user is present
      this.isSuperAdmin = false;
      this.isAdmin = true;
    } else {
      // If neither user nor admin is present
      this.isSuperAdmin = false;
      this.isAdmin = false;
    }
  }
  
  onDateRangeChange(event: any): void {
    const selectedValue = event.target.value;
    this.setDateRange(selectedValue);
    this.getData();
  }

  setDateRange(range: string): void {
    const today = new Date();
    let startOfWeek, endOfWeek;
    const dayOfWeek = today.getDay();
    const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    switch (range) {
      case 'thisWeek':
        startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() + offset);
        endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        this.fromDate = startOfWeek.toISOString().split('T')[0];
        this.toDate = endOfWeek.toISOString().split('T')[0];
        break;

      case 'lastWeek':
        startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() + offset - 7);
        endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        this.fromDate = startOfWeek.toISOString().split('T')[0];
        this.toDate = endOfWeek.toISOString().split('T')[0];
        break;

      case 'twoWeeksAgo':
        startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() + offset - 14);
        endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        this.fromDate = startOfWeek.toISOString().split('T')[0];
        this.toDate = endOfWeek.toISOString().split('T')[0];
        break;

      case 'threeWeeksAgo':
        startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() + offset - 21);
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
    console.log(this.isSuperAdmin)
    console.log(this.isAdmin)
    const user = JSON.parse(localStorage.getItem('User') || '{}');
    const admin = JSON.parse(localStorage.getItem('admin') || '{}');

    if (user && user.userId) {
      const userId = user.userId;
      // Call getData for regular users
      this.dataService.getData(this.currentPage, userId, this.fromDate, this.toDate).subscribe({
        next: (response) => {
          this.data = response.data;
          this.totalPages = Math.ceil(response.totalDataCount / this.limit);
          this.generatePageNumbers();
          console.log('Data fetch for user:', this.data);
          console.log('Response:', response);
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        }
      });
    } else if (admin) {
      // Call getAllUsersData for admins
      this.dataService.getAllUsersData(this.currentPage, this.fromDate, this.toDate).subscribe({
        next: (response) => {
          this.data = response.data;
          this.totalPages = Math.ceil(response.totalDataCount / this.limit);
          this.generatePageNumbers();
          console.log('Data fetch for admin:', this.data);
          console.log('Response:', response);
        },
        error: (error) => {
          console.error('Error fetching admin data:', error);
        }
      });
    } else {
      console.warn('No user or admin found in local storage.');
    }
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
  // 

  isEditable(date: string): boolean {
    const recordDate = new Date(date);
    const today = new Date();

    // Super admin can edit all records, regardless of the week
    if (this.isSuperAdmin) {
      return true;
    }

    // Calculate start and end of current week
    const dayOfWeek = today.getDay();
    const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + offset);
    startOfWeek.setHours(0, 0, 0, 0); // Start of the week

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999); // End of the week

    return recordDate >= startOfWeek && recordDate <= endOfWeek;
  }


  editData(itemId: any): void {
    console.log(itemId)
    // if (this.isEditable(itemId.date)) {

    this.router.navigate(['edit-data', itemId]);
    // }
  }
  deleteData(itemId: any): void {
    console.log(itemId , 'item Id')
    if (confirm('Are you sure you want to delete this record?')) {
      this.dataService.deleteData(itemId).subscribe({
        next: () => {
          this.getData(); // Refresh the data after deletion
          console.log('Record deleted successfully');
        },
        error: (error: any) => {
          console.error('Error deleting record:', error);
        }
      });
    }
  }
}
