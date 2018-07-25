import { Component, OnInit } from '@angular/core';
import { UploadFile, UploadEvent, FileSystemFileEntry } from 'ngx-file-drop';
import * as XLSX from 'xlsx';​

import { Employee } from '../../models/employee';
import { EmployeeDataService } from '../../providers/employee-data.service';
import { ElectronService } from '../../providers/electron.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public files: UploadFile[] = [];
  public employees: Employee[];
  public odcName: string;
  public month: string;
  public year: string;

  constructor(
    private employeeDataService: EmployeeDataService,
    private electronService: ElectronService
  ) { }

  ngOnInit() {
    this.employees = this.employeeDataService.employees
      ? this.employeeDataService.employees : undefined;
    this.odcName = this.employeeDataService.odcName
      ? this.employeeDataService.odcName : undefined;
    this.month = this.employeeDataService.month
      ? this.employeeDataService.getMonthName(Number(this.employeeDataService.month)) : undefined;
    this.year = this.employeeDataService.year
      ? this.employeeDataService.year : undefined;
  }
  public fileDropped(event: UploadEvent) {
    this.files = event.files;
    for (const droppedFile of event.files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.read(file);
        });
      }
    }
  }

  public read(file) {
    const reader: FileReader = new FileReader();
    if (file) {
      reader.readAsBinaryString(file);
    }
    reader.onloadend = (e: any) => {
      const bstr: string = e.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const fileData = this.employeeDataService
        .processRowData(<any>(XLSX.utils.sheet_to_json(ws, { header: 10 })));
      this.odcName = fileData.odcName;
      this.month = this.employeeDataService.getMonthName(Number(fileData.month));
      this.year = fileData.year;
      this.employees = fileData.employees;
    };
  }

  public fileOver(event) {
  }

  public fileLeave(event) {
  }

  public minimizeWindow() {
    this.electronService.window.minimize();
  }

  public closeWindow() {
    this.electronService.window.close();
  }
}
