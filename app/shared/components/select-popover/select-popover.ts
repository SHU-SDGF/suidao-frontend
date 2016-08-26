import {
  Component,
  Directive,
  ElementRef,
  Renderer,
  Input,
  Output,
  EventEmitter,
  OnInit,
  NgZone,
  OnChanges,
  SimpleChange
} from '@angular/core';
import {
  PopoverController,
  ViewController,
  NavParams,
  Popover
} from 'ionic-angular';

@Directive({
  selector: '[SelectPopover]'
})
export class SelectPopover implements OnInit, OnChanges{
  @Input() itemList: Array<any>;
  @Input() itemDisplayName: string;
  @Input() selectedItem: any;
  @Output() selectChanged = new EventEmitter;

  hidden: boolean = true;
  _popover: Popover;
    
  constructor(
    private el: ElementRef,
    public renderer: Renderer,
    private _popoverCtrl: PopoverController) { }

  // init
  ngOnInit() {
    this.renderer.listen(this.el.nativeElement, 'click', ($event) => {
      this.toggleSelectList($event);
    });
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    if (!changes) return;
    if (!changes['selectedItem'] || changes['selectedItem'].isFirstChange()) return;
    this.selectedItem = changes['selectedItem'].currentValue;
  }

  // toggle select list
  toggleSelectList($event) {
    if (this.hidden) {
      let view = {};

      this._popover = this._popoverCtrl.create(SelectPopoverList,
        { itemList: this.itemList, itemDisplayName: this.itemDisplayName, view: view });
      view['popover'] = this._popover;

      this._popover.present({ev: $event});
      this._popover.onDidDismiss((item: any) => {
        this.hidden = true;
        if (this.selectedItem == item) return;
        this.selectChanged.emit(item);
        console.log(item);
      });
    } else if(this._popover){
      this._popover.dismiss();
    }
    this.hidden = !this.hidden;
  }
}

@Component({
  template: `
    <ion-list class="select-popover">
      <ion-item *ngFor="let item of itemList" (click)="selectItem(item)">{{item[itemDisplayName]}}</ion-item>
    </ion-list>
  `
})
class SelectPopoverList implements OnInit{
  itemList: Array<any>
  itemDisplayName: string = 'name';
  _view: {};

  constructor(
    private _viewCtrl: ViewController,
    private params: NavParams,
    private zoon: NgZone
  ) { }

  // init
  ngOnInit() {
    this.itemList = this.params.get('itemList') || [];
    this.itemDisplayName = this.params.get('itemDisplayName') || this.itemDisplayName;
    this._view = this.params.get('view');
  }

  // when selected  
  selectItem(item) {
    this._view['popover'].dismiss(item);
  }
}