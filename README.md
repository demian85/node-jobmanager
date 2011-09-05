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
new JobManager({
// Valid properties:
//- (Array)input: array of items to process
//- (Number)retries: maximum number of retries before calling next()
//- (Number)max: max number of jobs to run in parallel. Default = 0 (no limit)
//- (Function)exec: Function to be called for each input item. The first argument will be the item extracted from the queue. The 2nd is an object representing the current job and has the following methods: retry(), next(). 'this' refers to the job manager instance.
//- (Function)end: Function to be called after the execution of all tasks. Also emited as 'end' event.
//- (Function)fail: Function to be called when a job failed all the retry attempts or when fail() method is called explicitly.
}).init();
```

Examples
----
```js
var JobManager = require('jobmanager').JobManager,
util = require('util');

/**
 * Execute tasks in parallel. Retry 5 times
 */
new JobManager({
	input : [1,2,3,4,5,6],
	retries : 5,
	exec : function(item, job) {
		util.log('Executing ' + item);
		setTimeout(function() {
			if (item%2 == 0) job.retry();
			else job.next();
		}, 100);
	},
	end : function() {
		util.log('process finished')
	}
}).init();

/**
 * Execute a maximum of 2 tasks in parallel. Retry after 5 seconds...
 */
new JobManager({
	max: 2,
	input : [1,2,3,4,5,6],
	exec : function(item, job) {
		util.log('Executing ' + item);
		setTimeout(function() {
			if (item%2 == 0) job.retry(5000);
			else job.next();
		}, 100);
	},
	end : function() {
		util.log('process finished')
	}
}).init();

/**
* Add jobs later...
*/
var mgr = new JobManager({
	exec : function(item, job) {
		util.log('Executing ' + item);
		setTimeout(function() {
			if (item%2 == 0) job.retry();
			else job.next();
		}, 100);
	},
	end : function() {
		util.log('process finished')
	}
});
for (var i = 1; i <= 6; i++) mgr.add(i);
mgr.init();
```
