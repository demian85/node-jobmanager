var util = require('util'), EventEmitter = require('events').EventEmitter;

/**
 * @param options Object with the following properties:
 *		- (Array)input: contains items to process
 *		- (Number)retries: maximum number of retries before calling next()
 *		- (Number)max: max number of jobs to run in parallel. Default = 0 (no limit)
 *		- (Function)exec: Function to be called for each job. The first argument will be the item extracted from the queue. The 2nd is an object representing the current job and has the following methods: retry(), end(), fail(). 'this' refers to the job manager instance.
 *		- (Function)end: Function to be called after all jobs have been processed. Also emited as 'end' event.
 *		- (Function)fail: Function to be called when a job failed all the retry attempts or when fail() method is called explicitly. Receives the failed item as the first argument and optional arguments.
 */
function JobManager(options) {
	EventEmitter.call(this);
	
	this._input = options.input || [];
	this._max = options.max || 0;
	this._exec = options.exec || function() {};
	this._count = 0;
	this._retries = options.retries || 2;
	if (typeof options.end == 'function') this.on('end', options.end);
	if (typeof options.fail == 'function') this.on('fail', options.fail);
}

util.inherits(JobManager, EventEmitter);

JobManager.prototype._run = function() {
	var self = this,
	next = function() {
		self._count--;
		self._run();
	},
	item = self._input.shift();
	if (!item && self._count == 0) self.emit('end');
	else if (item) {
		var retries = 0,
		fail = function() {
			self.emit.apply(self, ['fail', item].concat(Array.prototype.slice.call(arguments)));
			next();		
		},
		job = {
			end : next,
			next : next, // @deprecated
			fail : fail,
			retry : function(timeout) {				
				if (retries == self._retries) fail();
				else {
					retries++;
					if (timeout) setTimeout(function() { self._exec.call(self, item, job); }, timeout);
					else self._exec.call(self, item, job);
				}
			}	
		};
		self._count++;
		self._exec.call(self, item, job);
	}
};
JobManager.prototype.add = function(item) {
	this._input.push(item);
};
JobManager.prototype.cancel = function() {
	this._input = [];
};
JobManager.prototype.getCount = function() {
	return this._count;
};
JobManager.prototype.init = function() {
	if (this._count > 0) return;
	var len = this._max ? Math.min(this._max, this._input.length) : this._input.length;
	if (len == 0) this.emit('end');
	else {
		for (var i = 0; i < len && this._input.length; i++) {
			this._run();
		}
	}
};

exports.JobManager = JobManager;