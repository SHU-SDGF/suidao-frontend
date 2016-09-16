import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Transfer, FileUploadOptions, File, FileUploadResult, FileEntry} from 'ionic-native';
import {HttpService} from './http_service';
import { AppConfig } from './config';

declare const cordova;
declare const device;

const UPLOAD_PATH = AppConfig.apiBase + '/upload';
const DOWNLOAD_PATH = AppConfig.apiBase + '/download';

@Injectable()
export class FileService {
  private get rootDir() {
    return this.getRootFolder(device.platform);
  }
  
  /**
   * download file
   * @param {string} id
   * @param {function} progressListener
   */
  public downloadFile(fileUri, progressListener) {
    const fileTransfer = new Transfer();
    let _self = this;
    let source = `${DOWNLOAD_PATH}/${fileUri}`;
    let targetPath = `${this.rootDir}/${this.generateFileNameHash()}`;
    let options = {
      headers: {
        "Authorization": localStorage.getItem("authToken")
      }
    };

    if (progressListener) {
      fileTransfer.onProgress(progressListener);
    }

    return new Promise<string>((resolve, reject)=>{
      if(_self.doesFileExist(`fileMapper${fileUri}`)){
        resolve(_self.getFilePath(fileUri));
        return;
      }
      fileTransfer.download(source, targetPath, true, options).then((fe: FileEntry)=>{
        _self.storeFileMapper(fileUri, fe.fullPath);
        resolve(fe.fullPath);
      }, (err)=>{
        reject(err);
      });
    });
  }

  public deleteFile(filePath: string){
    let dirPath = filePath.substr(0, filePath.lastIndexOf('/'));
    let fileName = filePath.substr(filePath.lastIndexOf('/') + 1);
    return File.removeFile(dirPath, fileName);
  }

  public copyFile(filePath: string){
    return new Promise((resolve, reject)=>{
      let fileName = filePath.substr(filePath.lastIndexOf('/') + 1);
      let suffix = fileName.substr(fileName.lastIndexOf('.') + 1);
      let newName = [this.generateFileNameHash(), suffix].join('.');
      let dirPath = filePath.substr(0, filePath.lastIndexOf('/'));

      if(device.platform == 'iOS'){
        dirPath = 'file://' + dirPath;
      }

      File.moveFile(dirPath, fileName, this.rootDir, newName).then(()=>{
        resolve([this.rootDir, newName].join('/'));
      }, reject);
    });
  }

  /**
   * upload file
   * @param {string} filePath
   * @param {function} progressListener
   */  
  public uploadFile(localUri: string, progressListener) {
    const fileTransfer = new Transfer();
    let _self = this;
    let options: FileUploadOptions = {
      headers: {
        "Authorization": localStorage.getItem("authToken")
      },
      fileName: localUri.substr(localUri.lastIndexOf('/')+ 1)
    };

    if (progressListener) {
      fileTransfer.onProgress(progressListener);
    }

    return new Promise<string>((resolve, reject)=>{
      fileTransfer.upload(localUri, UPLOAD_PATH, options, true).then((fur: FileUploadResult)=>{
        let r: {success: boolean, path: string} = JSON.parse(fur.response);
        if(r.success){
          _self.storeFileMapper(r.path, localUri);
          resolve(r.path);
        }else{
          reject(r);
        }
      }, (err)=>{
        reject(err);
      });
    });
  }

  /*
  * General purpose, even if for now only Android and Iphone are supported.
  */
  private getRootFolder(deviceType:string):string {
    let returnValue:string;
    let deviceTypeStr:string = deviceType;

    if (deviceTypeStr.startsWith("BlackBerry")) deviceTypeStr = "BlackBerry";

    switch (deviceTypeStr){
      case "iOS":
        returnValue = cordova.file.documentsDirectory;
        break;
      case "Mac OS X":
        returnValue = cordova.file.applicationStorageDirectory;
        break;
      default:
        returnValue = cordova.file.dataDirectory;
    }

    return returnValue;
  }

  generateFileNameHash() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }


  public doesFileExist(urlToFile) {
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', urlToFile, false);
    xhr.send();
     
    if (xhr.status == 404) {
        return false;
    } else {
        return true;
    }
  }

  public deleteFileMapper(fileUri){
    localStorage.removeItem(`fileMapper${fileUri}`);
  }

  public storeFileMapper(fileUri, localUri) {
    localStorage.setItem(`fileMapper${fileUri}`, localUri);
  }

  public getFilePath(fileUri) {
    let path = localStorage.getItem(`fileMapper${fileUri}`);
    if (!path) {
      return AppConfig.siteBase + '/file' + fileUri;
    } else if (!this.doesFileExist(path)) {
      localStorage.removeItem(`fileMapper${fileUri}`);
      return AppConfig.siteBase + '/file' + fileUri;
    } else {
      return path;
    }
  }
}