/*global angular */
/*jslint nomen:true*/

/**
 * Services that persists and retrieves todos from localStorage or a backend
 * API if available.
 *
 * They both follow the same API, returning promises for all changes to the
 * model.
 */
angular.module('scrapps')
    .factory('scrapStorage', function ($http, $injector) {
        'use strict';
        return $http.get('/api').then(function () {
            return $injector.get('api');
        });
    })

    .factory('api', function ($http) {
        'use strict';

        var store = {
            todos: [],

            clearCompleted: function () {
                var originalTodos = store.todos.slice(0),
                    completeTodos = [],
                    incompleteTodos = [];

                store.todos.forEach(function (todo) {
                    if (todo.completed) {
                        completeTodos.push(todo);
                    } else {
                        incompleteTodos.push(todo);
                    }
                });

                angular.copy(incompleteTodos, store.todos);

                return $http.delete('/api/scraps')
                    .then(function success() {
                        return store.todos;
                    }, function error() {
                        angular.copy(originalTodos, store.todos);
                        return originalTodos;
                    });
            },

            delete: function (todo) {
                var originalTodos = store.todos.slice(0);

                store.todos.splice(store.todos.indexOf(todo), 1);

                return $http.delete('/api/scraps/' + todo.id)
                    .then(function success() {
                        return store.todos;
                    }, function error() {
                        angular.copy(originalTodos, store.todos);
                        return originalTodos;
                    });
            },

            get: function () {
                return $http.get('/api/scraps')
                    .then(function (resp) {
                        angular.copy(resp.data.scraps, store.todos);
                        return store.todos;
                    });
            },

            insert: function (todo) {
                var originalTodos = store.todos.slice(0);

                return $http.post('/api/scraps', todo)
                    .then(function success(resp) {
                        store.todos.push(resp.data);
                        return store.todos;
                    }, function error() {
                        angular.copy(originalTodos, store.todos);
                        return store.todos;
                    });
            },

            put: function (todo) {
                var originalTodos = store.todos.slice(0),
                    clientTodo = todo,
                    i;

                return $http.put('/api/scraps/' + todo.id, todo)
                    .then(function success(resp) {
                        for (i = 0; i < store.todos.length; i += 1) {
                            var todo = store.todos[i];
                            if (todo.id === resp.data.id) {
                                break;
                            }
                        }
                        store.todos[i] = resp.data;
                        return store.todos;
                    }, function error() {
                        angular.copy(originalTodos, store.todos);
                        return originalTodos;
                    });
            }
        };

        return store;
    });
