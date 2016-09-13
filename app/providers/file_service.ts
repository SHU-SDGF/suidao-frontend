import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Transfer, FileUploadOptions} from 'ionic-native';
import {HttpService} from './http_service';
import { AppConfig } from './config';

declare const FileTransfer;
declare const cordova;
declare const device;

const UPLOAD_PATH = AppConfig.apiBase + '/upload';
const DOWNLOAD_PATH = AppConfig.apiBase + '/download';

@Injectable()
export class FileService {
  private get rootDir() {
    return this.getRootFolder(device.platform) + '/files';
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

  /**
   * upload file
   * @param {string} id
   * @param {function} progressListener
   */  
  public uploadFile(id, progressListener) {
    const fileTransfer = new Transfer();
    let filePath = `${this.rootDir}/${id}`;
    let options: FileUploadOptions = {
      headers: {
        "Authorization": localStorage.getItem("authToken")
      }
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
}