import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-employee-preview-list',
  templateUrl: './employee-preview-list.component.html',
  styleUrls: ['./employee-preview-list.component.scss']
})
export class EmployeePreviewListComponent implements OnInit {

  @Input() employees;
  @Input() odcName;
  @Input() month;
  @Input() year;

  constructor() { }

  ngOnInit() {
  }

}
