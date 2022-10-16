import { model, ObjectId, Schema, Types } from 'mongoose';

export enum ScanStatus {
  Pending = 'Pending',
  Success = 'Success',
  Failed = 'Failed',
}

const Scan = new Schema({
  assetId: { type: Types.ObjectId, ref: 'Asset', required: true },
  dateCreated: { type: Date, required: true, default: () => new Date() },
  scanDueDate: { type: Date, required: true },
  dateCompleted: { type: Date },
  status: { type: String, enum: ScanStatus, default: ScanStatus.Pending },
});

export interface ScanInterface {
  _id: ObjectId;
  assetId: ObjectId;
  dateCreated: Date;
  scanDueDate: Date;
  dateCompleted?: Date;
  status: ScanStatus;
}

export default model('scan', Scan);
