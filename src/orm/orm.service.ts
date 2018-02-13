import { FacilityInfo } from '../models/FacilityInfo';
import { Injectable } from '@angular/core';
import { EnvironmentActivity } from '../models/EnvironmentActivity';
import { EnvironmentActivitySummary } from '../models/EnvironmentActivitySummary';
import { FacilityInspDetail } from '../models/FacilityInspDetail';
import { FacilityInspSummary } from '../models/FacilityInspSummary';
import { 
  ConnectionOptions,
  createConnection,
  Connection,
} from 'bas-typeorm';

const options: ConnectionOptions = {
  driver: {
    type: 'websql',
    database: 'tunneldb',
    extra: {
      version: 1,
      size: 5 * 1024 * 1024
    }
  },
  entities: [
    EnvironmentActivity,
    EnvironmentActivitySummary,
    FacilityInspDetail,
    FacilityInspSummary,
    FacilityInfo,
  ],
  autoSchemaSync: true
};

@Injectable()
export class TunnelORM {
  public connection: Connection = null;

  public get environmentActivityRepo() {
    return this.connection.getRepository(EnvironmentActivity);
  }

  public get environmentActivitySummaryRepo() {
    return this.connection.getRepository(EnvironmentActivitySummary);
  }

  public get facilityInspDetailRepo() {
    return this.connection.getRepository(FacilityInspDetail);
  }

  public get facilityInspSummaryRepo() {
    return this.connection.getRepository(FacilityInspSummary);
  }

  public get facilityInfoRepo() {
    return this.connection.getRepository(FacilityInfo);
  }

  public async init() {
    try { 
      this.connection = await createConnection(options);
      console.log('db connected');
    } catch (error) {
      console.error(`Connection Error ${JSON.stringify(error)}`);
    }
  }
}
