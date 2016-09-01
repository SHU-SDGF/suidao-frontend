import {Directive, EventEmitter, ElementRef, OnInit, Input, Output} from '@angular/core';

declare const L: any;
const IMAGE_WIDTH: number = 1000;
const IMAGE_HEIGHT: number = 1000;

interface ImageSize{
  width: number,
  height: number
}

@Directive({
  selector: 'image-editor',
})
export class ImageEditor implements OnInit{
  @Input() imagePath: string;
  @Input() diseases: Array<any>;
  @Output() onTap = new EventEmitter();
  private map: any;

  constructor(private $ele: ElementRef){
  }

  ngOnInit(){
    this.$ele.nativeElement.innerHTML = 'Loading...';
    let self = this;

    var image = new Image();
    image.src = this.imagePath;
    image.onload = () => {
      let size: ImageSize = getImageSize(image);
      self.imageLoaded(size);
    };

    function getImageSize(image) {
      return{
        width: image.width,
        height: image.height
      };
    }
  }

  imageLoaded(size: ImageSize){
    let self = this;

    this.$ele.nativeElement.innerHTML = '';
    this.map = L.map(this.$ele.nativeElement, {
      crs: L.CRS.Simple
    });
    var bounds = [[0,0], [size.height, size.width]];
    L.imageOverlay(this.imagePath, bounds).addTo(this.map);
    

    this.map.fitBounds(bounds);

  }
}