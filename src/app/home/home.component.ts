import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  fishes: string[] =['TOTAL FISH','CHARTERS','ANGLER','FISH/CHARTER','FISH/ANGLER']
  fishesAmount: number []=[202,175,102,102,102]
  weeks:string[]=['MON','TUE','WED','TUR','FRI','SAT','SUN']
  totalPerDayFishes:number[]=[722,432,12,435,194,456]
}
