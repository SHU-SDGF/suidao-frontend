import { Injectable, Pipe , NgZone} from '@angular/core';
import { Http, Headers } from '@angular/http';
import {Observable, Subscriber} from 'rxjs';
import {MediaContent} from '../models/MediaContent';
import {FileService} from './file_service';
import {AppUtils} from '../shared/utils';
import {FileUploadResult} from 'ionic-native';

@Injectable()
export class MediaService {

  constructor(
    private fileService: FileService,
    private _zone: NgZone
  ) { }

  getMediaPath(media: MediaContent): Promise<string> {
    let _self = this;
    return new Promise((resolve, reject)=>{
      if(media.localUri){
        resolve(media.localUri);
        return;
      }
      _self.fileService.getFilePath(media.fileUri).then((path)=>{
        resolve(path);
      }, reject);
    });
  }
  
  uploadFiles(medias: Array<MediaContent>){
    let task = new UploadTask(this.fileService, this._zone);
    task.files = medias;

    return task;
  }

  removeMedia(media: MediaContent){
    this.fileService.deleteFile(media.localUri).then(()=>{

    }, (err)=>{
      console.log(err);
    });
    if(media.fileUri){
      this.fileService.deleteFileMapper(media.fileUri);
    }
  }

  downloadFiles(medias: Array<MediaContent>){
    let task = new DownloadTask(this.fileService, this._zone);
    task.files = medias;

    return task;
  }

}

export interface UploadTaskProgress{
  loaded: number, 
  total: number, 
  fileIndex: number, 
  totalFiles: number
};

export interface DownloadTaskProgress {
  loaded: number,
  total: number,
  fileIndex: number,
  totalFiles: number
}

export class UploadTask{
  private _started: boolean = false;
  private _finished: boolean = false;
  private fileList: Array<MediaContent> = [];
  private successList: Array<MediaContent> = [];
  private failedList: Array<MediaContent> = [];
  private filesInProcess: Array<MediaContent> = [];
  private _progress: UploadTaskProgress  = { loaded: 0, total: 0, fileIndex: 0, totalFiles: 0 };
  private _progressObserver: Subscriber<UploadTaskProgress>;
  public $progress = new Observable((subscriber: Subscriber<UploadTaskProgress>)=>{
    this._progressObserver = subscriber;
  });

  private _progressListener = ($event) => {
    Object.assign(this._progress, {
      loaded: $event.loaded,
      total: $event.total,
      fileIndex: this.fileList.length - this.filesInProcess.length,
      totalFiles: this.fileList.length
    });
    this._zone.run(()=>{
      this._progressObserver.next(this._progress);
    });
  };

  constructor(
    private fileService: FileService,
    private _zone: NgZone
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

  get finished(){
    return this._finished;
  }
  
  start(continueWithError: boolean = false): Observable<MediaContent> {
    let _self = this;
    return Observable.create(function(observer: Subscriber<MediaContent>){
      let index = 0;
      if (!_self.fileList.length){
        observer.next();
        observer.complete();
        return;
      } 

      _self.filesInProcess = _self.fileList.concat([]);
      let funcs = [];
      _self.fileList.forEach((mediaFile) => {
        let func = (function(mediaFile){
          return function () {
            return new Promise(function(resolve, reject){
              _self.startUploadMedia(mediaFile).then((mediaFile: MediaContent) => {
                observer.next(mediaFile);
                resolve(mediaFile);
              }, ()=>{
                reject(mediaFile);
              });
            });
          };
        })(mediaFile);

        funcs.push(func);
      });

      AppUtils.chain(funcs, continueWithError).then(function(){
        _self._started = false;
        _self._finished = true;
      }, (err)=>{
        observer.error(err);
      });
    });
  }

  startUploadMedia(mediaFile: MediaContent) {
    return new Promise<MediaContent>(function(fileResolve, fileReject){
      this.uploadMedia(mediaFile).then((path) => {
        mediaFile.fileUri = path;
        this.successList.unshift(mediaFile);
        this.filesInProcess.shift();
        fileResolve(mediaFile);
      }, (error) => {
        mediaFile['error'] = error;
        this.filesInProcess.shift();
        this.failedList.unshift(mediaFile);
        fileReject(mediaFile);
      });
    }.bind(this));
  }

  uploadMedia(media: MediaContent) {
    return this.fileService.uploadFile(media.localUri, this._progressListener);
  }
}

export class DownloadTask{
  private _started: boolean = false;
  private _finished: boolean = false;
  private fileList: Array<MediaContent> = [];
  private successList: Array<MediaContent> = [];
  private failedList: Array<MediaContent> = [];
  private filesInProcess: Array<MediaContent> = [];
  private _progress: UploadTaskProgress  = { loaded: 0, total: 0, fileIndex: 0, totalFiles: 0 };
  private _progressObserver: Subscriber<UploadTaskProgress>;
  public $progress = new Observable((subscriber: Subscriber<UploadTaskProgress>)=>{
    this._progressObserver = subscriber;
  });

  private get finished(){
    return this._finished;
  }

  private _progressListener = ($event) => {
    Object.assign(this._progress, {
      loaded: $event.loaded,
      total: $event.total,
      fileIndex: this.fileList.length - this.filesInProcess.length,
      totalFiles: this.fileList.length
    });
    this._zone.run(()=>{
      this._progressObserver.next(this._progress);
    });
  };

  constructor(
    private fileService: FileService,
    private _zone: NgZone
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
  
  start(): Observable<MediaContent> {
    let _self = this;
    return Observable.create(function(observer: Subscriber<MediaContent>){
      let index = 0;
      if (!_self.fileList.length){
        observer.next();
        observer.complete();
        return;
      } 

      _self.filesInProcess = _self.fileList.concat([]);
      let funcs = [];
      _self.fileList.forEach((mediaFile) => {
        let func = (function(mediaFile){
          return function () {
            return new Promise(function(resolve, reject){
              _self.startDownloadMedia(mediaFile).then((mediaFile: MediaContent) => {
                observer.next(mediaFile);
                resolve(mediaFile);
              }, ()=>{
                reject(mediaFile);
              });
            });
          };
        })(mediaFile);

        funcs.push(func);
      });

      AppUtils.chain(funcs).then(function(){
        _self._started = false;
        _self._finished = true;
      }, (err)=>{
        observer.error(err);
      });
    });
  }

  startDownloadMedia(mediaFile: MediaContent) {
    let _self = this;
    return new Promise<MediaContent>(function(fileResolve, fileReject){
      _self.downloadMedia(mediaFile).then((path) => {
        mediaFile.localUri = path;
        _self.successList.unshift(mediaFile);
        _self.filesInProcess.shift();
        fileResolve(mediaFile);
      }, (error) => {
        mediaFile['error'] = error;
        _self.filesInProcess.shift();
        _self.failedList.unshift(mediaFile);
        fileReject(mediaFile);
      });
    });
  }

  downloadMedia(media: MediaContent) {
    return this.fileService.downloadFile(media.fileUri, this._progressListener);
  }
}