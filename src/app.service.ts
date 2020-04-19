import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as aws from 'aws-sdk';

@Injectable()
export class AppService {
  ID = '';
  SECRET = '';
  s3 = new aws.S3({
    accessKeyId: this.ID,
    secretAccessKey: this.SECRET
  });

  async upload(image) {
    const sizes = [300, 1024, 2048];
    console.log(image);
    sizes.forEach(size => {
      sharp(image).resize({ height: size, width: size}).toBuffer()
        .then(data => {
          console.log('done');
          // this.uploadToS3(data, size);
        })
        .catch(err => { console.log(err.message) });
    })

  }

  uploadToS3(image, size) {
    const params = {
      Bucket: 'photos',
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

  /*readImage(req) {
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
  }*/
}
