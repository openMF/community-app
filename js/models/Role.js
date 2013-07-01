(function(module) {
  mifosX.models = _.extend(module, {
    Role: function(data) {
      this.id = data.id;
      this.name = data.name;
      this.description = data.description;
    }
  });
}(mifosX.models || {}));
