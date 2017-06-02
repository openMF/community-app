if ('undefined' === typeof define) {
	(function() {
		var defs = {},
			resolved = {};

		define = function(id, deps, factory) {
			if (defs[id]) {
				throw new Error('Duplicate definition for ' + id);
			}
			defs[id] = [deps, factory];
		}

		define.amd = {
			bundle: true, // this implementation works only with bundled amd modules
			dynamic: false, // does not support dynamic or async loading
		};

		require = function(id) {
			if (!resolved[id]) {
				if (!defs[id]) {
					throw new Error('No definition for ' + id);
				}
				var deps = defs[id][0];
				var factory = defs[id][1];
				var args = deps.map(require);
				resolved[id] = factory.apply(null, args);
				delete defs[id];
			}
			return resolved[id];
		}
	})();
}
