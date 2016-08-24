import {Input, Output, EventEmitter, ElementRef, OnInit, Component, ChangeDetectionStrategy, SimpleChange, OnChanges} from '@angular/core';
import {BaiduMap, OfflineOptions, ControlAnchor, MapOptions, MapStatus} from 'angular2-baidu-map';

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

  constructor(private _el: ElementRef) {
    super(_el);
  }

  ngOnInit() {
    super.ngOnInit();
    let _self = this;

    _self.onMapLoaded.subscribe(event => {

      // bind click event    
      window['map'] = _self.map;
      _self.map.addEventListener('click', ($event: MapClickEvent) => {
        _self.onMapClick.emit($event);
      });

      // bind options change
      if (_self.changeOptions) {
        _self.changeOptions.subscribe((options: MapOptions) => {
          /*
          _self.ngOnChanges({
            "options": new SimpleChange(_self.options, _self.options)
          });
          */
          let previousCenter = _self.options.center;
          Object.assign(_self.options, options);

          _self._changeCenter({
            lat: _self.options.center.latitude,
            lng: _self.options.center.longitude
          });

          _self._redrawMarkers();

        });
      }
    });
  }

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
  
  public addMarker(marker: MarkerOptions): MarkerOptions {
    let markers = this.options.markers.concat([]);
    markers.push(marker);
    this.options.markers = markers;
    this._redrawMarkers();
    return marker;
  }

  public removeMarker(marker): MarkerOptions {
    let markers = this.options.markers.concat([]);
    let i = markers.indexOf(marker);
    markers.splice(i, 1);
    this.options.markers = markers;
    this._redrawMarkers();
    return marker
  }
  
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
        _self.onMarkerClicked.emit(marker2);
        event.stopPropagation();
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
      let openInfoWindowListener = function () {
        this.openInfoWindow(infoWindow2);
      };
      previousMarker.listeners.push(openInfoWindowListener);
      marker2.addEventListener('click', openInfoWindowListener);
    });

    function createMarker (marker: MarkerOptions, pt: any) {
      var BMap: any = (<any>window)['BMap'];
      if (marker.icon) {
        var icon = new BMap.Icon(marker.icon, new BMap.Size(marker.width, marker.height));
        return new BMap.Marker(pt, { icon: icon });
      }
      return new BMap.Marker(pt);
    };
  }

  _draw() {
    let self = this;
    setTimeout(() => {
      BaiduMap.prototype._draw.bind(self).apply(self);
    }, 1000);
  }
}

export * from 'angular2-baidu-map';

export interface MapClickEvent{
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
    longitude: number,
    latitude: number,
    icon?: string,
    width?: number,
    height?: number,
    title?: string,
    content?: string,
    enableMessage?: boolean,
    autoDisplayInfoWindow?: boolean
}
