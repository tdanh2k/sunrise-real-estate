import { Client as FtpClient, FTPResponse } from "basic-ftp";
import { Duplex } from "stream";

const base64ToStream = (base64: string) => {
  const buffer = Buffer.from(base64, "base64");
  let stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

export const TestFtpAsync = async () => {
  const client = new FtpClient();
  //client.ftp.verbose = true;
  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
    });
    console.log(await client.list());
  } catch (err) {
    console.log(err);
  }
  client.close();
};

export const UploadBase64FileAsync = async (
  base64File: string,
  remotePath: string
) => {
  const client = new FtpClient();
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
  } catch (err) {
    console.log(err);

    return err as FTPResponse;
  } finally {
    client.close();
  }
};
