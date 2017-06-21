import { FacilityInspSummaryDB } from './db/facility-insp-summary-db';
import { FacilityInspDetailDB } from './db/facility-insp-detail-db';
import { HttpService } from './http-service';
import { FileService } from './file-service';
import { LookupService } from './lookup-service';
import { MediaService } from './media-service';
import { QRCodeService } from './qrcode-service';
import { UserService } from './user-service';
import { FacilityInspService } from './facility-insp-service';
import { EnvironmentActivityService } from './environment-activity-service';
import { DBService } from './db-service';

export const APP_SERVICES = [
  DBService, EnvironmentActivityService, FacilityInspService,
  FileService, LookupService, MediaService, QRCodeService, UserService,
  HttpService, FacilityInspDetailDB, FacilityInspSummaryDB
];
