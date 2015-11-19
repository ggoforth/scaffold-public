/*jshint node: true*/
var gulp = require('gulp'),
  envfile = require('envfile'), //parse the env
  notify = require('gulp-notify');

gulp.task('aws', function () {
  var awspublish = require("gulp-awspublish"),
    env = envfile.parseFileSync('.env'),
    headers = {'Cache-Control': 'max-age=315360000, no-transform, public'},
    publisher = awspublish.create({
      params: {
        Bucket: env.S3BUCKET
      },
      accessKeyId: env.S3ACCESSKEYID,
      secretAccessKey: env.S3SECRETACCESSKEY,
      region: env.S3REGION
    });

  gulp.src('./**')
    .pipe(awspublish.gzip({ext: ''}))
    .pipe(publisher.publish(headers))
    .pipe(publisher.sync())
    .pipe(publisher.cache())
    .pipe(awspublish.reporter())
    .pipe(notify({
      title: 'Amazon s3 Publisher',
      subtitle: env.S3BUCKET + ' has been published.',
      message: ' '
    }));
});

/**
 * The deploy task, sets up env.js for use on the production server.
 */
gulp.task('deploy', ['aws']);

