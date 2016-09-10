import {forwardRef, Component, Input, Output, OnChanges, EventEmitter, SimpleChange, ChangeDetectionStrategy, OnInit, HostListener, ElementRef, Renderer} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';


export const STATUS_PICKER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => StatusPicker),
    multi: true
};

const noop = () => {
};


@Component({
  selector: 'status-picker',
  template: `
    <button *ngFor="let option of options" type="button"
      [attr.aria-pressed]="selectedValue == option[valueField]? true: false"
      [ngClass]="selectedValue == option[valueField] ? option[selectedClassField] : []" 
      (click)="selectOption(option)">
        {{option[textField]}}
    </button>
  `,
  providers: [STATUS_PICKER_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusPicker  implements OnInit, ControlValueAccessor{
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
        this.selectOption(this.options[0]);
      }
    }
  }

  selectOption(option:any) {
    if(this.disabled) return;
    this.value = option[this.valueField];
  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    if (value !== this.value) {
        this.value = value;
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
