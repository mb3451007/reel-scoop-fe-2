import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  weeklyFishTotals: { [fishType: string]: number } = {};
  weeks: string[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  fishTypes = [
    'Yellowfin Tuna',
    'Dorado',
    'Sailfish',
    'Striped Marlin',
    'Blue Marlin',
    'Black Marlin',
    'Wahoo',
    'Yellowtail',
    'Roosterfish',
    'Pargo',
    'Cabrilla',
    'Triggerfish',
    'Hauchinango',
    'Others',
  ];

  dailyFishCount: { [key: string]: number } = {
    mondayData: 0,
    tuesdayData: 0,
    wednesdayData: 0,
    thursdayData: 0,
    fridayData: 0,
    saturdayData: 0,
    sundayData: 0,
  };

  fishCounts: { [key: string]: { [key: string]: number } } = {};
  fishData: { [key: string]: any[] } = {};
  fishesData: any;
  dayData: { [key: string]: any[] } = {
    mondayData: [],
    tuesdayData: [],
    wednesdayData: [],
    thursdayData: [],
    fridayData: [],
    saturdayData: [],
    sundayData: [],
  };

  fishDailyCounts: { [fishType: string]: number[] } = {};
  YellowfinTuna: number[] = [];
  Dorado: number[] = [];
  Sailfish: number[] = [];
  StripedMarlin: number[] = [];
  BlueMarlin: number[] = [];
  BlackMarlin: number[] = [];
  Wahoo: number[] = [];
  yellowtail: number[] = [];
  Roosterfish: number[] = [];
  Pargo: number[] = [];
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
  userLoggedIn: any;
  userLoginIn: boolean = false;
  dateRanges: any = {};
  isCustomDateSelected: boolean = false;
  maxCustomDate: string;
  isLoading: boolean = false;

  constructor(private dataService: DataService) {
    this.maxCustomDate = this.getCurrentDate();
    this.fishTypes.forEach((fish) => {
      this.fishCounts[fish] = {
        mondayData: 0,
        tuesdayData: 0,
        wednesdayData: 0,
        thursdayData: 0,
        fridayData: 0,
        saturdayData: 0,
        sundayData: 0,
      };
      this.fishData[fish] = [];
    });
    this.initializeFishData();
  }

  ngOnInit(): void {
    const user = localStorage.getItem('User');
    if (user) {
      this.userLoggedIn = JSON.parse(user);
    }
    this.checkLogin();

    // Initialize date ranges for the dropdown options
    this.initializeDateRanges();

    // Explicitly set and load "This Week" data
    this.loadThisWeekData();
  }

  initializeDateRanges(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
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
    // Set the active date range to "This Week"
    this.fromDate = this.dateRanges['thisWeek'].from;
    this.toDate = this.dateRanges['thisWeek'].to;

    // Load the data
    this.getAllData();
  }

  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getAllData() {
    this.isLoading = true;
    this.resetData();

    this.dataService.getAllData(this.fromDate, this.toDate).subscribe({
      next: (response: any) => {
        if (response.data && Array.isArray(response.data)) {
          for (let i = 0; i < response.data.length; i++) {
            const userDetail = response.data[i].userDetails;
            const createdDate = new Date(response.data[i].created_at);
            const fishType = response.data[i].species;
            const quantity = response.data[i].quantity || 0;

            const dayOfWeek = createdDate
              .toLocaleString('en-US', { weekday: 'short' })
              .toUpperCase();
            const dayKey = this.getDayKey(dayOfWeek);

            if (dayKey) {
              this.dayData[dayKey].push(response.data[i]);
              this.dailyFishCount[dayKey] += quantity;

              if (this.fishCounts[fishType]) {
                this.fishCounts[fishType][dayKey] += quantity;
                this.fishData[fishType].push(response.data[i]);
              }
            }

            if (userDetail) {
              const userType = userDetail.user_type;
              if (userType === 'Fish/Charter') {
                this.fish_Charter += quantity;
                this.totalFishCount += quantity;
              } else if (userType === 'Charter') {
                this.charterFishCount += quantity;
                this.totalFishCount += quantity;
              } else if (userType === 'Angler') {
                this.anglerFishCount += quantity;
                this.totalFishCount += quantity;
              } else if (userType === 'Fish/Angler') {
                this.fish_Angler += quantity;
                this.totalFishCount += quantity;
              }
            }
          }
        }
        this.calculateWeekDays();
        this.getAllFishDataPerDay();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error fetching data:', error);
        this.isLoading = false;
      },
    });
  }

  resetData() {
    this.charterFishCount = 0;
    this.anglerFishCount = 0;
    this.fish_Charter = 0;
    this.fish_Angler = 0;
    this.totalFishCount = 0;

    Object.keys(this.dayData).forEach((day) => {
      this.dayData[day] = [];
    });

    Object.keys(this.dailyFishCount).forEach((day) => {
      this.dailyFishCount[day] = 0;
    });

    this.fishTypes.forEach((fish) => {
      Object.keys(this.fishCounts[fish]).forEach((day) => {
        this.fishCounts[fish][day] = 0;
      });
      this.fishData[fish] = [];
    });

    this.fishTypes.forEach((fish) => {
      this.fishDailyCounts[fish] = [0, 0, 0, 0, 0, 0, 0];
    });

    this.weeklyFishTotals = {};
    this.fishTypes.forEach(fish => {
      this.weeklyFishTotals[fish] = 0;
    });

    this.YellowfinTuna = [0, 0, 0, 0, 0, 0, 0];
    this.Dorado = [0, 0, 0, 0, 0, 0, 0];
    this.Sailfish = [0, 0, 0, 0, 0, 0, 0];
    this.StripedMarlin = [0, 0, 0, 0, 0, 0, 0];
    this.BlueMarlin = [0, 0, 0, 0, 0, 0, 0];
    this.BlackMarlin = [0, 0, 0, 0, 0, 0, 0];
    this.Wahoo = [0, 0, 0, 0, 0, 0, 0];
    this.yellowtail = [0, 0, 0, 0, 0, 0, 0];
    this.Roosterfish = [0, 0, 0, 0, 0, 0, 0];
    this.Pargo = [0, 0, 0, 0, 0, 0, 0];
    this.Cabrilla = [0, 0, 0, 0, 0, 0, 0];
    this.Triggerfish = [0, 0, 0, 0, 0, 0, 0];
    this.Hauchinango = [0, 0, 0, 0, 0, 0, 0];
    this.Others = [0, 0, 0, 0, 0, 0, 0];
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
        this.totalPerDayFishes[i] =
          this.totalPerDayFishes[i - 1] + this.dailyFishCount[dayKey];
      }
    }
  }

  onDateRangeChange(event: any): void {
    const selectedValue = event.target.value;
    if (selectedValue === 'custom_date') {
      this.isCustomDateSelected = true;
      return;
    }
    this.isCustomDateSelected = false;
    this.setDateRange(selectedValue);
    this.getAllData();
  }

  onCustomDateChange(event: any): void {
    const customDate = event.target.value;
    if (!customDate) return;

    this.setDateRange('custom-date', customDate);
    this.getAllData();
  }

  setDateRange(range: string, customDate?: string): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (range) {
      case 'thisWeek':
        const thisWeekStart = new Date(today);
        thisWeekStart.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
        const thisWeekEnd = new Date(thisWeekStart);
        thisWeekEnd.setDate(thisWeekStart.getDate() + 6);
        this.fromDate = this.formatDate(thisWeekStart);
        this.toDate = this.formatDate(thisWeekEnd);
        break;

      case 'lastWeek':
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(today.getDate() - today.getDay() - 6 + (today.getDay() === 0 ? -6 : 1));
        const lastWeekEnd = new Date(lastWeekStart);
        lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
        this.fromDate = this.formatDate(lastWeekStart);
        this.toDate = this.formatDate(lastWeekEnd);
        break;

      case 'twoWeeksAgo':
        const twoWeeksStart = new Date(today);
        twoWeeksStart.setDate(today.getDate() - today.getDay() - 13 + (today.getDay() === 0 ? -6 : 1));
        const twoWeeksEnd = new Date(twoWeeksStart);
        twoWeeksEnd.setDate(twoWeeksStart.getDate() + 6);
        this.fromDate = this.formatDate(twoWeeksStart);
        this.toDate = this.formatDate(twoWeeksEnd);
        break;

      case 'threeWeeksAgo':
        const threeWeeksStart = new Date(today);
        threeWeeksStart.setDate(today.getDate() - today.getDay() - 20 + (today.getDay() === 0 ? -6 : 1));
        const threeWeeksEnd = new Date(threeWeeksStart);
        threeWeeksEnd.setDate(threeWeeksStart.getDate() + 6);
        this.fromDate = this.formatDate(threeWeeksStart);
        this.toDate = this.formatDate(threeWeeksEnd);
        break;

      case 'custom-date':
        if (customDate) {
          const selectedDate = new Date(customDate);
          selectedDate.setHours(0, 0, 0, 0);

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

    if (range !== 'custom-date') {
      this.dateRanges[range] = { from: this.fromDate, to: this.toDate };
    }

    this.isCustomDateSelected = range === 'custom-date';
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  initializeFishData() {
    this.fishDataList.forEach((fish) => {
      fish.totalCount = fish.dailyCounts.reduce((a: any, b: any) => a + b, 0);
    });
  }

  getAllFishDataPerDay() {
    this.fishTypes.forEach((fish) => {
      this.fishDailyCounts[fish] = [0, 0, 0, 0, 0, 0, 0];
    });

    Object.keys(this.dayData).forEach((dayKey) => {
      this.dayData[dayKey].forEach((data) => {
        const fishType = data.species;
        const quantity = data.quantity || 0;
        const dayIndex = this.getDayIndex(dayKey);

        if (this.fishDailyCounts[fishType] && dayIndex !== -1) {
          this.fishDailyCounts[fishType][dayIndex] += quantity;
        }
      });
    });

    this.weeklyFishTotals = this.getWeeklyFishTotals();
    this.fishTypes.forEach((fish) => {
      this.fishDailyCounts[fish] = this.calculateCumulative(
        this.fishDailyCounts[fish]
      );
    });

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
    const todayIndex = new Date().getDay() - 1;
    let cumulative = 0;

    return counts.map((count, index) => {
      if (index <= todayIndex) {
        cumulative += count;
        return cumulative;
      } else {
        return 0;
      }
    });
  }

  getWeeklyFishTotals() {
    const weeklyTotals: { [fishType: string]: number } = {};

    this.fishTypes.forEach((fishType) => {
      const dailyCounts = this.fishDailyCounts[fishType];
      const totalForWeek = dailyCounts.reduce((acc, count) => acc + count, 0);
      weeklyTotals[fishType] = totalForWeek;
    });
    return weeklyTotals;
  }

  checkLogin() {
    this.userLoginIn = !!this.userLoggedIn;
  }
}
