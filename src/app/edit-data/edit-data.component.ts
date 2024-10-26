import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-data',
  templateUrl: './edit-data.component.html',
  styleUrls: ['./edit-data.component.css']
})
export class EditDataComponent implements OnInit {
  data: any = null;
  dataId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.dataId = this.route.snapshot.paramMap.get('id');
    if (this.dataId) {
      this.dataService.getDataById(this.dataId).subscribe({
        next: (response) => {
          this.data = response.data;
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.dataId) {
      this.dataService.updateData(this.dataId, this.data).subscribe({
        next: () => {
          console.log('Data updated successfully');
          this.toastr.success('Data Updated successfully!');
          this.router.navigate(['/data']);
        },
        error: (error) => {
          console.error('Error updating data:', error);
          this.toastr.error('Error updating data!');
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/data']);
  }
}
