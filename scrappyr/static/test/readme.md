Karma Unit Tests
================

To run the test suite, run these commands:

    npm install
    npm test

Dependencies
------------

Note that new dependencies need to be added to both the main application and
to the tests. For most dependencies, you would run:

    npm install <new-dependency> --save-dev

and then add the path to the new dependency to the `files` property in
`config/karma.conf.js`. You'll need to **restart the test runner**
(i.e. rerun `npm test`) for the updates to take effect.
