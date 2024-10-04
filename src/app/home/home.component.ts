import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  weeklyFishTotals: { [fishType: string]: number } = {};
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
  fishData: { [key: string]: any[] } = {};
  fishesData: any;
  dayData: { [key: string]: any[] } = {
    mondayData: [], tuesdayData: [], wednesdayData: [], 
    thursdayData: [], fridayData: [], saturdayData: [], sundayData: []
  };

  fishDailyCounts: { [fishType: string]: number[] } = {};
  YellowfinTuna : number[] = [];
  Dorado: number[] = [];
  Sailfish: number[] = [];
  StripedMarlin : number[] = [];
  BlueMarlin: number[] = [];
  BlackMarlin: number[] = [];
  Wahoo: number[] = [];
  yellowtail: number[] = [];
  Roosterfish: number[] = [];
  Pargo : number[] = [];
  Cabrilla: number[] = [];
  Triggerfish: number[] = [];
  Hauchinango: number[] = [];
  Others: number[] = [];



  YellowfinTunaCumulative: number[] = [];
  DoradoCumulative: number[] = [];
  SailfishCumulative: number[] = [];
  StripedMarlinCumulative: number[] = [];
  BlueMarlinCumulative: number[] = [];
  BlackMarlinCumulative: number[] = [];
  WahooCumulative: number[] = [];
  yellowtailCumulative: number[] = [];
  RoosterfishCumulative: number[] = [];
  PargoCumulative: number[] = [];
  CabrillaCumulative: number[] = [];
  TriggerfishCumulative: number[] = [];
  HauchinangoCumulative: number[] = [];
  OthersCumulative: number[] = [];


  totalPerDayFishes: number[] = [0, 0, 0, 0, 0, 0, 0];
  fromDate: string = '';
  toDate: string = '';
  charterFishCount: number = 0;
  anglerFishCount: number = 0;
  fish_Charter: number = 0;
  fish_Angler: number = 0;
  totalFishCount: number = 0;
  fullWeekCount: number = 0;
  fishDataList: any[] = [];
  constructor(private dataService: DataService) {
   
    this.fishTypes.forEach(fish => {
      this.fishCounts[fish] = {
        mondayData: 0, tuesdayData: 0, wednesdayData: 0, thursdayData: 0,
        fridayData: 0, saturdayData: 0, sundayData: 0
      };
      this.fishData[fish] = []; 
    });
    this.initializeFishData();
  }

  ngOnInit(): void {
    this.getAllData();
    this.setDateRange('thisWeek');
  }

  getAllData() {
    this.resetData();

    this.dataService.getAllData(this.fromDate, this.toDate).subscribe({
      next: (response: any) => {
        console.log(response);
        
        if (response.data && Array.isArray(response.data)) {
          for (let i = 0; i < response.data.length; i++) {
            const userDetail = response.data[i].userDetails;
            const createdDate = new Date(response.data[i].created_at);
            const fishType = response.data[i].species;

            const dayOfWeek = createdDate.toLocaleString('en-US', { weekday: 'short' }).toUpperCase();
            const dayKey = this.getDayKey(dayOfWeek);
            
            if (dayKey) {
              this.dayData[dayKey].push(response.data[i]);
              this.dailyFishCount[dayKey]++;
              
              if (this.fishCounts[fishType]) {
                this.fishCounts[fishType][dayKey]++;
                this.fishData[fishType].push(response.data[i]);
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
        console.log('Fish Data:', this.fishData); 
      },
      error: (error: any) => {
        console.log(error);
      }
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
      this.fishData[fish] = []; 
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
  
  initializeFishData() {
    this.fishDataList.forEach(fish => {
        fish.totalCount = fish.dailyCounts.reduce((a:any, b:any) => a + b, 0);
    });
}
getAllFishDataPerDay() {

  this.fishTypes.forEach(fish => {
    this.fishDailyCounts[fish] = [0, 0, 0, 0, 0, 0, 0]; 
  });

  
  Object.keys(this.dayData).forEach(dayKey => {
    this.dayData[dayKey].forEach(data => {
      const fishType = data.species;
      const dayIndex = this.getDayIndex(dayKey);

      if (this.fishDailyCounts[fishType] && dayIndex !== -1) {
        this.fishDailyCounts[fishType][dayIndex]++;
      }
    });
  });
  // Calculate weekly totals
  this.weeklyFishTotals = this.getWeeklyFishTotals();

   // Calculate cumulative counts for each fish type
   this.fishTypes.forEach(fish => {
    this.fishDailyCounts[fish] = this.calculateCumulative(this.fishDailyCounts[fish]);
  });

   // Assign the counts for fish species
    this.YellowfinTuna = this.fishDailyCounts['Yellowfin Tuna'];
    this.Dorado = this.fishDailyCounts['Dorado'];
    this.Sailfish = this.fishDailyCounts['Sailfish'];
    this.StripedMarlin = this.fishDailyCounts['Striped Marlin'];
    this.BlueMarlin = this.fishDailyCounts['Blue Marlin'];
    this.BlackMarlin = this.fishDailyCounts['Black Marlin'];
    this.Wahoo = this.fishDailyCounts['Wahoo'];
    this.yellowtail = this.fishDailyCounts['Yellowtail'];
    this.Roosterfish = this.fishDailyCounts['Roosterfish'];
    this.Pargo = this.fishDailyCounts['Pargo'];
    this.Cabrilla = this.fishDailyCounts['Cabrilla'];
    this.Triggerfish = this.fishDailyCounts['Triggerfish'];
    this.Hauchinango = this.fishDailyCounts['Hauchinango'];
    this.Others = this.fishDailyCounts['Others'];

    
  
    this.YellowfinTunaCumulative = this.calculateCumulative(this.YellowfinTuna);
    this.DoradoCumulative = this.calculateCumulative(this.Dorado);
    this.SailfishCumulative = this.calculateCumulative(this.Sailfish);
    this.StripedMarlinCumulative = this.calculateCumulative(this.StripedMarlin);
    this.BlueMarlinCumulative = this.calculateCumulative(this.BlueMarlin);
    this.BlackMarlinCumulative = this.calculateCumulative(this.BlackMarlin);
    this.WahooCumulative = this.calculateCumulative(this.Wahoo);
    this.yellowtailCumulative = this.calculateCumulative(this.yellowtail);
    this.RoosterfishCumulative = this.calculateCumulative(this.Roosterfish);
    this.PargoCumulative = this.calculateCumulative(this.Pargo);
    this.CabrillaCumulative = this.calculateCumulative(this.Cabrilla);
    this.TriggerfishCumulative = this.calculateCumulative(this.Triggerfish);
    this.HauchinangoCumulative = this.calculateCumulative(this.Hauchinango);
    this.OthersCumulative = this.calculateCumulative(this.Others);

  // Logging the data per fish type per day
  Object.keys(this.fishDailyCounts).forEach(fishType => {
    console.log(`Data for ${fishType}:`, this.fishDailyCounts[fishType]);
  });
}
getDayIndex(dayKey: string): number {
  switch (dayKey) {
    case 'mondayData': return 0;
    case 'tuesdayData': return 1;
    case 'wednesdayData': return 2;
    case 'thursdayData': return 3;
    case 'fridayData': return 4;
    case 'saturdayData': return 5;
    case 'sundayData': return 6;
    default: return -1;
  }
}

calculateCumulative(counts: number[]): number[] {
  let cumulative = 0;
  return counts.map(count => cumulative += count);  
}
getWeeklyFishTotals() {
  const weeklyTotals: { [fishType: string]: number } = {};

  this.fishTypes.forEach(fishType => {
    const dailyCounts = this.fishDailyCounts[fishType]; 
    
   
    console.log(`${fishType} daily counts:`, dailyCounts);

    const totalForWeek = dailyCounts.reduce((acc, count) => acc + count, 0);  
    weeklyTotals[fishType] = totalForWeek; 
  });

  console.log('Weekly Totals:', weeklyTotals);
  return weeklyTotals;
}


}
