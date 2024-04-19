"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadBase64FileAsync = exports.TestFtpAsync = void 0;
const basic_ftp_1 = require("basic-ftp");
const stream_1 = require("stream");
const base64ToStream = (base64) => {
    const buffer = Buffer.from(base64, "base64");
    let stream = new stream_1.Duplex();
    stream.push(buffer);
    stream.push(null);
    return stream;
};
const TestFtpAsync = async () => {
    const client = new basic_ftp_1.Client();
    //client.ftp.verbose = true;
    try {
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD,
        });
        console.log(await client.list());
    }
    catch (err) {
        console.log(err);
    }
    client.close();
};
exports.TestFtpAsync = TestFtpAsync;
const UploadBase64FileAsync = async (base64File, remotePath) => {
    const client = new basic_ftp_1.Client();
    //client.ftp.verbose = true;
    try {
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD,
        });
        console.log(await client.list());
        const fileStream = base64ToStream(base64File);
        const response = await client.uploadFrom(fileStream, remotePath);
        return response;
    }
    catch (err) {
        console.log(err);
        return err;
    }
    finally {
        client.close();
    }
};
exports.UploadBase64FileAsync = UploadBase64FileAsync;
