import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-employee-preview',
  templateUrl: './employee-preview.component.html',
  styleUrls: ['./employee-preview.component.scss']
})
export class EmployeePreviewComponent implements OnInit {

  @Input() employee;

  constructor() { }

  ngOnInit() {
  }

}
