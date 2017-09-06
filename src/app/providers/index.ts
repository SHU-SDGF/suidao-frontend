import { HttpService } from './http-service';
import { FileService } from './file-service';
import { LookupService } from './lookup-service';
import { MediaService } from './media-service';
import { QRCodeService } from './qrcode-service';
import { UserService } from './user-service';
import { FacilityInspService } from './facility-insp-service';
import { EnvironmentActivityService } from './environment-activity-service';

export const APP_SERVICES = [
  EnvironmentActivityService, FacilityInspService,
  FileService, LookupService, MediaService, QRCodeService, UserService,
  HttpService
];
