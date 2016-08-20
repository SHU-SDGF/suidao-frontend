/// <reference path="../../../../typings/main/ambient/jquery/index.d.ts" />


import {
  Component,
  ViewChild,
  Input,
  Output,
  ElementRef,
  Renderer,
  Directive,
  OnInit,
  OnDestroy
} from '@angular/core';


interface IconPosition{
  x: number, y: number
}

interface ActionMenuControl{
  icon: string,
  action: Function,
  tip: string,
  rotation?: number,
  originPos?: IconPosition
  $ele?: JQuery
}

const ANIMATION_DURATION: number = 200;
const ANGLE: number = 35;
const RADIUS: number = 80;

@Directive({
  selector: 'menu-top'
})
export class MenuTip implements OnInit{
  @Input() actionMenuItems: Array<ActionMenuControl>;
  private _show: boolean = false;
  private _element: JQuery;

  private clickHandler: ($event: JQueryEventObject) => void = ((_self: MenuTip)=> ($event: JQueryEventObject) => {
    if(!_self._element) return;
    if(!_self._element.is($event.target)
        && !_self._element.has($event.target).length){
        _self.hide();
        return;
    }
    if(_self._show){
      _self.hide();
    }else{
      _self.show();
    }
  })(this)
  
  constructor(public renderer: Renderer) {
    
  }

  public showOnElement($ele: JQuery, options: Array<ActionMenuControl>) {
    if($ele.is(this._element))return;
    this.hide();
    this._element = $ele;
    this._element.addClass('menu-tip-handler');
    this.actionMenuItems = options;
    this.show();
  }

  /**
   * init data, bind events  
   */
  ngOnInit() {
    //$(this._element).click(this._eleClickHandler);
    $(document).mouseup(this.clickHandler);
    
    this.initialize();
  }

  initialize(): void {
    if (!this.actionMenuItems) return;
    let $parent = $(this._element).parent();

    // add items to parent
    this.actionMenuItems.forEach((menuControl, i) => {
      let _self = this;
      let $menuTipItem = $('<menu-tip-item class="fa menu-tip-item"></menu-tip-item>').appendTo($parent);

      // init properties
      $menuTipItem.addClass(menuControl.icon);
      menuControl.rotation = getIconRotation(i, this.actionMenuItems.length);
      menuControl.$ele = $menuTipItem;

      $menuTipItem.click(function (e: Event) {
        menuControl.action.apply(menuControl.action, _self);
        e.stopPropagation();
      });
    });
    
    function getIconRotation(i: number, totalLength: number): number{
      
      let totalAngle = (totalLength - 1) * ANGLE;
      let startAngle = (180 - totalAngle) / 2;
      let itemAngle = startAngle + i * ANGLE;

      return itemAngle;
    };
  }

  

  
  /**
   * collect gabage, remove event handler
   */
  ngOnDestroy() {
    //$(this._element).unbind(this._eleClickHandler);
    $('body').unbind('click', this.clickHandler);
  }

  private _refreshPosition() {
    let $ele = $(this._element);
    let $parent = $(this._element).parent();
    
    let elePosition: IconPosition = {
      x: $ele.offset().left - $parent.offset().left + $ele.width()/2 - 20,
      y: $ele.offset().top - $parent.offset().top + $ele.height()/2 - 20
    };

    this.actionMenuItems.forEach((menuControl: ActionMenuControl, i) => {
      menuControl.originPos = elePosition;
    });
  }

  /**
   * show all elements
   */
  public show(): void {
    this.initialize();
    this._show = true;
    this._refreshPosition();
    this.actionMenuItems.forEach((menuControl: ActionMenuControl, i) => {
      // show element on page
      menuControl.$ele.css({
        display: 'block',
        left: menuControl.originPos.x,
        top: menuControl.originPos.y
      });

      // move to correct possition   
      let transforms = [
        'rotate(' + menuControl.rotation + 'deg)',
        'translateX(-' + RADIUS + 'px)',
        'rotate(-' + menuControl.rotation + 'deg)'
      ];

      setTimeout(() => {
        menuControl.$ele.css({
          transform: transforms.join(' ')
        });
      });
    });
  }

  /**
   *  animate tips and hide after animation.
   * */
  public hide(): void {
    this._show = false;
    if(!this._element)return;
    this.actionMenuItems.forEach((menuControl: ActionMenuControl, i) => {

      if(!menuControl.$ele || !menuControl.$ele.length) return;
      // show element on page
      menuControl.$ele.css({
        display: 'block',
        left: menuControl.originPos.x,
        top: menuControl.originPos.y,
        transform: ''
      });

      let $ele = menuControl.$ele;

      // move to correct possition   
      setTimeout(() => {
        $ele.remove();
      }, ANIMATION_DURATION);

    });
  }
}