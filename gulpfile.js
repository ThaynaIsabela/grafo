const { series } = require('gulp');
const ghpages = require('gh-pages');

function publish(cb) {
    ghpages.publish('build', cb);
}

exports.publish = publish;
exports.default = series(publish);