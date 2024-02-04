import {
  MasterProtocolSchema,
  BufferTypeSizes,
  getBufferSize,
} from './ProtocolUtil';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export const decodeProtocol = buffer => {
  const result = {};
  const dataView = new DataView(buffer);

  const protocol = dataView.getUint16(0, false);
  const schema = MasterProtocolSchema[protocol];
  let offset = 0;
  const stack = [];

  for (let i = schema.length - 1; i >= 0; i--) {
    const segment = schema[i];
    stack.push({
      segment,
      result,
    });
  }

  while (stack.length > 0) {
    const { segment, result: curResult } = stack.pop();
    switch (segment.type) {
      case 'array':
        const count = dataView.getUint8(offset);
        offset += 1;

        curResult[segment.valueName] = [];
        for (let i = count - 1; i >= 0; i--) {
          const rr = {};
          curResult[segment.valueName].unshift(rr);
          for (let j = segment.data.length - 1; j >= 0; j--) {
            stack.push({
              segment: segment.data[j],
              result: rr,
            });
          }
        }
        break;

      case 'object':
        curResult[segment.valueName] = {};
        for (let i = segment.data.length - 1; i >= 0; i--) {
          const seg = segment.data[i];

          stack.push({
            segment: seg,
            result: curResult[segment.valueName],
          });
        }
        break;

      case 'string':
        const stringSize = dataView.getUint8(offset);
        const stringBuffer = new ArrayBuffer(stringSize);
        const dv = new DataView(stringBuffer);
        for (let i = 0; i < stringSize; i++) {
          dv.setUint8(i, dataView.getUint8(offset + i + 1));
        }
        curResult[segment.valueName] = textDecoder.decode(stringBuffer);
        offset += stringBuffer.byteLength + 1;
        break;

      case 'uint8': {
        curResult[segment.valueName] = dataView.getUint8(offset, false);
        offset += BufferTypeSizes[segment.type];
        break;
      }
      case 'int8': {
        curResult[segment.valueName] = dataView.getInt8(offset);
        offset += BufferTypeSizes[segment.type];
        break;
      }
      case 'uint16': {
        curResult[segment.valueName] = dataView.getUint16(offset, false);
        offset += BufferTypeSizes[segment.type];
        break;
      }
      case 'uint32': {
        curResult[segment.valueName] = dataView.getUint32(offset, false);
        offset += BufferTypeSizes[segment.type];
        break;
      }
      case 'boolean': {
        curResult[segment.valueName] = dataView.getUint8(offset, false) === 1;
        offset += BufferTypeSizes[segment.type];
        break;
      }
      case 'radian': {
        const rad = dataView.getUint16(offset, false) / 1000 - Math.PI;
        curResult[segment.valueName] = rad;
        offset += BufferTypeSizes[segment.type];
        break;
      }
    }
  }

  return result;
};

export const createBufferFromProtocol = (protocol, values) => {
  const schema = MasterProtocolSchema[protocol];

  const size = getBufferSize(schema, values);
  const buffer = new ArrayBuffer(size);
  const dataView = new DataView(buffer);
  let offset = 0;
  const stack = [];
  for (let i = schema.length - 1; i >= 0; i--) {
    const segment = schema[i];
    stack.push({
      segment,
      value: segment.value || values[segment.valueName],
    });
  }

  while (stack.length > 0) {
    const { segment, value } = stack.pop();
    switch (segment.type) {
      case 'array':
        dataView.setUint8(offset, value.length);
        offset += 1;

        for (let i = value.length - 1; i >= 0; i--) {
          for (let j = segment.data.length - 1; j >= 0; j--) {
            stack.push({
              segment: segment.data[j],
              value: value[i][segment.data[j].valueName],
            });
          }
        }
        break;
      case 'object':
        for (let i = segment.data.length - 1; i >= 0; i--) {
          stack.push({
            segment: segment.data[i],
            value: value[segment.data[i].valueName],
          });
        }
        break;
      case 'string':
        const stringBuffer = textEncoder.encode(value);
        dataView.setUint8(offset, stringBuffer.byteLength);

        for (let i = 0; i < stringBuffer.byteLength; i++) {
          dataView.setUint8(offset + i + 1, stringBuffer[i]);
        }
        offset += stringBuffer.byteLength + 1;
        break;
      case 'int8':
        dataView.setInt8(offset, value);
        offset += BufferTypeSizes[segment.type];
        break;
      case 'uint8':
        dataView.setUint8(offset, value);
        offset += BufferTypeSizes[segment.type];
        break;
      case 'uint16':
        dataView.setUint16(offset, value, false);
        offset += BufferTypeSizes[segment.type];
        break;
      case 'uint32':
        dataView.setUint32(offset, value, false);
        offset += BufferTypeSizes[segment.type];
        break;
      case 'boolean':
        dataView.setUint8(offset, value ? 1 : 0);
        offset += BufferTypeSizes[segment.type];
        break;
      case 'radian':
        const sanitizedRadian = Math.floor((value + Math.PI) * 1000);
        dataView.setUint16(offset, sanitizedRadian, false);
        offset += BufferTypeSizes[segment.type];
        break;
    }
  }

  return buffer;
};
