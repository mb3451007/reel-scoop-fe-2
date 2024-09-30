import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = 'http://localhost:3000/data';
  constructor(private http:HttpClient) { }


  getData(page:any,userId:any,fromDate:string,toDate:string) {
    return this.http.get<any>(`${this.baseUrl}/getData/${page}?userId=${userId}&fromDate=${fromDate}&toDate=${toDate}`);
  }
  addData(data:any) {
    return this.http.post<any>(`${this.baseUrl}/addData`, data);
  }
}
