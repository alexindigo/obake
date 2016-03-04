/* eslint-env phantomjs */
/* global page */
/* global system */
page.onClosing = function()
{
  var fs = require('fs');

  if (global.__coverage__)
  {
    fs.write('__coverage_filename__', JSON.stringify(global.__coverage__), 'w');
    system.stderr.write('Saved coverage information to __coverage_filename__.');
  }
};

phantom.__exit = phantom.exit;
phantom.exit = function(code)
{
  // trigger it manually
  page.onClosing();
  phantom.__exit(code);
};
