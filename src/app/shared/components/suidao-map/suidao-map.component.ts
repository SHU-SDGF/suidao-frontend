import { Input, Output, EventEmitter, ElementRef, OnInit, Component, OnChanges, NgZone } from '@angular/core';
import { BaiduMap, MapOptions } from 'angular2-baidu-map';
import * as $ from 'jquery';

declare const BMap: any;

@Component({
  selector: 'suidao-map',
  template: `
      <div class="offlinePanel">
          <label class="offlineLabel">{{ offlineWords }}</label>
      </div>
  `
})
export class SuidaoMap extends BaiduMap implements OnInit, OnChanges {
  @Input() ak: string;
  @Input() options: MapOptions;
  @Input() changeOptions: EventEmitter<MapOptions>;
  @Output() onMapLoaded = new EventEmitter();
  @Output() onMarkerClicked = new EventEmitter();
  @Output() onMapClick = new EventEmitter;
  @Output() onMapLongClick = new EventEmitter;
  @Output() onDblClick = new EventEmitter;
  @Output() onTouchStart = new EventEmitter;
  @Output() onTouchEnd = new EventEmitter;
  @Output() onTouchMove = new EventEmitter;

  private _previousPoint: {x: number, y: number};
  private _previousLabels = [];
  private _longClickEnabled: boolean = false;
  public offlineOpts = {
    retryInterval: 3000,
    txt: ''
  };

  constructor(private _el: ElementRef, private zoom: NgZone) {
    super(_el);
  }

  ngOnInit() {
    super.ngOnInit();
    let _self = this;
    this.onOptionsChange.bind(this);

    _self.onMapLoaded.subscribe(event => {

      // bind click event    
      window['map'] = _self.map;
      _self.map.addEventListener('click', ($event: MapEvent) => {
        _self.zoom.run(() => {
          _self.onMapClick.emit($event);
        });
      });
      // bind longpress event
      _self.map.addEventListener('longpress', ($event: MapEvent) => {
        if (!this._longClickEnabled) return;
        _self.zoom.run(() => {
           _self.onMapLongClick.emit($event);
        });
      });
      // bind double click event
      _self.map.addEventListener('dblclick', ($event: MapEvent) => {
        _self.zoom.run(() => {
          _self.onDblClick.emit($event);
        });
      });
      // bind touch start
      _self.map.addEventListener('touchstart', ($event: MapEvent) => {
        this._enableLongClick();
        _self.zoom.run(() => {
          _self._previousPoint = $event.pixel;
          _self.onTouchStart.emit($event);
        });
      });
      // bind touch end
      _self.map.addEventListener('touchend', ($event: MapEvent) => {
        _self.zoom.run(() => {
          _self.onTouchEnd.emit($event);
        });  
      });
      // bind touch move
      _self.map.addEventListener('touchmove', ($event: MapEvent) => {
        _self.zoom.run(() => {
          let dist = Math.pow($event.pixel.x - _self._previousPoint.x, 2)
            + Math.pow($event.pixel.y - _self._previousPoint.y, 2);
          dist = Math.sqrt(dist);
          if (dist > 10) {
            this._preventLongClick();
          }
          _self.onTouchMove.emit($event);
        });
      });

      setTimeout(() => { $('.BMap_geolocationIcon').click(); });

      // bind options change
      if (_self.changeOptions) {
        _self.changeOptions.subscribe(this.onOptionsChange.bind(this));
      }
    });
  }

  private _preventLongClick(){
    this._longClickEnabled = false;
  }

  private _enableLongClick(){
    this._longClickEnabled = true;
  }

  // on options change
  private onOptionsChange(options: MapOptions){
    Object.assign(this.options, options);

    this._changeCenter({
      lat: this.options.center.latitude,
      lng: this.options.center.longitude
    });

    this._redrawMarkers();
  }

  // change map center
  public changeCenter(point: MapPoint) {
    this.options.center = {
      latitude: point.lat,
      longitude: point.lng
    };
    
    this._changeCenter(point);
  }

  private _changeCenter(point: MapPoint) {
    this.map.panTo(new BMap.Point(point.lng, point.lat));
  }
  
  // add marker
  public addMarker(marker: MarkerOptions): MarkerOptions {
    let markers = this.options.markers.concat([]);
    markers.push(marker);
    this.options.markers = markers;
    this._redrawMarkers();
    return marker;
  }

  // remove marker
  public removeMarker(marker): MarkerOptions {
    let markers = this.options.markers.concat([]);
    let i = markers.indexOf(marker);
    markers.splice(i, 1);
    this.options.markers = markers;
    this._redrawMarkers();
    return marker
  }
  
