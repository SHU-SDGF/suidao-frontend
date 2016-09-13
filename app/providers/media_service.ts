import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import {Observable} from 'rxjs';
import {MediaContent} from '../models/MediaContent';

@Injectable()
export class MediaService {

  private started: boolean = false;
  private fileList: Array<MediaContent> = [];

  uploadFiles(){
    
  }

  downloadFiles(){

  }

}