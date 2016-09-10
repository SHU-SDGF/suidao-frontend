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
  @Input() changeOptions: EventEmitter<MapOptions>;
  @Output() onTap = new EventEmitter();
  private scale: number = 1;

  private map: any;
  private _markers: Array<MarkerOptions> = [];
  private mapOptions: MapOptions = {markers: []};

  constructor(private $ele: ElementRef){
  }

  ngOnInit(){
    this.changeOptions.subscribe(this._changeOptions.bind(this));
  }

  _changeOptions(opts: MapOptions){
    Object.assign(this.mapOptions, opts); 
    if(opts.imageUrl){
      this.refreshMap();
    }
    if(opts.markers){
      this._redrawMarkers();
    }
  }

  refreshMap(){
    this.$ele.nativeElement.innerHTML = 'Loading...';
    let self = this;

    var image = new Image();
    image.src = this.mapOptions.imageUrl;
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
      crs: L.CRS.Simple,
      zoomControl: false,
      attributionControl: false
    });

    if(this.$ele.nativeElement.offsetWidth / size.width < this.$ele.nativeElement.offsetHeight / size.height){
      this.scale = this.$ele.nativeElement.offsetWidth / size.width;
    }else{
      this.scale = this.$ele.nativeElement.offsetHeight / size.height;
    }

    var bounds = [[0,0], [size.height * this.scale, size.width * this.scale]];
    L.imageOverlay(this.mapOptions.imageUrl, bounds).addTo(this.map);
    
    this.map.fitBounds(bounds);
    this.map.on('click', ($event)=>{
      if($event.originalEvent.target.className.indexOf('leaflet-image-layer') < 0){
        return;
      }
      $event.latlng.lat /= this.scale;
      $event.latlng.lng /= this.scale;
      self.onTap.emit($event);
    });
  }

  _redrawMarkers(){
    this._markers.forEach((marker)=>{
      this._removeMarker(marker);
    });

    this._markers = [];
    this.mapOptions.markers.forEach(marker=>{
      this._drawMarker(marker);
      this._markers.push(marker);
    });
  }

  public addMarker(markerOptions: MarkerOptions){
    this.mapOptions.markers.push(markerOptions);
    this._redrawMarkers();
    return markerOptions;
  }

  public removeMarker(markerOptions: MarkerOptions){
    let index = this.mapOptions.markers.indexOf(markerOptions);
    this.mapOptions.markers.splice(index, 1);
    this._redrawMarkers();
  }

  _drawMarker(markerOptions: MarkerOptions){
    var myIcon = L.icon({
      iconUrl: markerOptions.icon,
      iconSize: [30, 30]
    });

    let marker = L.marker([markerOptions.latitude * this.scale, markerOptions.longitude * this.scale], {icon: myIcon});
    
    marker.addTo(this.map);
    markerOptions.marker = marker;
  }

  _removeMarker(markerOptions: MarkerOptions){
    if(!markerOptions.marker)return;
    this.map.removeLayer(markerOptions.marker);
  }
}

export interface MarkerOptions {
  longitude: number,
  latitude: number,
  icon?: string,
  content?: string,
  diseaseNo?: string,
  description?: string,
  marker?: any
}

export interface MapOptions{
  imageUrl?: string,
  markers: Array<MarkerOptions>
}

export interface Latlng{
  lat: number,
  lng: number
}