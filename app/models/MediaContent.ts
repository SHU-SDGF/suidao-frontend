import {_baseClass} from './_baseClass';
import {JsonProperty, Serializable} from '../providers/JsonMapper';

export interface IMediaContent{
  mediaType: 'img' | 'video' | 'audio';
  fileUri: string,
  size?: number,
  preview?: string
}

@Serializable()
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

  static deserialize: (obj)=> MediaContent;
}