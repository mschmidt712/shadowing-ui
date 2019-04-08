const fs = require('fs');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  region: 'us-east-1'
});

var params = {Bucket: 'shadowing-ui', Body: stream};
s3.upload(params, function(err, data) {
  console.log(err, data);
});