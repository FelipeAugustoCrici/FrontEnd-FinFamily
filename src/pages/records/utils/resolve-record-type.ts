import type { UnifiedRecord } from '../types/record.types';

export function resolveDeleteType(record: UnifiedRecord) {
  return record.originalType;
}
