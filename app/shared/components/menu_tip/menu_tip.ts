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
  selector: '[menu-top]'
})
export class MenuTip implements OnInit{
  @Input() actionMenuItems: Array<ActionMenuControl>;
  private _show: boolean = false;
  private _element: JQuery;
  private _eleClickHandler: Function = ((_self: MenuTip) => {
    return function (event: JQueryEventObject) {
      _self.toggle();
      event.stopPropagation();
    };
  })(this);
  
  constructor(public renderer: Renderer) {
    
  }

  showOnElement($ele: JQuery, options: Array<ActionMenuControl>) {
    this.hide();
    this._element = $ele;
    this.actionMenuItems = options;
    this.initialize();
    this.show();
  }

  /**
   * init data, bind events  
   */
  ngOnInit() {
    $(this._element).click(this._eleClickHandler);
    this.initialize();
  }

  initialize(): void {
    if (!this.actionMenuItems) return;
    let $parent = $(this._element).parent();
    //$('body').on('click', this.clickHandler);

    // add items to parent
    this.actionMenuItems.forEach((menuControl, i) => {
      let _self = this;
      let $menuTipItem = $('<menu-tip-item class="fa menu-tip-item"></menu-tip-item>').appendTo($parent);

      // init properties
      $menuTipItem.addClass(menuControl.icon);
      menuControl.rotation = getIconRotation(i, this.actionMenuItems.length);
      menuControl.$ele = $menuTipItem;

      $menuTipItem.click(function (e: Event) {
        if (!_self._show) return;
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

  /*  
  clickHandler(event: Event) {
    let $target = $(event.target);
    if ($target.hasClass('menu-tip-item')) return;

    $target = $target.parent('.menu-tip-item');
    if ($target.length) return;
    this.hide();
  }
  */
  
  /**
   * collect gabage, remove event handler
   */
  ngOnDestroy() {
    $(this._element).unbind(this._eleClickHandler);
    //$('body').unbind('click', this.clickHandler);
  }

  refreshPosition() {
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

  toggle(): void{
    if (this._show) {
      this.hide();
    } else {
      this.show();
    }
    this._show = !this._show;
  }

  /**
   * show all elements
   */
  show(): void {
    this.refreshPosition();
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
  hide(): void {
    this.actionMenuItems.forEach((menuControl: ActionMenuControl, i) => {
      // show element on page
      menuControl.$ele.css({
        display: 'block',
        left: menuControl.originPos.x,
        top: menuControl.originPos.y,
        transform: ''
      });

      // move to correct possition   
      setTimeout(() => {
        menuControl.$ele.remove();
      }, ANIMATION_DURATION);

    });
  }
}