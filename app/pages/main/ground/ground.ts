import {Component, OnInit} from '@angular/core';
import {BaiduMap, OfflineOptions, ControlAnchor, NavigationControlType} from 'angular2-baidu-map';

@Component({
    selector: 'map-presentation',
    templateUrl: './build/pages/main/ground/ground.html',
    directives: [BaiduMap]
})
export class GroundPage implements OnInit {

    opts: any;
    offlineOpts: OfflineOptions;

    ngOnInit() {
        this.opts = {
            center: {
                longitude: 121.506191,
                latitude: 31.245554
            },
            zoom: 17,
            markers: [{
                longitude: 121.506191,
                latitude: 31.245554,
                title: 'Where',
                content: 'Put description here',
                autoDisplayInfoWindow: true
            }],
            geolocationCtrl: {
                anchor: ControlAnchor.BMAP_ANCHOR_BOTTOM_RIGHT
            },
            scaleCtrl: {
                anchor: ControlAnchor.BMAP_ANCHOR_BOTTOM_LEFT
            },
            overviewCtrl: {
                isOpen: true
            },
            navCtrl: {
                type: NavigationControlType.BMAP_NAVIGATION_CONTROL_LARGE
            }
        };

        this.offlineOpts = {
            retryInterval: 5000,
            txt: 'NO-NETWORK'
        };
    }

    loadMap(e: any) {
        console.log(e);//e here is the instance of BMap.Map
    }

    clickMarker(marker: any){
        console.log('The clicked marker is', marker);
    }

}