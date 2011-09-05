var JobManager = require('./jobmanager').JobManager,
util = require('util');

/**
 * Execute tasks in parallel. Retry 5 times and wait 3 seconds in between
 */
new JobManager({
	input : [1,2,3,4,5,6],
	retries : 5,
	exec : function(item, job) {
		util.log('Executing ' + item);
		setTimeout(function() {
			if (item%2 == 0) job.retry(3000);
			else job.next();
		}, 100);
	},
	end : function() {
		util.log('process finished')
	},
	fail : function(item) {
		console.error(item + ' failed!');
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
			if (item%2 == 0) job.retry();
			else job.next();
		}, 100);
	},
	end : function() {
		util.log('process finished')
	}
}).init();