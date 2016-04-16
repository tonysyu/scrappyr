var context = require.context('./src', true, /-spec.js$/);
context.keys().forEach(context);
console.log("\nDetected tests:\n\t" + context.keys().join('\n\t'));
