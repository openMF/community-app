(function(module) {
  mifosX.models = _.extend(module, {
    roleMap: {
      1: "superuser",
      2: "branchmanager",
      3: "funder"
    }
  });
}(mifosX.models || {}));
