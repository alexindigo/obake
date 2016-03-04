// Public API
module.exports = tapAdapter;

/**
 * Checks for test messages
 * and invokes callback after final
 * success message has been received
 *
 * @param   {string} msg - test suite's log
 * @param   {function} callback - function to invoke when tests are through
 */
function tapAdapter(msg, callback)
{
  // if final success
  if (msg == '# ok')
  {
    callback();
  }
}
