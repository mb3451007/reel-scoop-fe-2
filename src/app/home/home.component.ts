import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  weeks: string[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

  dailyFishCount: { [key: string]: number } = {
    mondayData: 0,
    tuesdayData: 0,
    wednesdayData: 0,
    thursdayData: 0,
    fridayData: 0,
    saturdayData: 0,
    sundayData: 0
  }
  // Separate objects for each day's data
  mondayData: any[] = [];
  tuesdayData: any[] = [];
  wednesdayData: any[] = [];
  thursdayData: any[] = [];
  fridayData: any[] = [];
  saturdayData: any[] = [];
  sundayData: any[] = [];

  totalPerDayFishes: number[] = [0, 0, 0, 0, 0, 0, 0]
  fromDate: string = '';
  toDate: string = '';
  charterFishCount: number = 0
  anglerFishCount: number = 0
  fish_Charter: number = 0
  fish_Angler: number = 0
  totalFishCount: number = 0
  fullWeekCount: number = 0
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getAllData()
    this.setDateRange("thisWeek")
  }
  getAllData() {
    this.charterFishCount = 0
    this.anglerFishCount = 0
    this.fish_Charter = 0
    this.fish_Angler = 0
    this.totalFishCount = 0

    // Reset daily fish count
    this.mondayData = [];
    this.tuesdayData = [];
    this.wednesdayData = [];
    this.thursdayData = [];
    this.fridayData = [];
    this.saturdayData = [];
    this.sundayData = [];

    this.dailyFishCount = {
      mondayData: 0,
      tuesdayData: 0,
      wednesdayData: 0,
      thursdayData: 0,
      fridayData: 0,
      saturdayData: 0,
      sundayData: 0
    };

    this.dataService.getAllData(this.fromDate, this.toDate).subscribe({
      next: (response: any) => {
        if (response.data && Array.isArray(response.data)) {
          for (let i = 0; i < response.data.length; i++) {
            const userDetail = response.data[i].userDetails;
            const createdDate = new Date(response.data[i].created_at);
            this.fullWeekCount = response.data.length
            const dayOfWeek = createdDate.toLocaleString('en-US', { weekday: 'short' }).toUpperCase();
            

            switch (dayOfWeek) {
              case 'MON':
                this.mondayData.push(response.data[i]);
                this.dailyFishCount['mondayData']++;
                break;
              case 'TUE':
                this.tuesdayData.push(response.data[i]);
                this.dailyFishCount['tuesdayData']++;
                break;
              case 'WED':
                this.wednesdayData.push(response.data[i]);
                this.dailyFishCount['wednesdayData']++;
                break;
              case 'THU':
                this.thursdayData.push(response.data[i]);
                this.dailyFishCount['thursdayData']++;
                break;
              case 'FRI':
                this.fridayData.push(response.data[i]);
                this.dailyFishCount['fridayData']++;
                break;
              case 'SAT':
                this.saturdayData.push(response.data[i]);
                this.dailyFishCount['saturdayData']++;
                break;
              case 'SUN':
                this.sundayData.push(response.data[i]);
                this.dailyFishCount['sundayData']++;
                break;
            }
            if (userDetail) {
              const userType = userDetail.user_type;
              if (userType === 'Fish/Charter') {
                this.fish_Charter++;
                this.totalFishCount++;
              } else if (userType === 'Charter') {
                this.charterFishCount++;
                this.totalFishCount++;
              } else if (userType === 'Angler') {
                this.anglerFishCount++;
                this.totalFishCount++;
              } else if (userType === 'Fish/Angler') {
                this.fish_Angler++;
                this.totalFishCount++;
              }
            }
          }
        }    
        this.calculateWeekDays()

      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }
 calculateWeekDays(){
  this.totalPerDayFishes[0] = this.dailyFishCount['mondayData']; 
  this.totalPerDayFishes[1] = this.totalPerDayFishes[0] + this.dailyFishCount['tuesdayData']; 
  this.totalPerDayFishes[2] = this.totalPerDayFishes[1] + this.dailyFishCount['wednesdayData']; 
  this.totalPerDayFishes[3] = this.totalPerDayFishes[2] + this.dailyFishCount['thursdayData']; 
  this.totalPerDayFishes[4] = this.totalPerDayFishes[3] + this.dailyFishCount['fridayData']; 
  this.totalPerDayFishes[5] = this.totalPerDayFishes[4] + this.dailyFishCount['saturdayData']; 
  this.totalPerDayFishes[6] = this.totalPerDayFishes[5] + this.dailyFishCount['sundayData'];
 }

  onDateRangeChange(event: any): void {
    const selectedValue = event.target.value;
    this.setDateRange(selectedValue);
    this.getAllData();
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

}