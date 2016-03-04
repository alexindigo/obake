var addCoverageWriter = require('./add_coverage_writer.js');

// Public API
module.exports = {
  beforeTest: function(source)
  {
    return [
      {'rimraf': 'instrumented/' + source},
      {'mkdirp': [
        'instrumented/' + source + '/bin',
        'instrumented/' + source + '/lib',
        'instrumented/' + source + '/adapters',
        'instrumented/' + source + '/coverage'
      ]},
      {'istanbul': ['instrument', '--output', 'instrumented/' + source + '/bin/obake.js', './bin/obake.js']},
      addCoverageWriter('./test/coverage_writer.js', './instrumented/' + source + '/bin/obake.js', source),
      {'istanbul': ['instrument', '--output', 'instrumented/' + source + '/index.js', 'index.js']},
      {'istanbul': ['instrument', '--output', 'instrumented/' + source + '/adapters/tap.js', 'adapters/tap.js']},
      {'istanbul': ['instrument', '--output', 'instrumented/' + source + '/lib/phantom.js', 'lib/phantom.js']},
      addCoverageWriter('./test/coverage_writer_phantomjs.js', './instrumented/' + source + '/lib/phantom.js', source + '_phantomjs'),
    ];
  },

  afterTest: function(source)
  {
    return [
      {'ls': 'instrumented/' + source},
      {'istanbul': ['report', '--root', 'instrumented/' + source, '--dir', 'instrumented/' + source + '/coverage', 'lcov', 'text-summary']},
      {'rimraf': 'instrumented/' + source}
    ];
  }
};
