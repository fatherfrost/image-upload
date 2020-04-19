import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as aws from 'aws-sdk';

@Injectable()
export class AppService {

  ID = '';
  SECRET = '';
  name = 'fatherfrost-test';
  location = 'eu-central-1';

  s3 = new aws.S3({
    accessKeyId: this.ID,
    secretAccessKey: this.SECRET
  });

  bucketParams = {
    Bucket: this.name,
    CreateBucketConfiguration: {
      LocationConstraint: this.location
    }
  };

  async upload(image) {
    // create bucket . if already exists and owned by this s3 user - continue, in other cases - throw err
    try {
      await this.createBucket();
    } catch (err) {
      if (err.code !== 'BucketAlreadyOwnedByYou')
        throw err;
    }
    const sizes = [300, 1024, 2048];
    return Promise.all(sizes.map(async size => {
      return new Promise(resolve => {
        sharp(image).resize({ height: size, width: size})
          .toBuffer()
          .then(async data => {
            const uploadResult = await this.uploadToS3(data, size);
            resolve(uploadResult);
          })
      })
    })).then(result => {
      return result;
    });
  }

   async uploadToS3(image, size) {
      const params = {
        Bucket: this.bucketParams.Bucket,
        Key: size + '.jpg',
        Body: image
      };
      this.s3.upload(params).promise().then(result => {
        console.log(result.Location, ' saved');
      });
      const link = 'https://' + params.Bucket + '.s3.' + this.location + '.amazonaws.com/' + params.Key; // create link to file so
      return link;                                                                                       // we don't need to wait it saved

  }

  createBucket() {
    return this.s3.createBucket(this.bucketParams).promise();
  }
}

