import {Component, OnInit} from '@angular/core';
import {BaiduMap, ControlAnchor, NavigationControlType} from 'angular2-baidu-map';

@Component({
    selector: 'map-presentation',
    styles: [
        `
        baidu-map{
            width: 100%;
            height: 100%;
            display: block;
        }
        `,
        `
        button{
            position: absolute;
            top: 0px;
            left: 0px;
        }
        `
    ],
    template: `
        <baidu-map ak="zgxxc54yRqlHYbh41UQSen3caLggkHys" [options]="opts"></baidu-map>
        <button (click)="updateCoordinate($event)">Update Coordinate<button>
    `,
    directives: [BaiduMap]
})
export class TestPage implements OnInit {

    opts: any;

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
                content: 'Put description here'
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
    }

    /**
     * the map will be pointed to
     * new coordinate once click
     * the button
     */
    updateCoordinate(e: MouseEvent){
        this.opts = {
            center: {
                longitude: 121.500885,
                latitude: 31.190032
            }
        };
    }
}