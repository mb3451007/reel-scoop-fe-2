import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css'],
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
  dateRanges: any = {};
  isCustomDateSelected: boolean = false;
  maxCustomDate: string;

  constructor(private router: Router, private dataService: DataService) {
    this.maxCustomDate = this.getCurrentDate();
  }

  ngOnInit(): void {
    this.initializeDateRanges(); // First initialize all date ranges
    this.loadThisWeekData(); // Then explicitly load this week's data
    this.checkAdmin();
  }
  
  initializeDateRanges(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    // Calculate all date ranges for dropdown options
    ['thisWeek', 'lastWeek', 'twoWeeksAgo', 'threeWeeksAgo'].forEach((range, index) => {
      const start = new Date(today);
      start.setDate(today.getDate() - today.getDay() - (index * 7) + (today.getDay() === 0 ? -6 : 1));
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      this.dateRanges[range] = {
        from: this.formatDate(start),
        to: this.formatDate(end)
      };
    });
  }
  
  loadThisWeekData(): void {
    this.fromDate = this.dateRanges['thisWeek'].from;
    this.toDate = this.dateRanges['thisWeek'].to;
    this.getData();
  }

  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Get month in 2 digits
    const day = today.getDate().toString().padStart(2, '0'); // Get day in 2 digits
    return `${year}-${month}-${day}`;
  }

  checkAdmin() {
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
    if (selectedValue === 'custom_date') {
      this.isCustomDateSelected = true;
      return;
    }
    this.isCustomDateSelected = false;
    this.fromDate = this.dateRanges[selectedValue].from;
    this.toDate = this.dateRanges[selectedValue].to;
    this.getData();
  }

// Update your setDateRange function like this:
setDateRange(range: string, customDate?: string): void {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize time to midnight

  switch (range) {
    case 'thisWeek':
      const thisWeekStart = new Date(today);
      thisWeekStart.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Always get Monday
      const thisWeekEnd = new Date(thisWeekStart);
      thisWeekEnd.setDate(thisWeekStart.getDate() + 6);
      this.fromDate = this.formatDate(thisWeekStart);
      this.toDate = this.formatDate(thisWeekEnd);
      this.dateRanges['thisWeek'] = { from: this.fromDate, to: this.toDate };
      break;

    case 'lastWeek':
      const lastWeekStart = new Date(today);
      lastWeekStart.setDate(today.getDate() - today.getDay() - 6 + (today.getDay() === 0 ? -6 : 1));
      const lastWeekEnd = new Date(lastWeekStart);
      lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
      this.fromDate = this.formatDate(lastWeekStart);
      this.toDate = this.formatDate(lastWeekEnd);
      this.dateRanges['lastWeek'] = { from: this.fromDate, to: this.toDate };
      break;

    case 'twoWeeksAgo':
      const twoWeeksStart = new Date(today);
      twoWeeksStart.setDate(today.getDate() - today.getDay() - 13 + (today.getDay() === 0 ? -6 : 1));
      const twoWeeksEnd = new Date(twoWeeksStart);
      twoWeeksEnd.setDate(twoWeeksStart.getDate() + 6);
      this.fromDate = this.formatDate(twoWeeksStart);
      this.toDate = this.formatDate(twoWeeksEnd);
      this.dateRanges['twoWeeksAgo'] = { from: this.fromDate, to: this.toDate };
      break;

    case 'threeWeeksAgo':
      const threeWeeksStart = new Date(today);
      threeWeeksStart.setDate(today.getDate() - today.getDay() - 20 + (today.getDay() === 0 ? -6 : 1));
      const threeWeeksEnd = new Date(threeWeeksStart);
      threeWeeksEnd.setDate(threeWeeksStart.getDate() + 6);
      this.fromDate = this.formatDate(threeWeeksStart);
      this.toDate = this.formatDate(threeWeeksEnd);
      this.dateRanges['threeWeeksAgo'] = { from: this.fromDate, to: this.toDate };
      break;

    case 'custom-date':
      if (customDate) {
        const selectedDate = new Date(customDate);
        selectedDate.setHours(0, 0, 0, 0);
        
        // Get the Monday of the selected week
        const day = selectedDate.getDay();
        const diff = selectedDate.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(selectedDate.setDate(diff));
        
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        
        this.fromDate = this.formatDate(monday);
        this.toDate = this.formatDate(sunday);
      }
      break;

    default:
      this.fromDate = '';
      this.toDate = '';
  }
}

// Add this helper function to format dates consistently
private formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
} 

onCustomDateChange(event: any): void {
  const customDate = event.target.value;
  if (!customDate) return;
  
  this.setDateRange('custom-date', customDate);
  this.getData();
}

  addData() {
    this.router.navigate(['/add-data']);
  }

  getData(): void {
    console.log(this.isSuperAdmin);
    console.log(this.isAdmin);
    const user = JSON.parse(localStorage.getItem('User') || '{}');
    const admin = JSON.parse(localStorage.getItem('admin') || '{}');

    if (user && user.userId) {
      const userId = user.userId;
      // Call getData for regular users
      this.dataService
        .getData(this.currentPage, userId, this.fromDate, this.toDate)
        .subscribe({
          next: (response) => {
            this.data = response.data;
            this.totalPages = Math.ceil(response.totalDataCount / this.limit);
            this.generatePageNumbers();
            console.log('Data fetch for user:', this.data);
            console.log('Response:', response);
          },
          error: (error) => {
            console.error('Error fetching user data:', error);
          },
        });
    } else if (admin) {
      // Call getAllUsersData for admins
      this.dataService
        .getAllUsersData(this.currentPage, this.fromDate, this.toDate)
        .subscribe({
          next: (response) => {
            this.data = response.data;
            this.totalPages = Math.ceil(response.totalDataCount / this.limit);
            this.generatePageNumbers();
            console.log('Data fetch for admin:', this.data);
            console.log('Response:', response);
          },
          error: (error) => {
            console.error('Error fetching admin data:', error);
          },
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
    console.log(itemId);
    // if (this.isEditable(itemId.date)) {

    this.router.navigate(['edit-data', itemId]);
    // }
  }
  deleteData(itemId: any): void {
    console.log(itemId, 'item Id');
    if (confirm('Are you sure you want to delete this record?')) {
      this.dataService.deleteData(itemId).subscribe({
        next: () => {
          this.getData(); // Refresh the data after deletion
          console.log('Record deleted successfully');
        },
        error: (error: any) => {
          console.error('Error deleting record:', error);
        },
      });
    }
  }
}
