import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeStatsComponent } from './components/employee-stats/employee-stats.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
      path: 'employees/:id',
      component: EmployeeStatsComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
