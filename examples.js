var JobManager = require('./jobmanager').JobManager,
util = require('util');

/**
 * Execute tasks in parallel. Retry 3 times and wait 3 seconds in between
 */
new JobManager({
	input : [1,2,3,4,5,6],
	retries : 3,
	exec : function(item, job) {
		util.log('Executing ' + item);
		setTimeout(function() {
			if (item%2 == 0) job.retry(3000);
			else if (item == 5) job.fail(new Error('5 is not valid!'));
			else job.end();
		}, 100);
	},
	end : function() {
		util.log('process finished')
	},
	fail : function(item, err) {
		console.error(item + ' failed!');
		if (err) console.error(err);
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
			else job.end();
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
			else job.end();
		}, 100);
	}
});
mgr.add(1);
mgr.add(3);
mgr.add(4);
mgr.init();