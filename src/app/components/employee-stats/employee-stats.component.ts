import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Employee } from '../../models/employee';
import { EmployeeDataService } from '../../providers/employee-data.service';

@Component({
  selector: 'app-employee-stats',
  templateUrl: './employee-stats.component.html',
  styleUrls: ['./employee-stats.component.scss']
})
export class EmployeeStatsComponent implements OnInit, OnDestroy {

  private paramSubscription: Subscription;
  private id: string;
  employee: Employee;

  constructor(
    public employeeDataService: EmployeeDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.paramSubscription = this.route.paramMap.subscribe((params: Params) => {
      setTimeout(_ => {
        this.id = params.get('id');
        this.employee = this.employeeDataService.getEmployeeRecord(this.id);
      }, 0);
    });
  }

  ngOnDestroy(): void {
    this.paramSubscription.unsubscribe();
  }

  goToHome(event) {
    this.router.navigateByUrl('/');
  }
}
