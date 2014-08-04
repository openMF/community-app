describe('UploadClientIdentifierDocumentController', function() {
  var deferedUpload = undefined;

  beforeEach(inject(function($rootScope, $q) {
    this.scope = $rootScope.$new(); 
    this.location = jasmine.createSpyObj('location', ['path']); 
    this.routeParams = {clientId: 'clientId', resourceId: 'resourceId'};   
    this.API_VERSION = 'api_version';
    this.upload = {
      upload: jasmine.createSpy().andCallFake(function(){
        deferedUpload = $q.defer();
        return deferedUpload.promise;    
      })
    }
    this.$rootScope = $rootScope;
    this.controller = new mifosX.controllers.UploadClientIdentifierDocumentController(
      this.scope,
      this.location,
      this.routeParams,
      this.API_VERSION,
      this.upload,
      this.$rootScope  
    ); 
  }));

  it('should put the select file in the scope', function(){
    var file = {name: 'some file'}
    this.scope.onFileSelect ([file]);
    expect(this.scope.file).toBe(file);
  });

  describe('on submit', function(){
    var url;
    beforeEach(function(){
      url = this.$rootScope.hostUrl + this.API_VERSION + '/client_identifiers/' + this.routeParams.resourceId + '/documents';
      this.scope.file = {name: 'some file'}  
      this.scope.formData = 'formData';
    });

    it('should call the upload service', function(){ 
      this.scope.submit();  
      expect(this.upload.upload).toHaveBeenCalledWith({
        url: url,
        data: this.scope.formData,
        file: this.scope.file,
      });
    });

    it('should change the location after file has been uploaded', function(){
      this.scope.submit();
      deferedUpload.resolve('data');
      this.scope.$digest();
      expect(this.location.path).toHaveBeenCalledWith('/viewclient/' + this.routeParams.clientId);
    });
  });
});
