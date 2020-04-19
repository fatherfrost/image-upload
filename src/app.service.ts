import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as aws from 'aws-sdk';
import * as Busboy from "busboy";

@Injectable()
export class AppService {
  ID = '';
  SECRET = '';
  BUCKET_NAME = 'images';
  s3 = new aws.S3({
    accessKeyId: this.ID,
    secretAccessKey: this.SECRET
  });

  async upload(request) {
    const sizes = [300, 1024, 2048];
    const image = await this.readImage(request);
    console.log(image);
    sizes.forEach(size => {
      sharp(image).resize({ height: size, width: size}).toFile(size + '.jpg')
        .then((result) => {
          console.log('Done');
          console.log(result);
          // this.uploadToS3(result, size);
        })
        .catch((err) => {
          console.log(err);
        });
    })

  }

  uploadToS3(image, size) {
    const params = {
      Bucket: 'userId',
      Key: size + '*' + size + '.jpg',
      Body: image
    };
    this.s3.upload(params, function(err, data) {
      if (err) {
        throw err;
      }
      console.log(`File uploaded successfully. ${data.Location}`);
      return 1;
    });
  }

  readImage(req) {
    let image;
    console.log('--------------------');
    return new Promise((resolve, reject) => {
      const busBoy = Busboy({headers: req.headers});
      busBoy.on('file', (fieldName, file) => {
        const stream = [];
        file.on('data', (data) => {
          console.log('1111111111111');
          stream.push(data);
        });
        file.on('end', () => {
          console.log('22222222222');
          image = Buffer.concat(stream);
        });
      });
      busBoy.on('finish', function () {
        console.log('3333333333');
        resolve(image);
      });
      req.pipe(busBoy);
    });
  }
}
