const AWS=require('aws-sdk');


exports.uploadToS3 = (data, filename) => {
    const BUCKET_NAME = 'userexpensefile46461';
    const IAM_USER_KEY = 'AKIAYRQ7MLNF7VZ45SED';
    const IAM_USER_SECRET = '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';

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
    })
  var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }
    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3response) => {
            if (err) {
                console.log('something went wrong', err)
                reject(err)
            } else {
                console.log('success', s3response)
                resolve(s3response.Location);
                
            }
        })
    })
}