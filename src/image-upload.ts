import { Req, Res, Injectable } from '@nestjs/common';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';

const ID = 'AKIAIZDAKOB6TR2JRCZA';
const SECRET = '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';
const name = 'fatherfrost-test';
const location = 'eu-central-1';

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
});

const bucketParams = {
  Bucket: name,
  CreateBucketConfiguration: {
    LocationConstraint: location
  }
};

@Injectable()
export class ImageUploadService {
  constructor() {}

  async fileupload(@Req() req, @Res() res) {
    try {
      this.upload(req, res, function(error) {
        if (error) {
          console.log(error);
          return res.status(404).json(`Failed to upload image file: ${error}`);
        }
        return res.status(201).json(req.files[0].location);
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(`Failed to upload image file: ${error}`);
    }
  }

  upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: name,
      acl: 'public-read',
      key: function(request, file, cb) {
        cb(null, `${Date.now().toString()} - ${file.originalname}`);
      },
    }),
  }).array('upload', 1);
}
