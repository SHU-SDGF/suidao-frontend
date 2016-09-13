import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import {Observable} from 'rxjs';
import {MediaContent} from '../models/MediaContent';
import {FileService} from './file_service';
import {AppUtils} from '../shared/utils';

@Injectable()
export class MediaService {

  constructor(
    private fileService: FileService
  ) { }
  
  uploadFiles(){
    let task = new UploadTask(this.fileService);
    task.start();
    return task;
  }

  downloadFiles(){

  }

}

export class UploadTask{
  private started: boolean = false;
  private finished: boolean = false;
  private fileList: Array<MediaContent> = [];
  private successList: Array<MediaContent> = [];
  private failedList: Array<MediaContent> = [];
  private filesInProcess: Array<MediaContent> = [];
  private progressListener = function ($event) {
    console.log($event);
  };

  constructor(
    private fileService: FileService
  ) { }
  
  start() {
    let index = 0;
    if (!this.fileList.length) return;

    this.filesInProcess = this.fileList.concat([]);
    
    let funcs = [];
    this.fileList.forEach((mediaFile) => {
      let func = (function () {
        return function (resolve: ()=>void) {
          startUploadMedia(mediaFile, resolve);
        }.bind(this);
      })();
      funcs.push(func);
    });

    AppUtils.chain(funcs).then(() => {
      this.started = false;
      this.finished = true;
    });
    
    function startUploadMedia(mediaFile, resolve: ()=>void) {
      this.uploadMedia(mediaFile).then((result) => {
        let r = JSON.parse(result.response);
        this.successList.unshift(mediaFile);
        this.filesInProcess.shift();
        resolve();
      }, (error) => {
        mediaFile['error'] = error;
        this.filesInProcess.shift();
        this.failedList.unshift(mediaFile);
        resolve();
      });
    }
  }

  uploadMedia(media: MediaContent) {
    return this.fileService.uploadFile(media.fileUri, this.progressListener);
  }
}


export class DownloadTask{
  private started: boolean = false;
  private finished: boolean = false;
  private fileList: Array<MediaContent> = [];
  private successList: Array<MediaContent> = [];
  private failedList: Array<MediaContent> = [];
  private filesInProcess: Array<MediaContent> = [];
  private progressListener = function ($event) {
    console.log($event);
  };

  constructor(
    private fileService: FileService
  ) { }
  
  start() {
    let index = 0;
    if (!this.fileList.length) return;

    this.filesInProcess = this.fileList.concat([]);
    
    let funcs = [];
    this.fileList.forEach((mediaFile) => {
      let func = (function () {
        return function (resolve: ()=>void) {
          startUploadMedia(mediaFile, resolve);
        }.bind(this);
      })();
      funcs.push(func);
    });

    AppUtils.chain(funcs).then(() => {
      this.started = false;
      this.finished = true;
    });
    
    function startUploadMedia(mediaFile, resolve: ()=>void) {
      this.uploadMedia(mediaFile).then((result) => {
        let r = JSON.parse(result.response);
        this.successList.unshift(mediaFile);
        this.filesInProcess.shift();
        resolve();
      }, (error) => {
        mediaFile['error'] = error;
        this.filesInProcess.shift();
        this.failedList.unshift(mediaFile);
        resolve();
      });
    }
  }

  uploadMedia(media: MediaContent) {
    return this.fileService.uploadFile(media.fileUri, this.progressListener);
  }
}