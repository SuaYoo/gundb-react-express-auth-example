/*
 * Custom version of
 * https://github.com/zrrrzzt/bullet-catcher/blob/master/index.js
 * with added error handling.
 *
 * To add a custom error to the context (eg to show on the client)
 * return a new `Error` from `isValid` instead of a boolean.
 */
function withBulletCatcher(Gun) {
  Gun.on('opt', function (context) {
    if (context.once) {
      return;
    }
    // Pass to subsequent opt handlers
    this.to.next(context);

    const { isValid } = context.opt;

    if (!isValid) {
      throw new Error('you must pass in an isValid function');
    }

    // if (!isFn(isValid)) {
    //   throw new Error('isValid must be a function');
    // }

    // Check all incoming traffic
    context.on('in', function (msg) {
      var to = this.to;
      // restrict put
      if (msg.put) {
        const isValidMsg = isValid(msg);

        if (isValidMsg instanceof Error) {
          // not in bullet-catcher: pass custom error
          context.on('in', { '@': msg['#'], err: isValidMsg.message });
        } else {
          if (isValidMsg) {
            to.next(msg);
          }
        }
      } else {
        to.next(msg);
      }
    });
  });

  return Gun;
}

module.exports = withBulletCatcher;