  // redraw markers
  private _redrawMarkers() {
    var BMap: any = (<any>window)['BMap'];
    let _self = this;

    this.previousMarkers.forEach(({marker, listeners}) => {
        listeners.forEach(listener => { marker.removeEventListener('click', listener); });
        this.map.removeOverlay(marker);
    });

    this.previousMarkers.splice(0);

    if (!this.options.markers) {
      return;
    }

    this.options.markers.forEach((marker: MarkerOptions) => {

      var marker2 = createMarker(marker, new BMap.Point(marker.longitude, marker.latitude));

      // add marker to the map
      _self.map.addOverlay(marker2);
      let previousMarker: PreviousMarker = { marker: marker2, listeners: [] };
      this.previousMarkers.push(previousMarker);

      let onMarkerClickedListener = ($event: Event) => {
        _self.zoom.run(() => {
          _self.onMarkerClicked.emit({obj: marker, marker: marker2});
        });
      };
      marker2.addEventListener('click', onMarkerClickedListener);
      previousMarker.listeners.push(onMarkerClickedListener);

      if (!marker.title && !marker.content) {
        return;
      }
      let msg = `<p>${marker.title || ''}</p><p>${marker.content || ''}</p>`;
      let infoWindow2 = new BMap.InfoWindow(msg, {
        enableMessage: !!marker.enableMessage
      });
      if (marker.autoDisplayInfoWindow) {
        marker2.openInfoWindow(infoWindow2);
      }
      /*
      let openInfoWindowListener = function () {
        this.openInfoWindow(infoWindow2);
      };
      previousMarker.listeners.push(openInfoWindowListener);
      marker2.addEventListener('click', openInfoWindowListener);
      */
    });

    this._redrawLabels();

    function createMarker (marker: MarkerOptions, pt: any) {
      var BMap: any = (<any>window)['BMap'];
      if (marker.icon) {
        var icon = new BMap.Icon(marker.icon, new BMap.Size(marker.width, marker.height));
        return new BMap.Marker(pt, { icon: icon });
      }
      return new BMap.Marker(pt);
    };
  }

  // redraw labels
  private _redrawLabels() {
    let _self = this;

    this._previousLabels.forEach(label => {
        this.map.removeOverlay(label);
    });

    this._previousLabels.splice(0);

    if (!this.options.markers) {
      return;
    }

    this.options.markers.forEach((marker: MarkerOptions) => {
      let opt: LabelOptions = {
        content: marker.title,
        position: {lat: marker.latitude, lng: marker.longitude},
        offset: {
          width: -getTextWidth(marker.title) / 2 - 8,
          height: -45
        }
      };
      let myLabel = createLabel(opt);
      myLabel.setStyle({
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: '5px 8px',
        border: 'none',
        fontSize: '13px'
      });

      // add marker to the map
      _self.map.addOverlay(myLabel);
      this._previousLabels.push(myLabel);

      if (!marker.title && !marker.content) {
        return;
      }
    });

    function createLabel (label: LabelOptions) {
      var BMap: any = (<any>window)['BMap'];
      return new BMap.Label(label.content, label);
    };

    function getTextWidth(text) {
      const font = 'normal 13px arial';
      // re-use canvas object for better performance
      var canvas = getTextWidth['canvas'] || (getTextWidth['canvas'] = document.createElement("canvas"));
      var context = canvas.getContext("2d");
      context.font = font;
      var metrics = context.measureText(text);
      return metrics.width;
    }
  }

  ngOnChanges() {}

  // draw map
  _draw() {
    let self = this;
    setTimeout(() => {
      BaiduMap.prototype._draw.bind(self).apply(self);
      self.onOptionsChange(self.options);
    }, 1000);
  }
}

export * from 'angular2-baidu-map';

export interface MapEvent{
  point: MapPoint,
  offsetX: number,
  offsetY: number,
  pixel: { x: number, y: number },
  target: any
}

export interface MapPoint{
  lat: number,
  lng: number
}

export interface PreviousMarker {
  marker: any;
  listeners: Function[];
}

export interface MarkerOptions {
  longitude: number;
  latitude: number;
  icon?: string;
  width?: number;
  height?: number;
  title?: string;
  content?: string;
  enableMessage?: boolean;
  description?: string;
  autoDisplayInfoWindow?: boolean;
  diseaseNo?: string;
}

export interface MapSize {
  width: number,
  height: number
}

export interface LabelOptions{
  offset?: MapSize,
  position: MapPoint,
  content: string
}