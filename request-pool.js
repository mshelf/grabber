const rp = require("request-promise");

class RequestPool {
    constructor(maxParallelRequests) {
        this._maxParallelRequests = maxParallelRequests;
        this._runRequestCount = 0;

        this._queue = {};
        this._tail = 0;
        this._head = 0;
    }

    request(requestOpts) {
        return new Promise((resolve, reject) =>  {
            if (this._runRequestCount < this._maxParallelRequests) {
                this._runRequestCount++;
                this._makeRequest(requestOpts, resolve, reject);
            } else {
                this._putToQueue(requestOpts, resolve, reject);
            }
        });

    }

    _putToQueue(requestOpts, resolve, reject) {
        this._queue[this._tail] = { requestOpts, resolve, reject };
        this._tail++;
    }

    _runFromQueue() {
        if (this._tail === this._head) {
            return;
        }
        if (this._runRequestCount >= this._maxParallelRequests) {
            return;
        }

        const { requestOpts, resolve, reject } = this._queue[this._head];
        delete this._queue[this._head];

        this._head++;
        if (this._head === this._tail) {
            this._head = 0;
            this._tail = 0;
        }

        this._makeRequest(requestOpts, resolve, reject);
    }

    _makeRequest(requestOpts, resolve, reject) {
        return rp(requestOpts)
            .then(result => {
                this._runRequestCount--;
                resolve(result);
                this._runFromQueue();
            })
            .catch(err => {
                this._runRequestCount--;
                reject(err);
                this._runFromQueue();
            });
    }
}

module.exports = RequestPool;