import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './componentes/button/button.component';
import { BadgeComponent } from './componentes/badge/badge.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './componentes/header/header.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    ButtonComponent,
    BadgeComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    BadgeComponent,
    HeaderComponent
  ]
})
export class SharedModule { }
