var f1   = require('./file1.js')
  , f2   = require('./file2.js')
  , test = require('tape')
  ;

test('f1', function(t)
{
  t.equal(f1(8), 3, 'should get 3 for 8');
  t.equal(f1(3), 8, 'should get 8 for 3');

  t.end();
});


test('f2', function(t)
{
  t.equal(f2(8, 3), 11, 'should get 11 for 8 and 3');
  t.equal(f2(3, 8), 11, 'should get 11 for 3 and 8');
  t.equal(f2(-5, 5), 25, 'should get 25 for -5 and 5');
  t.equal(f2(5, -5), 25, 'should get 25 for 5 and -5');

  t.end();
});
