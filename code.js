const { resolve } = require('path');

const { XVIZData, XVIZBinaryReader, XVIZFormatWriter, XVIZ_FORMAT } = require('@xviz/io');
const { FileSource, FileSink } = require('@xviz/io/node');

const DIR_DATA = resolve(__dirname, '../_xviz-data/generated/kitti/2011_09_26/2011_09_26_drive_0005_sync');
const DIR_TMP = resolve(DIR_DATA, '.tmp');

const fileSource = new FileSource(DIR_DATA);
const fileSink = new FileSink(DIR_TMP);
const birReader = new XVIZBinaryReader(fileSource);
const birWriter = new XVIZFormatWriter(fileSink, { format: XVIZ_FORMAT.BINARY_GLB });

const metadataBuffer = birReader.readMetadata();
const metadataXVIZData = new XVIZData(metadataBuffer);

birWriter.writeMetadata(metadataXVIZData);

const messagesCount = birReader.messageCount();

for(let i = 0; i < messagesCount; i++) {
    const messageBuffer = birReader.readMessage(i);
    const messageXVIZData = new XVIZData(messageBuffer);

    birWriter.writeMessage(i, messageXVIZData);
}

birWriter.close();
