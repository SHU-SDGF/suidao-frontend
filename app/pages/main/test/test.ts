import {Component, OnInit} from '@angular/core';

declare const navigator;
declare const tracking;
declare const MediaStreamTrack;

@Component({
    template: `

        <ion-header no-shadow #header>
            <ion-title center [hidden]="!onGround">
                摄像头测试
            </ion-title>
        </ion-header>
        <ion-content>
            <div style="position: absolute; top: 0px; width: 100%; height:30px;">
                <div class="select">
                    <label for="audioSource">Audio source: </label><select id="audioSource"></select>
                </div>
                <div class="select">
                    <label for="videoSource">Video source: </label><select id="videoSource"></select>
                </div>
            </div>
            <video muted="" autoplay="" id="video" style="position:absolute; top: -2000px;"></video>
            <canvas id="canvas" [attr.width]="windowWidth" [attr.height]="windowHeight"></canvas>
        </ion-content>
    `
})
export class TestPage implements OnInit {

    windowHeight = 350;
    windowWidth = 350;

    ngOnInit() {
        var videoElement = document.querySelector('video');
        var audioSelect = document.querySelector('select#audioSource');
        var videoSelect = document.querySelector('select#videoSource');
        var cameras = [];

        navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        function gotSources(sourceInfos) {
            for (var i = 0; i !== sourceInfos.length; ++i) {
                var sourceInfo = sourceInfos[i];
                var option = document.createElement('option');
                option.value = sourceInfo.id;
                if (sourceInfo.kind === 'audio') {
                    option.text = sourceInfo.label || 'microphone ' +
                        (audioSelect['length'] + 1);
                    audioSelect.appendChild(option);
                } else if (sourceInfo.kind === 'video') {
                    option.text = sourceInfo.label || 'camera ' + (videoSelect['length'] + 1);
                    cameras.push(option.value);
                    videoSelect.appendChild(option);
                } else {
                    console.log('Some other kind of source: ', sourceInfo);
                }
            }
        }

        if (typeof MediaStreamTrack === 'undefined' ||
            typeof MediaStreamTrack['getSources'] === 'undefined') {
            alert('This browser does not support MediaStreamTrack.\n\nTry Chrome.');
        } else {
            MediaStreamTrack['getSources'](gotSources);
        }

        function successCallback(stream) {
            window['stream'] = stream; // make stream available to console
            videoElement['src'] = window.URL.createObjectURL(stream);
            videoElement['play']();
        }

        function errorCallback(error) {
        console.log('navigator.getUserMedia error: ', error);
        }

        function start() {
            if (window['stream']) {
                videoElement['src'] = null;
                window['stream'].stop();
            }
            var audioSource = audioSelect['value'];
            var videoSource = videoSelect['value'];
            var constraints = {
                audio: {
                optional: [{
                    sourceId: audioSource
                }]
                },
                video: {
                    optional: [{
                        sourceId: cameras[1]
                    }]
                }
            };
            navigator.getUserMedia(constraints, successCallback, errorCallback);
            setTimeout(()=> {
                this.windowWidth = document.querySelector('#video')['offsetWidth'];
                this.windowHeight = document.querySelector('#video')['offsetHeight'];
            }, 2000);
        }

        audioSelect['onchange'] = start;
        videoSelect['onchange'] = start;

        // start();
        this.track();
    }

    track() {
        var canvas = document.getElementById('canvas');
        var context = canvas['getContext']('2d');
        var FastTracker = function() {
            FastTracker['base'](this, 'constructor');
        };
        tracking.inherits(FastTracker, tracking.Tracker);
        tracking.Fast.THRESHOLD = 2;
        FastTracker.prototype.threshold = tracking.Fast.THRESHOLD;
        FastTracker.prototype.track = function(pixels, width, height) {
        var gray = tracking.Image.grayscale(pixels, width, height);
        var corners = tracking.Fast.findCorners(gray, width, height);
        this.emit('track', {
            data: corners
        });
        };
        var tracker = new FastTracker();
        tracker.on('track', function(event) {
            context.clearRect(0, 0, canvas['width'], canvas['height']);
            var corners = event.data;
            for (var i = 0; i < corners.length; i += 2) {
                context.fillStyle = '#000';
                context.fillRect(corners[i], corners[i + 1], 2, 2);
            }
        });
        tracking.track('#video', tracker);
    }
}