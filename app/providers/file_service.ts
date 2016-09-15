import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Transfer, FileUploadOptions, File} from 'ionic-native';
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
  public downloadFile(id, progressListener) {
    const fileTransfer = new Transfer();
    let source = `${DOWNLOAD_PATH}/${id}`;
    let targetPath = `${this.rootDir}/${this.generateFileNameHash()}`;
    let options = {
      headers: {
        "Authorization": localStorage.getItem("authToken")
      }
    };

    if (progressListener) {
      fileTransfer.onProgress(progressListener);
    }

    return fileTransfer.download(source, targetPath, true, options);
  }

  public copyFile(filePath: string){
    alert(`file path: ${filePath}`);
    return new Promise((resolve, reject)=>{
      let fileName = filePath.substr(filePath.lastIndexOf('/') + 1);
      let suffix = fileName.substr(fileName.lastIndexOf('.') + 1);
      let newName = [this.generateFileNameHash(), suffix].join('.');
      let dirPath = filePath.substr(0, filePath.lastIndexOf('/'));

      if(device.platform == 'iOS'){
        dirPath = 'file://' + dirPath;
      }

      alert(`targetDir:${dirPath}`);
      alert(`root:${this.rootDir}`);

      File.moveFile(dirPath, fileName, this.rootDir, newName).then(()=>{
        alert('success!');
        resolve([this.rootDir, fileName].join('/'));
      }, reject);
    });
  }

  /**
   * upload file
   * @param {string} filePath
   * @param {function} progressListener
   */  
  public uploadFile(filePath: string, progressListener) {
    
    const fileTransfer = new Transfer();
    let options: FileUploadOptions = {
      headers: {
        "Authorization": localStorage.getItem("authToken")
      },
      fileName: filePath.substr(filePath.lastIndexOf('/')+ 1)
    };

    if (progressListener) {
      fileTransfer.onProgress(progressListener);
    }

    return fileTransfer.upload(filePath, UPLOAD_PATH, options, true);
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


  public storeFile(fileUri, localUri) {
    localStorage.setItem(`media${fileUri}`, localUri);
  }

  public getFilePath(fileUri) {
    let path = localStorage.getItem(`media${fileUri}`);
    if (!path) {
      return AppConfig.siteBase + '/file' + fileUri;
    } else if (!this.doesFileExist(path)) {
      localStorage.removeItem(`media${fileUri}`);
      return AppConfig.siteBase + '/file' + fileUri;
    } else {
      return path;
    }
  }
}