/*global describe, it, beforeEach, inject, expect, module*/
/*jslint nomen: true*/

(function () {
    'use strict';

    describe('Todo Controller', function () {
        var ctrl, scope, store;

        // Load the module containing the app, only 'ng' is loaded by default.
        beforeEach(module('todomvc'));

        beforeEach(inject(function ($controller, $rootScope, api, $httpBackend) {
            scope = $rootScope.$new();
            store = api;

            // Setup POST method to echo the input data.
            $httpBackend
                .when('POST', '/api/todos')
                .respond(function (method, url, data) {
                    return [200, JSON.parse(data)];
                });

            ctrl = $controller('TodoCtrl', {
                $scope: scope,
                store: store
            });
        }));

        it('No todos on start', function () {
            expect(scope.editedTodo).toBeNull();
        });

        it('No active todos on start', function () {
            expect(scope.todos.length).toBe(0);
        });

        it('No `editedTodo` on start', function () {
            expect(scope.editedTodo).toBeNull();
        });

        it('All Todos completed on start', function () {
            scope.$digest();
            // Is this worth checking? There are no checked todos because
            // there are no todos period.
            expect(scope.allChecked).toBeTruthy();
        });

        describe('Filter', function () {
            it('should default to ""', function () {
                scope.$emit('$routeChangeSuccess');

                expect(scope.status).toBe('');
                expect(scope.statusFilter).toBeNull();
            });

            describe('being at /active', function () {
                it('should filter non-completed', inject(function ($controller) {
                    ctrl = $controller('TodoCtrl', {
                        $scope: scope,
                        store: store,
                        $routeParams: {
                            status: 'active'
                        }
                    });

                    scope.$emit('$routeChangeSuccess');
                    expect(scope.statusFilter.completed).toBeFalsy();
                }));
            });

            describe('being at /completed', function () {
                it('should filter completed', inject(function ($controller) {
                    ctrl = $controller('TodoCtrl', {
                        $scope: scope,
                        $routeParams: {
                            status: 'completed'
                        },
                        store: store
                    });

                    scope.$emit('$routeChangeSuccess');
                    expect(scope.statusFilter.completed).toBeTruthy();
                }));
            });
        });

        describe('having no Todos', function () {
            var ctrl;

            it('should not add empty Todos', function () {
                scope.newTodo = '';
                scope.addTodo();
                scope.$digest();
                expect(scope.todos.length).toBe(0);
            });

            it('should not add items consisting only of whitespaces', function () {
                scope.newTodo = '   ';
                scope.addTodo();
                scope.$digest();
                expect(scope.todos.length).toBe(0);
            });


            it('should trim whitespace from new Todos', inject(
                function ($httpBackend) {
                    scope.newTodo = '  buy some unicorns  ';
                    scope.addTodo();
                    $httpBackend.flush();

                    scope.$digest();
                    expect(scope.todos.length).toBe(1);
                    expect(scope.todos[0].title).toBe('buy some unicorns');
                }
            ));
        });

        describe('Pre-populate 5 Todos', function () {
            var ctrl;

            beforeEach(inject(function ($controller, $httpBackend) {
                ctrl = $controller('TodoCtrl', {
                    $scope: scope,
                    store: store
                });

                store.insert({ title: 'Uncompleted Item 0', completed: false });
                store.insert({ title: 'Uncompleted Item 1', completed: false });
                store.insert({ title: 'Uncompleted Item 2', completed: false });
                store.insert({ title: 'Completed Item 0', completed: true });
                store.insert({ title: 'Completed Item 1', completed: true });
                scope.$digest();
                $httpBackend.flush();
            }));

            it('should count Todos correctly', function () {
                expect(scope.todos.length).toBe(5);
                expect(scope.remainingCount).toBe(3);
                expect(scope.completedCount).toBe(2);
                expect(scope.allChecked).toBeFalsy();
            });

            it('should save Todos to local storage', function () {
                expect(scope.todos.length).toBe(5);
            });

            it('should remove Todos w/o title on saving', function () {
                var todo = store.todos[2];
                scope.editTodo(todo);
                todo.title = '';
                scope.saveEdits(todo);
                expect(scope.todos.length).toBe(4);
            });

            it('should trim Todos on saving', function () {
                var todo = store.todos[0];
                scope.editTodo(todo);
                todo.title = ' buy moar unicorns  ';
                scope.saveEdits(todo);
                expect(scope.todos[0].title).toBe('buy moar unicorns');
            });

            it('clearCompletedTodos() should clear completed Todos', function () {
                scope.clearCompletedTodos();
                expect(scope.todos.length).toBe(3);
            });

            it('markAll() should mark all Todos completed', inject(
                function ($httpBackend) {
                    $httpBackend
                        .when('PUT', '/api/todos/undefined')
                        .respond(200, {status: 'success'});

                    scope.markAll(true);
                    scope.$digest();
                    expect(scope.completedCount).toBe(5);
                }
            ));

            it('revertTodo() get a Todo to its previous state', function () {
                var todo = store.todos[0];
                scope.editTodo(todo);
                todo.title = 'Unicorn sparkly skypuffles.';
                scope.revertEdits(todo);
                scope.$digest();
                expect(scope.todos[0].title).toBe('Uncompleted Item 0');
            });
        });
    });
}());
