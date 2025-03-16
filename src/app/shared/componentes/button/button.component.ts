import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: false,
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {

  @Input() type: 'primary' | 'secondary' | 'danger' = 'primary' ;
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Output() clicked = new EventEmitter<void>();

  onClick(): void{
    if (!this.disabled && !this.loading) {
      this.clicked.emit();
    }
  }
}
