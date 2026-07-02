const fs = require('fs');
const path = require('path');

const icons = [
  { name: 'home', color: '#909399', selectedColor: '#009D85' },
  { name: 'health', color: '#909399', selectedColor: '#009D85' },
  { name: 'service', color: '#909399', selectedColor: '#009D85' },
  { name: 'interaction', color: '#909399', selectedColor: '#009D85' },
  { name: 'profile', color: '#909399', selectedColor: '#009D85' }
];

const createSimplePNG = (color) => {
  const size = 64;
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  const createChunk = (type, data) => {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length);
    const typeBuffer = Buffer.from(type);
    const crcData = Buffer.concat([typeBuffer, data]);
    const crc = Buffer.alloc(4);
    let c = 0xFFFFFFFF;
    for (let i = 0; i < crcData.length; i++) {
      c ^= crcData[i];
      for (let j = 0; j < 8; j++) {
        c = (c >>> 1) ^ (c & 1 ? 0xEDB88320 : 0);
      }
    }
    crc.writeUInt32BE((c ^ 0xFFFFFFFF) >>> 0);
    return Buffer.concat([length, typeBuffer, data, crc]);
  };
  
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  
  const rawData = [];
  for (let y = 0; y < size; y++) {
    rawData.push(0);
    for (let x = 0; x < size; x++) {
      rawData.push(r, g, b);
    }
  }
  
  const { deflateSync } = require('zlib');
  const compressed = deflateSync(Buffer.from(rawData));
  
  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));
  
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
};

const tabbarDir = path.join(__dirname);

icons.forEach(icon => {
  const normalPng = createSimplePNG(icon.color);
  const selectedPng = createSimplePNG(icon.selectedColor);
  
  fs.writeFileSync(path.join(tabbarDir, `${icon.name}.png`), normalPng);
  fs.writeFileSync(path.join(tabbarDir, `${icon.name}-active.png`), selectedPng);
  
  console.log(`Created ${icon.name}.png and ${icon.name}-active.png`);
});

console.log('All icons created successfully!');