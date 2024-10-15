import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = environment.baseUrl;
  constructor(private http:HttpClient) { }


  getData(page:any,userId:any,fromDate:string,toDate:string) {
    return this.http.get<any>(`${this.baseUrl}/data/getData/${page}?userId=${userId}&fromDate=${fromDate}&toDate=${toDate}`);
  }
  getAllData(fromDate:string,toDate:string) {
    return this.http.get<any>(`${this.baseUrl}/data/getAllData/?fromDate=${fromDate}&toDate=${toDate}`);
  }
  addData(data:any) {
    return this.http.post<any>(`${this.baseUrl}/data/addData`, data);
  }
}
