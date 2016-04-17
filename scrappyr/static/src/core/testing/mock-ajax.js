class MockPromise {
    constructor(callback) {
        this._callback = callback;
    }

    then(onSuccess, onFailure) {
        this._callback(onSuccess, onFailure);
        return this;
    }

    finally() {
    }
}

class MockResponse {
    respond(callback) {
        this._callback = callback;
        return this;
    }

    finalize(method, route, data) {
        var responseStatus, responseData;
        var json = JSON.stringify(data);
        [responseStatus, responseData] = this._callback(method, route, json);
        var returnValue = {
            status: responseStatus,
            data: responseData,
        };
        return new MockPromise((onSuccess, onFailure) => {
            if (responseStatus >= 200 && responseStatus < 300) {
                return onSuccess(returnValue);
            } else {
                return onFailure(returnValue);
            }
        });
    }
}

/**
 * MockAjax class that matches the interface of angular-mock's $httpBackend.
 *
 */
export default class MockAjax {
    constructor() {
        this._responses = {
            GET: {},
            DELETE: {},
            POST: {},
            PUT: {},
        };

        //throw `Response for ${method} ${route} not found`;
        this._defaultResponse = new MockResponse()
            .respond((method, route, json) => {
                return [200, JSON.parse(json)];
            });
    }

    ajax(method, route, data) {
        var response = this._responses[method][route];
        if (response === undefined) {
            response = this._defaultResponse;
        }
        var promise = response.finalize(method, route, data);
        return promise;
    }

    get(route, data) {
        return this.ajax('GET', route, data);
    }

    delete(route) {
        var promise = this.ajax('DELETE', route, {});
        return promise;
    }

    post(route, data) {
        return this.ajax('POST', route, data);
    }

    put(route, data) {
        return this.ajax('PUT', route, data);
    }

    /**
     * Return mock response for the given http method and route.
     *
     * The returned response object has a respond function that takes
     * a callback expecting (method, route, data) arguments.
     */
    when(method, route) {
        var response = new MockResponse();
        this._responses[method][route] = response;
        return response;
    }

    flush() {}
}
