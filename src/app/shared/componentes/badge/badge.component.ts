import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: false,
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.css'
})
export class BadgeComponent {

  @Input() status: 1 | 2 | 3 = 1;

  get statusColor(): string{
    switch (this.status){
      case 1:
        return 'bg-gray-200 text-gray-800';
      case 2:
        return 'bg-yellow-200 text-yellow-800';
      case 3:
        return 'bg-green-200 text-green-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  }
}
