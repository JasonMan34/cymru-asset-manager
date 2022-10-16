import { model, Schema, Types } from 'mongoose';

enum ScanStatus {
  Pending = 'Pending',
  Success = 'Success',
  Failed = 'Failed',
}

const Scan = new Schema({
  assetId: { type: Types.ObjectId, required: true },
  dateCreated: { type: Date, required: true, default: () => new Date() },
  scanDueDate: { type: Date, required: true },
  dateCompleted: { type: Date },
  status: { type: String, enum: ScanStatus, default: ScanStatus.Pending },
});

export default model('scan', Scan);
