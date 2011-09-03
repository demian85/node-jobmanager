Install
-------
<pre>
npm install jobmanager
</pre>

Examples
----
<pre>
var JobManager = require('JobManager').JobManager,
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
			if (item%2 == 0) job.retry(0);
			else job.next();
		}, 100);
	},
	end : function() {
		util.log('process finished')
	}
}).init();

/**
 * Execute a maximum of 2 tasks in parallel
 */
new JobManager({
	max: 2,
	input : [1,2,3,4,5,6],
	exec : function(item, job) {
		util.log('Executing ' + item);
		setTimeout(function() {
			if (item%2 == 0) job.retry(0);
			else job.next();
		}, 100);
	},
	end : function() {
		util.log('process finished')
	}
}).init();
</pre>
