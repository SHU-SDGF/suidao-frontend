import {_baseClass} from './_baseClass';

export interface IMediaContent{
  mediaType: 'img' | 'video' | 'audio';
  fileUri: string,
  size?: number,
  preview?: string
}

export class MediaContent extends _baseClass implements IMediaContent{
  mediaType: 'img' | 'video' | 'audio' = null;
  fileUri: string = '';
  size: number = 0;
  preview: string = '';
  cached: boolean = false;
  localUri: string = '';

  constructor(obj){
    super();
    this.assign(obj);
  }
}