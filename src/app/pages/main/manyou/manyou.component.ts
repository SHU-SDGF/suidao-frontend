import { ToggleMenu } from '../../../shared/components/toggle-menu/toggle-menu.component';
import { Component, AfterViewInit } from '@angular/core';

interface Autodest{
  
};

@Component({
  selector: 'mainyou-page',
  templateUrl: './manyou.component.html',
  styles: ['./manyou.component.scss']
})
export class ManyouComponent extends ToggleMenu implements AfterViewInit {

  ngAfterViewInit() {
    
  }

}