// NOTE: I previously suggested doing this through Grunt, but had plenty of problems with
// my set up. Grunt did some weird things with scope, and I ended up using nodemon. This
// setup is now using Gulp. It works exactly how I expect it to and is WAY more concise.
// *** Prompt Command > gulp ***
var gulp = require('gulp'),
    execSync = require('child_process').execSync,
    spawn = require('child_process').spawn,
    node;

/**
 * $ gulp server
 * description: launch the server. If there's a server already running, kill it.
 */
gulp.task('server', function() {
    //console.log(node)
    if (node){
        gulp.task('server-exit')();
    }
    //console.log(node)

    node = spawn('node', ['./server.js'], {stdio: 'inherit'})
})

gulp.task('server-exit', function(){
    console.log('NOPID> ' + node.pid)
    execSync('taskkill /f /pid ' + node.pid, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        //cb(err);
    });     
})

/**
 * $ gulp
 * description: start the development environment
 */
gulp.task('default', function() {
    gulp.task('server')()

    // Need to watch for sass changes too? Just add another watch call!
    // no more messing around with grunt-concurrent or the like. Gulp is
    // async by default.
})

/**
 * $ gulp git
 * description: start the development environment
 */
gulp.task('git', async function(){
    gulp.task('git-pull')();
    gulp.task('git-add')();
    gulp.task('git-commit')();
    gulp.task('git-push')();
})

gulp.task('git-pull', async function(){
    execSync('git pull', function (err, stdout, stderr) {
        console.log(err);
    });
})

gulp.task('git-add', async function(){
    execSync('git add .', function (err, stdout, stderr) {
        console.log(err);
    });
})

gulp.task('git-commit', async function(){
    execSync('git commit -am "Alteracoes"', function (err, stdout, stderr) {
        console.log(err);
    });
})

gulp.task('git-push', async function(){
    execSync('git push -u origin master', function (err, stdout, stderr) {
        console.log(err);
    });
})