import {Component, OnInit} from '@angular/core';

declare const navigator;

@Component({
    template: `
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
}