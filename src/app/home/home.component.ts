import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  fishes: string[] =['TOTAL FISH','CHARTERS','ANGLER','FISH/CHARTER','FISH/ANGLER']
  fishesAmount: number []=[202,175,102,102,102]
  weeks:string[]=['MON','TUE','WED','TUR','FRI','SAT','SUN']
  totalPerDayFishes:number[]=[722,432,12,435,194,456]
  fromDate: string = '';
  toDate: string = '';
  fromDate2: string = '';
  toDate2: string = '';
  charterFishCount:number=0
  anglerFishCount:number=0
  fish_Charter:number=0
  fish_Angler:number=0
constructor(private dataService:DataService){}

ngOnInit(): void {
  this.getAllData()
}
getAllData() {
  const fromDate2 = '2024-09-25'; 
  const toDate2 = '2024-10-06';
  this.dataService.getAllData(fromDate2, toDate2).subscribe({
      next: (response: any) => {
          if (response.data && Array.isArray(response.data)) {
              for (let i = 0; i < response.data.length; i++) {
                  const userDetail = response.data[i].userDetails;
                  if (userDetail) {
                      const userType = userDetail.user_type; 
                      if (userType === 'Fish/Charter') {
                          this.fish_Charter++;
                      } else if (userType === 'Charter') {
                          this.charterFishCount++;
                      } else if (userType === 'Angler') {
                          this.anglerFishCount++;
                      } else if (userType === 'Fish Angler') {
                          this.fish_Angler++;
                      }
                  }
              }
          }

          
          console.log('Charter Fish Count:', this.charterFishCount);
          console.log('Angler Fish Count:', this.anglerFishCount);
          console.log('Total Fish Charter:', this.fish_Charter);
          console.log('Total Fish Angler:', this.fish_Angler);
      },
      error: (error: any) => {
          console.log(error);
      }
  });
}


  onDateRangeChange(event: any): void {
    const selectedValue = event.target.value;
    this.setDateRange(selectedValue);
    this.getAllData(); 
  }
    
   setDateRange(range: string): void {
      const today = new Date();
      switch (range) {
        case 'thisWeek':
          const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
          const endOfWeek = new Date(today.setDate(startOfWeek.getDate() + 6));
          this.fromDate = startOfWeek.toISOString().split('T')[0];
          this.toDate = endOfWeek.toISOString().split('T')[0];
          break;
  
          case 'previousWeek': 
          const previousWeekStart = new Date(today.setDate(today.getDate() - today.getDay() - 14));
          const previousWeekEnd = new Date(today.setDate(previousWeekStart.getDate() + 6));
          this.fromDate = previousWeekStart.toISOString().split('T')[0];
          this.toDate = previousWeekEnd.toISOString().split('T')[0];
          break;
  
        case 'lastWeek':
          const lastWeekStart = new Date(today.setDate(today.getDate() - today.getDay() - 7));
          const lastWeekEnd = new Date(today.setDate(lastWeekStart.getDate() + 6));
          this.fromDate = lastWeekStart.toISOString().split('T')[0];
          this.toDate = lastWeekEnd.toISOString().split('T')[0];
          break;
  
        default:
          this.fromDate = '';
          this.toDate = '';
      }
    }
}