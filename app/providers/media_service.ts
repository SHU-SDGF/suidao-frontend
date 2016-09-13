import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import {Observable, Subscriber} from 'rxjs';
import {MediaContent} from '../models/MediaContent';
import {FileService} from './file_service';
import {AppUtils} from '../shared/utils';

@Injectable()
export class MediaService {

  constructor(
    private fileService: FileService
  ) { }
  
  uploadFiles(medias: Array<MediaContent>){
    let task = new UploadTask(this.fileService);
    task.files = medias;

    return task;
  }

  downloadFiles(medias: Array<MediaContent>){

  }

}

export class UploadTask{
  private _started: boolean = false;
  private _finished: boolean = false;
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

  set files(files: Array<MediaContent>){
    this.fileList = files;
  }

  get files(){
    return this.fileList;
  }

  get failedFiles(){
    return this.failedList;
  }

  get successFiles(){
    return this.successList;
  }
  
  start() {
    return Observable.create(function(observer: Subscriber<MediaContent>){
      let index = 0;
      if (!this.fileList.length) return;

      this.filesInProcess = this.fileList.concat([]);
      let funcs = [];
      this.fileList.forEach((mediaFile) => {
        let func = (function () {
          return function (resolve: ()=>void) {
            startUploadMedia(mediaFile, resolve).then((mediaFile)=>{
              observer.next(mediaFile);
            });
          }.bind(this);
        })();
        funcs.push(func);
      });

      AppUtils.chain(funcs).then(function(){
        this.started = false;
        this.finished = true;
      }.bind(this));
    }.bind(this));
    
    function startUploadMedia(mediaFile, resolve: ()=>void) {
      return new Promise<MediaContent>(function(fileResolve, fileReject){
        this.uploadMedia(mediaFile).then((result) => {
          let r = JSON.parse(result.response);
          this.successList.unshift(mediaFile);
          this.filesInProcess.shift();
          resolve();
          fileResolve(mediaFile);
        }, (error) => {
          mediaFile['error'] = error;
          this.filesInProcess.shift();
          this.failedList.unshift(mediaFile);
          resolve();
          fileReject(mediaFile);
        });
      }.bind(this));
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
  
  setFiles(files: Array<MediaContent>){
    this.fileList = files;
  }

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