import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  weeks: string[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  fishTypes = [
    'Yellowfin Tuna', 'Dorado', 'Sailfish', 'Striped Marlin', 
    'Blue Marlin', 'Black Marlin', 'Wahoo', 'Yellowtail', 
    'Roosterfish', 'Pargo', 'Cabrilla', 'Triggerfish', 'Hauchinango', 'Others'
  ];

  dailyFishCount: { [key: string]: number } = {
    mondayData: 0, tuesdayData: 0, wednesdayData: 0, thursdayData: 0,
    fridayData: 0, saturdayData: 0, sundayData: 0
  };

  fishCounts: { [key: string]: { [key: string]: number } } = {};

  dayData: { [key: string]: any[] } = {
    mondayData: [], tuesdayData: [], wednesdayData: [], 
    thursdayData: [], fridayData: [], saturdayData: [], sundayData: []
  };

  totalPerDayFishes: number[] = [0, 0, 0, 0, 0, 0, 0];
  fromDate: string = '';
  toDate: string = '';
  charterFishCount: number = 0;
  anglerFishCount: number = 0;
  fish_Charter: number = 0;
  fish_Angler: number = 0;
  totalFishCount: number = 0;
  fullWeekCount: number = 0;

  constructor(private dataService: DataService) {
  
    this.fishTypes.forEach(fish => {
      this.fishCounts[fish] = {
        mondayData: 0, tuesdayData: 0, wednesdayData: 0, thursdayData: 0,
        fridayData: 0, saturdayData: 0, sundayData: 0
      };
    });
  }

  ngOnInit(): void {
    this.getAllData();
    this.setDateRange('thisWeek');
  }

  getAllData() {
    this.resetData();

    this.dataService.getAllData(this.fromDate, this.toDate).subscribe({
      next: (response: any) => {
        if (response.data && Array.isArray(response.data)) {
          for (let i = 0; i < response.data.length; i++) {
            const userDetail = response.data[i].userDetails;
            const createdDate = new Date(response.data[i].created_at);
            const fishType = response.data[i].species;
            this.fullWeekCount = response.data.length;

            const dayOfWeek = createdDate.toLocaleString('en-US', { weekday: 'short' }).toUpperCase();
            const dayKey = this.getDayKey(dayOfWeek);
            
            if (dayKey) {
              this.dayData[dayKey].push(response.data[i]);
              this.dailyFishCount[dayKey]++;

              if (this.fishCounts[fishType]) {
                this.fishCounts[fishType][dayKey]++;
              }
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
        this.calculateWeekDays();
        this.getAllFishDataPerDay(); 
        console.log('Fish Data:', response);
        console.log('Fish Data:', response);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }getAllFishDataPerDay() {

    const allSpecies = new Set<string>();
    
    Object.keys(this.dayData).forEach(dayKey => {
      this.dayData[dayKey].forEach(data => {
        allSpecies.add(data.species);
      });
    });
  
    allSpecies.forEach(species => {
      console.log(`Data for ${species}:`);
      Object.keys(this.dayData).forEach(dayKey => {
        const fishData = this.dayData[dayKey].filter(data => data.species === species);
        console.log(`  ${dayKey}:`, fishData);
      });
    });
  }
  
  resetData() {
    this.charterFishCount = 0;
    this.anglerFishCount = 0;
    this.fish_Charter = 0;
    this.fish_Angler = 0;
    this.totalFishCount = 0;


    Object.keys(this.dayData).forEach(day => {
      this.dayData[day] = [];
    });

    Object.keys(this.dailyFishCount).forEach(day => {
      this.dailyFishCount[day] = 0;
    });

    this.fishTypes.forEach(fish => {
      Object.keys(this.fishCounts[fish]).forEach(day => {
        this.fishCounts[fish][day] = 0;
      });
    });
  }

  getDayKey(dayOfWeek: string): string | null {
    switch (dayOfWeek) {
      case 'MON': return 'mondayData';
      case 'TUE': return 'tuesdayData';
      case 'WED': return 'wednesdayData';
      case 'THU': return 'thursdayData';
      case 'FRI': return 'fridayData';
      case 'SAT': return 'saturdayData';
      case 'SUN': return 'sundayData';
      default: return null;
    }
  }

  calculateWeekDays() {
    this.totalPerDayFishes[0] = this.dailyFishCount['mondayData'];
    for (let i = 1; i < this.weeks.length; i++) {
      const dayKey = this.getDayKey(this.weeks[i]);
      if (dayKey) {
        this.totalPerDayFishes[i] = this.totalPerDayFishes[i - 1] + this.dailyFishCount[dayKey];
      }
    }
  }

  onDateRangeChange(event: any): void {
    const selectedValue = event.target.value;
    this.setDateRange(selectedValue);
    this.getAllData();
  }

  setDateRange(range: string): void {
    let startOfWeek: Date = new Date();  
    let endOfWeek: Date = new Date();  
    const today = new Date();
    switch (range) {
      case 'thisWeek':
        startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        break;
      case 'lastWeek':
        startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() - 7);
        endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        break;
      case 'twoWeeksAgo':
        startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() - 14);
        endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        break;
      case 'threeWeeksAgo':
        startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() - 21);
        endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        break;
    }

    this.fromDate = startOfWeek.toISOString().split('T')[0];
    this.toDate = endOfWeek.toISOString().split('T')[0];
  }
}
