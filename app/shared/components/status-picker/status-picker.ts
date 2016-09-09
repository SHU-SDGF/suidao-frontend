import {Component, Input, Output, EventEmitter, HostListener, ElementRef, Renderer} from '@angular/core';
import {NgModel} from '@angular/common';

@Component({
  selector: 'status-picker',
  template: `
    <button *ngFor="let option of options" (click)="selectOption(option)">
      {{option[textField]}}
    </button>
  `,
  providers: [NgModel],
  host: {
    '(ngModelChange)' : 'onStatusChange($event)'
  }
})
export class StatusPicker {
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
  @Input() options: Array<any>;
  @Input() textField: string;
  @Input() valueField: string;
  value: any;

  constructor(
    private el: ElementRef,
    public renderer: Renderer) {
    this.textField = this.textField || 'name';
    this.valueField = this.valueField || 'value';
  }

  onStatusChange($event){
    this.value = $event.target.value;
    this.ngModelChange.emit(this.value);
  }

  selectOption(option:any) {
    this.ngModelChange.emit(option[this.valueField]);
  }
}
