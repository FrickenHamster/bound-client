import { ProtocolSchema } from './Protocol';

export const BufferTypeSizes = {
  uint8: 1,
  int8: 1,
  uint16: 2,
  uint32: 4,
  boolean: 1,
  radian: 2,
  object: 0,
};

export const MasterProtocolSchema = {
  ...ProtocolSchema,
};

export const getBufferSize = (schema, values) => {
  let size = 0;
  for (const segment of schema) {
    size += bufferSizeRec(segment, values);
  }
  return size;
};

const textEncoder = new TextEncoder();

const bufferSizeRec = (segment, values) => {
  switch (segment.type) {
    case 'array': {
      const arrayValue = values[segment.valueName];
      let size = 1;
      for (const item of arrayValue) {
        size += getBufferSize(segment.data, item);
      }
      return size;
    }
    case 'object': {
      let size = 0;
      for (const seg of segment.data) {
        size += bufferSizeRec(seg, values[segment.valueName]);
      }
      return size;
    }
    case 'string':
      return textEncoder.encode(values[segment.valueName]).byteLength + 1;
    default:
      return BufferTypeSizes[segment.type];
  }
};
