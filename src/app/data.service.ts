import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

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
  updateData(itemId: string, updatedData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/data/updateData/${itemId}`, updatedData);
  }
  getDataById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/data/getDataById/${id}`);
  }
}
