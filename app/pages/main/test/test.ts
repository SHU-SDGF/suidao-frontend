import {Component, OnInit} from '@angular/core';

declare const navigator;
declare const tracking;

@Component({
    template: `
        <script src="https://trackingjs.com/bower/tracking.js/build/tracking-min.js"></script>
        <script src="https://trackingjs.com/bower/tracking.js/examples/assets/stats.min.js"></script>

        <ion-header no-shadow #header>
            <ion-title center [hidden]="!onGround">
                摄像头测试
            </ion-title>
        </ion-header>
        <ion-content>
            <div class="select">
                <label for="audioSource">Audio source: </label><select id="audioSource"></select>
            </div>
            <div class="select">
                <label for="videoSource">Video source: </label><select id="videoSource"></select>
            </div>
            <video muted="" autoplay=""></video>
        </ion-content>
    `
})
export class TestPage implements OnInit {

    ngOnInit() {
        var videoElement = document.querySelector('video');
        var audioSelect = document.querySelector('select#audioSource');
        var videoSelect = document.querySelector('select#videoSource');

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
            videoElement.src = window.URL.createObjectURL(stream);
            videoElement.play();
        }

        function errorCallback(error) {
        console.log('navigator.getUserMedia error: ', error);
        }

        function start() {
        if (window['stream']) {
            videoElement.src = null;
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
                sourceId: videoSource
            }]
            }
        };
        navigator.getUserMedia(constraints, successCallback, errorCallback);
        }

        audioSelect['onchange'] = start;
        videoSelect['onchange'] = start;

        start();
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
        stats.begin();
        var gray = tracking.Image.grayscale(pixels, width, height);
        var corners = tracking.Fast.findCorners(gray, width, height);
        stats.end();
        this.emit('track', {
            data: corners
        });
        };
        var tracker = new FastTracker();
        tracker.on('track', function(event) {
        context.clearRect(0, 0, canvas['width'], canvas['height']);
        var corners = event.data;
        for (var i = 0; i < corners.length; i += 2) {
            context.fillStyle = '#f00';
            context.fillRect(corners[i], corners[i + 1], 2, 2);
        }
        });
        tracking.track('#video', tracker, { camera: true });
    }
}