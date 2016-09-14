import { Injectable, Pipe } from '@angular/core';
import { Http, Headers } from '@angular/http';
import {Observable, Subscriber} from 'rxjs';
import {MediaContent} from '../models/MediaContent';
import {FileService} from './file_service';
import {AppUtils} from '../shared/utils';

@Pipe({
  name: 'FilePathPipe'
})
export class FilePathPipe{
  constructor(private _mediaService: MediaService){}
  transform(media: MediaContent, args?) {
    return this._mediaService.getMediaPath(media);
  }
}

@Injectable()
export class MediaService {

  constructor(
    private fileService: FileService
  ) { }

  getMediaPath(media: MediaContent) {
    return media.localUri || this.fileService.getFilePath(media.fileUri);
  }
  
  uploadFiles(medias: Array<MediaContent>){
    let task = new UploadTask(this.fileService);
    task.files = medias;

    return task;
  }

  downloadFiles(medias: Array<MediaContent>){

  }

}

export interface UploadTaskProgress{
  loaded: number, 
  total: number, 
  fileIndex: number, 
  totalFiles: number
};

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

    this._progressObserver.next(this._progress);
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
  
  start(): Observable<MediaContent> {
    return Observable.create(function(observer: Subscriber<MediaContent>){
      let index = 0;
      if (!this.fileList.length){
        observer.next();
        observer.complete();
        return;
      } 

      this.filesInProcess = this.fileList.concat([]);
      let funcs = [];
      this.fileList.forEach((mediaFile) => {
        let func = function () {
          return new Promise(function(resolve, reject){
            this.startUploadMedia(mediaFile).then((mediaFile: MediaContent) => {
              this.fileService.storeFile(mediaFile.fileUri, mediaFile.localUri);
              observer.next(mediaFile);
              resolve(mediaFile);
            }, ()=>{
              reject(mediaFile);
            });
          }.bind(this));
        }.bind(this);
        funcs.push(func);
      });

      AppUtils.chain(funcs).then(function(){
        this.started = false;
        this.finished = true;
      }.bind(this));
    }.bind(this));
  }

  startUploadMedia(mediaFile: MediaContent) {
    return new Promise<MediaContent>(function(fileResolve, fileReject){
      this.uploadMedia(mediaFile).then((result) => {
        let r: {success: boolean, path: string} = JSON.parse(result.response);
        if (r.success) {
          mediaFile.fileUri = r.path;
          this.successList.unshift(mediaFile);
          this.filesInProcess.shift();
          fileResolve(mediaFile);
        } else {
          fileReject(r);
        }
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
  
}