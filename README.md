A really simple tool that helps you manage multiple asynchronous tasks.

Install
-------
```js
npm install jobmanager
```

Usage
----
See: https://github.com/demian85/node-jobmanager/blob/master/examples.js

```js
var JobManager = require('jobmanager').JobManager;
var options = {}; // see below
new JobManager(options).init();
```

Options
----
- (Array) input: array of items to process.
- (Number) retries: maximum number of retries before fail.
- (Number) max: max number of jobs to run in parallel. Default = 0 (no limit)
- (Function) exec: Function to be called for each input item. 
	The first argument will be the item extracted from the queue. 
	The 2nd is an object representing the current job and has the following methods: retry(), next(), fail(). 
	'this' refers to the job manager instance.
- (Function) end: Function to be called after the execution of all tasks. Also emited as 'end' event.
- (Function) fail: Function to be called when a job failed all the retry attempts or when fail() method is called explicitly.