describe("UserFormController", function () {
    var eventCallback;
    beforeEach(function () {
        this.scope = {
            $emit: jasmine.createSpy("$scope.$emit()"),
            $on: jasmine.createSpy("$scope.$on()").andCallFake(function (eventName, callback) {
                eventCallback = callback;
            })
        };
        this.resourceFactory = {
            officeResource: {
                getAllOffices: jasmine.createSpy('officeResource.getAllOffices()').andCallFake(function (params, callback) {
                    callback(['test_office1', 'test_office2']);
                })
            },
            roleResource: {
                getAllRoles: jasmine.createSpy('roleResource.getAllRoles()').andCallFake(function (params, callback) {
                    callback(['test_role1', 'test_role2']);
                })
            },
            userResource: jasmine.createSpy('userResource')
        };

        this.controller = new mifosX.controllers.UserFormController(this.scope, this.resourceFactory);
    });

    describe("Initialization", function () {
        it("should initialize the offices collection", function () {
            expect(this.scope.offices).toEqual(['test_office1', 'test_office2']);
        });
        it("should initialize the roles collection", function () {
            expect(this.scope.roles).toEqual(['test_role1', 'test_role2']);
        });
    });

    describe("When form dialog opens", function () {
        it("should listen to the 'OpenUserFormDialog' event", function () {
            expect(this.scope.$on).toHaveBeenCalledWith('OpenUserFormDialog', jasmine.any(Function));
        });
        it("should reset the form data", function () {
            eventCallback();

            expect(this.scope.userFormData).toEqual({selectedRoles: {}, sendPasswordToEmail: false});
            expect(this.scope.formInError).toBeFalsy();
            expect(this.scope.errors).toEqual([]);
        });
    });

    describe("Form actions", function () {
        var userResource, onSuccessCallback, onErrorCallback;
        beforeEach(function () {
            userResource = jasmine.createSpyObj('userResource', ['$save']);
            userResource.$save.andCallFake(function (params, success, error) {
                onSuccessCallback = success;
                onErrorCallback = error;
            });
            this.resourceFactory.userResource.andReturn(userResource);
        });

        it("should emit the 'CloseUserForm' when cancelling the form", function () {
            this.scope.cancelUserForm();

            expect(this.scope.$emit).toHaveBeenCalledWith('CloseUserForm');
        });

        describe("Save user", function () {
            var expectedUserParams;
            beforeEach(function () {
                this.scope.userFormData = {
                    username: 'test_username',
                    firstname: 'test_firstname',
                    lastname: 'test_lastname',
                    email: 'test_email',
                    office: {id: 'test_office'},
                    sendPasswordToEmail: true,
                    selectedRoles: {'123': {}, '456': {}}
                };
                expectedUserParams = _.extend(
                    _.pick(this.scope.userFormData, ['username', 'firstname', 'lastname', 'email', 'sendPasswordToEmail']),
                    { officeId: 'test_office', roles: [123, 456] }
                );

                this.scope.submitUserForm();
            });

            it("should emit the 'SubmitUserFormStart' event", function () {
                expect(this.scope.$emit).toHaveBeenCalledWith('SubmitUserFormStart');
            });
            it("should create and save a new user resource", function () {
                expect(this.resourceFactory.userResource).toHaveBeenCalledWith(expectedUserParams);
                expect(userResource.$save).toHaveBeenCalledWith({}, jasmine.any(Function), jasmine.any(Function));
            });

            describe("User save error handler", function () {
                beforeEach(function () {
                    this.scope.formInError = false;
                    this.scope.errors = [];

                    onErrorCallback({data: {errors: 'test_errors'}});
                });

                it("should flag the form in error", function () {
                    expect(this.scope.formInError).toBeTruthy();
                });
                it("should put the errors in the scope", function () {
                    expect(this.scope.errors).toEqual('test_errors');
                });
                it("should emit the 'SubmitUserFormError' event", function () {
                    expect(this.scope.$emit).toHaveBeenCalledWith('SubmitUserFormError');
                });
            });

            describe("User save success handler", function () {
                var addedUser, existingUser;
                beforeEach(function () {
                    existingUser = {id: 'another_userId'};
                    this.scope.users = [existingUser];
                    addedUser = _.extend(expectedUserParams, {id: 'test_userId'});

                    onSuccessCallback({resourceId: 'test_userId'});
                });

                it("should add the user to the users in the scope", function () {
                    expect(this.scope.users).toEqual([existingUser, addedUser]);
                });
                it("should emit the 'SubmitUserFormSuccess' event", function () {
                    expect(this.scope.$emit).toHaveBeenCalledWith('SubmitUserFormSuccess');
                });
            });
        });
    });
});