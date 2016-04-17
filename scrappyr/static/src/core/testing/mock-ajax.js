class MockPromise {
    constructor(callback) {
        this._callback = callback;
    }

    then(onSuccess, onFailure) {
        return this._callback(onSuccess, onFailure);
    }
}

class MockResponse {
    respond(callback) {
        this._callback = callback;
    }

    finalize(method, url, data) {
        var responseStatus, responseData;
        var json = JSON.stringify(data);
        [responseStatus, responseData] = this._callback(method, url, json);
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
 * MockAjax class that matches the interface of angular-mocks $httpBackend.
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
    }

    ajax(method, route, data) {
        var response = this._responses[method][route];
        if (response === undefined) {
            throw new "Response for ${method} ${route} not found";
        }
        var promise = response.finalize(method, route, data);
        return promise;
    }

    post(route, data) {
        return this.ajax('POST', route, data);
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
