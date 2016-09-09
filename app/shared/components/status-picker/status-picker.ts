import {Component, Input, Output, OnChanges, EventEmitter, SimpleChange, ChangeDetectionStrategy, OnInit, HostListener, ElementRef, Renderer} from '@angular/core';
import {NgModel} from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';


const noop = () => {
};


@Component({
  selector: 'status-picker',
  template: `
    <button *ngFor="let option of options" 
      [attr.aria-pressed]="selectedValue == option[valueField]? true: false"
      [ngClass]="selectedValue == option[valueField] ? option[selectedClassField] : []" 
      (click)="selectOption(option)">
        {{option[textField]}}
    </button>
  `,
  providers: [NgModel],
  host: {
    '(ngModelChange)' : 'onStatusChange($event)'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusPicker  implements OnInit, ControlValueAccessor{
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
  @Input() options: Array<any>;
  @Input() textField: string;
  @Input() valueField: string;
  @Input() selectedClassField: string;
  @Input() disabled: boolean;
  private onChangeCallback: (_: any) => void = noop;
  private onTouchedCallback: () => void = noop;
  private selectedValue: any;

  //get accessor
  get value(): any {
    return this.selectedValue;
  };

  //set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this.selectedValue) {
        this.selectedValue = v;
        this.onChangeCallback(v);
    }
  }

  constructor(
    private el: ElementRef,
    public renderer: Renderer) {
  }

  ngOnInit(){
    this.textField = this.textField || 'name';
    this.valueField = this.valueField || 'value';
    this.selectedClassField = this.selectedClassField || 'color';
    
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }){
    if(changes['options']){
      this.options = changes['options'].currentValue;
      if(this.options && this.options.length && (this.selectedValue === undefined || this.selectedValue === null)){
        this.selectedValue = this.options[0][this.valueField];
      }
    }
  }

  onStatusChange($event){
    if($event.target){
      this.selectedValue = $event.target.value;
      if(this.ngModelChange){
        this.ngModelChange.emit(this.selectedValue);
      }
    }
  }

  selectOption(option:any) {
    if(this.disabled) return;
    this.selectedValue = option[this.valueField];
    if(this.ngModelChange){
      this.ngModelChange.emit(option[this.valueField]);
    }
  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    if (value !== this.selectedValue) {
        this.selectedValue = value;
    }
  }

  //From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: any) {
      this.onTouchedCallback = fn;
  }
}
