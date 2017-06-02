describe('ViewUserController', function(){

  beforeEach(inject(function($rootScope, $q) {
    this.scope = $rootScope.$new();
    this.routeParams = {id: 'a_user_id'};
    this.route = jasmine.createSpyObj('route', ['reload']);
    this.location = jasmine.createSpyObj('location', ['path']);
    this.resourceFactory = { 
      userListResource: { 
        get: jasmine.createSpy('get').andCallFake(function(params, callback){
          callback('user_data');      
        }),
        update: jasmine.createSpy('update').andCallFake(function(params, formData, callback){
          callback({resourceId: params.userId});
        }),
        delete: jasmine.createSpy('delete').andCallFake(function(params, formData, callback){
          callback();
        })
      }
    };
    this.$modal = jasmine.createSpyObj('$modal', ['open']);
  
    this.controller = new mifosX.controllers.ViewUserController(
      this.scope,
      this.routeParams,
      this.route,
      this.location,
      this.resourceFactory,
      this.$modal);
  }));

  it('should add the user data to the scope from user List Resource', function(){
    expect(this.resourceFactory.userListResource.get).toHaveBeenCalledWith({userId: this.routeParams.id}, jasmine.any(Function));

   expect(this.scope.user).toEqual('user_data'); 
  });

  describe('On open', function(){
    var templateUrl, modalOpenCtrl;

    beforeEach(function(){
      this.scope.open();
      var modalOpenArgs = this.$modal.open.mostRecentCall.args[0];
      templateUrl = modalOpenArgs.templateUrl;
      modalOpenCtrl = modalOpenArgs.controller;
    });

    it('$modal should be called with the "password.html"', function(){
      expect(templateUrl).toEqual('password.html');
    });

    describe('ModalOpenCtrl', function(){
      var $modalInstance;
      
      beforeEach(function(){
        $modalInstance = jasmine.createSpyObj('$modalInstance', ['close','dismiss']);
        modalOpenCtrl(this.scope, $modalInstance);
      });

      describe('On Save', function(){
        describe('When userId is equal', function(){
          beforeEach(function(){
            this.scope.currentSession = { user: { userId : 'a_user_id' } };
            this.scope.logout = jasmine.createSpy('logout');
            this.scope.save();
          });

          it('should close the modal', function(){
            expect($modalInstance.close).toHaveBeenCalledWith('activate'); 
          });
          it('should call the logout method when equal to current user', function(){
            expect(this.scope.logout).toHaveBeenCalled();
          });
        });

        describe('When userId is not equal', function(){
          beforeEach(function(){
            this.scope.currentSession = { user: { userId : 'a_different_user_id' } };
            this.scope.save();
          });
          it('should reload', function(){
            expect(this.route.reload).toHaveBeenCalled();
          });

        });
      });

      it('should dismiss the modal on close', function(){
        this.scope.cancel();
        expect($modalInstance.dismiss).toHaveBeenCalledWith('cancel'); 
      });
    });
  });

  describe('on delete user', function(){
    var templateUrl, modalDeleteCtrl;

    beforeEach(function(){
      this.scope.deleteuser();
      var modalDeleteArgs = this.$modal.open.mostRecentCall.args[0];
      templateUrl = modalDeleteArgs.templateUrl;
      modalDeleteCtrl = modalDeleteArgs.controller;
    });

    it('$modal should be called with the "deleteuser.html"', function(){
      expect(templateUrl).toEqual('deleteuser.html');
    });

    describe('UserDeleteCtrl', function(){
      var $modalInstance;
      
      beforeEach(function(){
        $modalInstance = jasmine.createSpyObj('$modalInstance', ['close','dismiss']);
        modalDeleteCtrl(this.scope, $modalInstance);
      });

      describe('on delete', function(){
        beforeEach(function(){
          this.scope.delete();
        });
        it('should close the modal', function(){
          expect($modalInstance.close).toHaveBeenCalledWith('delete');
        });

        it('should navagate to the "/users" page', function(){
          expect(this.location.path).toHaveBeenCalledWith('/users');
        });
      });
      
      
      it('should dismiss the modal on close', function(){
        this.scope.cancel();
        expect($modalInstance.dismiss).toHaveBeenCalledWith('cancel'); 
      });
    });
  });


});
