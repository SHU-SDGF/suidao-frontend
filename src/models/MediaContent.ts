
export interface IMediaContent{
  mediaType: 'img' | 'video' | 'audio';
  fileUri: string;
  size?: number;
  preview?: string;
  cached?: boolean;
  localUri?: string;
}

export class MediaContent implements IMediaContent{
  mediaType: 'img' | 'video' | 'audio' = null;
  fileUri: string = '';
  size: number = 0;
  preview: string = '';
  cached: boolean = false;
  localUri: string = '';

  constructor(obj) {
    Object.assign(this, obj);
  }
}
