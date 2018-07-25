import { NgModule  } from '@angular/core';
import { MatCardModule, MatIconModule, MatButtonModule } from '@angular/material';

@NgModule({
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class AppMaterialModule {}
