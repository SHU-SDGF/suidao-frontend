import {Injectable} from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {Transfer, FileUploadOptions, File, FileUploadResult, FileEntry, FileError} from 'ionic-native';
import {HttpService} from './http_service';
import { AppConfig } from './config';

declare const cordova;
declare const device;

const UPLOAD_PATH = AppConfig.apiBase + '/upload';
const DOWNLOAD_PATH = AppConfig.siteBase + '/file';

@Injectable()
export class FileService {

  constructor(public http: Http){}

  private get rootDir() {
    return this.getRootFolder(device.platform);
  }
  
  /**
   * download file
   * @param {string} id
   * @param {function} progressListener
   */
  public downloadFile(fileUri:string, progressListener) {
    const fileTransfer = new Transfer();
    let _self = this;
    let source = `${DOWNLOAD_PATH}${fileUri}`;
    let suffix = fileUri.substr(fileUri.lastIndexOf('.'));
    let targetPath = `${this.rootDir}${this.generateFileNameHash() + suffix}`;
    let options = {
      headers: {
        "Authorization": localStorage.getItem("authToken")
      }
    };

    if (progressListener) {
      fileTransfer.onProgress(progressListener);
    }

    return new Promise<string>((resolve, reject)=>{
      _self.getLocalFile(fileUri).then((localUri)=>{
        if(localUri){
          resolve(localUri);
        }else{
          fileTransfer.download(source, targetPath, true, options).then((fe: FileEntry)=>{
            _self.storeFileMapper(fileUri, fe.nativeURL);
            resolve(fe.nativeURL);
          }, (err)=>{
            reject(err);
          });
        }
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
        resolve([this.rootDir, newName].join(''));
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


  public doesFileExist(urlToFile: string): Promise<boolean> {
    /*
    let dirPath = urlToFile.substr(0, urlToFile.lastIndexOf('/'));
    let fileName = urlToFile.substr(urlToFile.lastIndexOf('/') + 1);
    return File.checkFile(dirPath, fileName);
    */
    let _self = this;
    return new Promise((resolve, reject)=>{
      _self.http.head(urlToFile).subscribe((response)=>{
        if(response.ok){
          resolve(true);
        }else{
          reject(response);
        }
      }, (err)=>{
        reject(err);
      });
    });
  }

  public deleteFileMapper(fileUri){
    localStorage.removeItem(`fileMapper${fileUri}`);
  }

  public storeFileMapper(fileUri, localUri) {
    localStorage.setItem(`fileMapper${fileUri}`,JSON.stringify(localUri));
  }

  public getLocalFile(fileUri): Promise<string>{
    let _self = this;
    return new Promise((resolve, reject)=>{
      let path = JSON.parse(localStorage.getItem(`fileMapper${fileUri}`));
      if (!path) {
        resolve(null);
      } else {
        _self.doesFileExist(path).then((existing)=>{
          resolve(path);
        }, (err)=>{
          localStorage.removeItem(`fileMapper${fileUri}`);
          resolve(null);
        });
      }
    });
  }

  public getFilePath(fileUri): Promise<string> {
    return new Promise((resolve, reject)=>{
      let path = JSON.parse(localStorage.getItem(`fileMapper${fileUri}`));
      if (!path) {
        resolve(AppConfig.siteBase + '/file' + fileUri);
      }else{
        this.doesFileExist(path).then((existing)=>{
          resolve(path);
        }, (err)=>{
          localStorage.removeItem(`fileMapper${fileUri}`);
          resolve(AppConfig.siteBase + '/file' + fileUri);
        });
      }
    });
  }
}