import { model, Schema } from 'mongoose';

enum ScanStatus {
  Pending = 'Pending',
  Success = 'Success',
  Failed = 'Failed',
}

const Scan = new Schema({
  dateCreated: { type: Date, required: true, default: () => new Date() },
  scanDueDate: { type: Date, required: true },
  dateCompleted: { type: Date },
  status: { type: String, enum: ScanStatus },
});

export default model('scan', Scan);
