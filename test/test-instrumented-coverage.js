var test    = require('tape');
var path    = require('path');
var spawner = require('./spawner.js');
var common  = require('./common.js');
var source  = path.basename(__filename, '.js');

test('instrumented, no coverage', function(t)
{
  t.plan(5);

  spawner(
    common.beforeTest(source).concat([
      [
        {'browserify': ['-t', 'browserify-istanbul', './fixture/test.js']},
        {'node': ['./instrumented/' + source + '/bin/obake.js', '--coverage']}
      ]
    ],
    common.afterTest(source)
  ),
  function(err, output)
  {
    t.error(err, 'running instrumented obake should not error');
    t.ok(output.istanbul.indexOf('Statements   : 100% ( 20/20 )') > -1, 'should have 20 statements covered');
    t.ok(output.istanbul.indexOf('Branches     : 100% ( 4/4 )') > -1, 'should have 4 branches covered');
    t.ok(output.istanbul.indexOf('Functions    : 100% ( 4/4 )') > -1, 'should have 4 functions covered');
    t.ok(output.istanbul.indexOf('Lines        : 100% ( 20/20 )') > -1, 'should have 20 lines covered');
  });
});
