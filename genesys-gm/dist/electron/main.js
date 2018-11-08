module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var filename = require("path").join(__dirname, "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		require("fs").readFile(filename, "utf-8", function(err, content) {
/******/ 			if (err) {
/******/ 				if (__webpack_require__.onError) return __webpack_require__.oe(err);
/******/ 				throw err;
/******/ 			}
/******/ 			var chunk = {};
/******/ 			require("vm").runInThisContext(
/******/ 				"(function(exports) {" + content + "\n})",
/******/ 				{ filename: filename }
/******/ 			)(chunk);
/******/ 			hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		var filename = require("path").join(__dirname, "" + hotCurrentHash + ".hot-update.json");
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			require("fs").readFile(filename, "utf-8", function(err, content) {
/******/ 				if (err) return resolve();
/******/ 				try {
/******/ 					var update = JSON.parse(content);
/******/ 				} catch (e) {
/******/ 					return reject(e);
/******/ 				}
/******/ 				resolve(update);
/******/ 			});
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "80df43bd5844f9a9ad3a";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/7zip/index.js":
/*!************************************!*\
  !*** ./node_modules/7zip/index.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(__dirname) {var resolve = __webpack_require__(/*! path */ \"path\").resolve\nvar bin = __webpack_require__(/*! ./package */ \"./node_modules/7zip/package.json\").bin\n\nmodule.exports = map_obj(bin, function(v){\n  return resolve(__dirname, v)\n})\n\nfunction map_obj(obj, fn){\n  return Object.keys(obj).reduce(function(m, k){\n    m[k] = fn(obj[k])\n    return m\n  }, {})\n}\n\n/* WEBPACK VAR INJECTION */}.call(this, \"node_modules/7zip\"))\n\n//# sourceURL=webpack:///./node_modules/7zip/index.js?");

/***/ }),

/***/ "./node_modules/7zip/package.json":
/*!****************************************!*\
  !*** ./node_modules/7zip/package.json ***!
  \****************************************/
/*! exports provided: name, version, description, keywords, repository, bin, main, scripts, license, default */
/***/ (function(module) {

eval("module.exports = {\"name\":\"7zip\",\"version\":\"0.0.6\",\"description\":\"7zip Windows Package via Node.js\",\"keywords\":[\"7z\",\"7zip\",\"7-zip\",\"windows\",\"install\"],\"repository\":\"git@github.com:fritx/win-7zip.git\",\"bin\":{\"7z\":\"7zip-lite/7z.exe\"},\"main\":\"index.js\",\"scripts\":{\"test\":\"mocha\"},\"license\":\"GNU LGPL\"};\n\n//# sourceURL=webpack:///./node_modules/7zip/package.json?");

/***/ }),

/***/ "./node_modules/brace-expansion/index.js":
/*!***********************************************!*\
  !*** ./node_modules/brace-expansion/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var concatMap = __webpack_require__(/*! concat-map */ \"./node_modules/concat-map/index.js\");\nvar balanced = __webpack_require__(/*! balanced-match */ \"./node_modules/brace-expansion/node_modules/balanced-match/index.js\");\n\nmodule.exports = expandTop;\n\nvar escSlash = '\\0SLASH'+Math.random()+'\\0';\nvar escOpen = '\\0OPEN'+Math.random()+'\\0';\nvar escClose = '\\0CLOSE'+Math.random()+'\\0';\nvar escComma = '\\0COMMA'+Math.random()+'\\0';\nvar escPeriod = '\\0PERIOD'+Math.random()+'\\0';\n\nfunction numeric(str) {\n  return parseInt(str, 10) == str\n    ? parseInt(str, 10)\n    : str.charCodeAt(0);\n}\n\nfunction escapeBraces(str) {\n  return str.split('\\\\\\\\').join(escSlash)\n            .split('\\\\{').join(escOpen)\n            .split('\\\\}').join(escClose)\n            .split('\\\\,').join(escComma)\n            .split('\\\\.').join(escPeriod);\n}\n\nfunction unescapeBraces(str) {\n  return str.split(escSlash).join('\\\\')\n            .split(escOpen).join('{')\n            .split(escClose).join('}')\n            .split(escComma).join(',')\n            .split(escPeriod).join('.');\n}\n\n\n// Basically just str.split(\",\"), but handling cases\n// where we have nested braced sections, which should be\n// treated as individual members, like {a,{b,c},d}\nfunction parseCommaParts(str) {\n  if (!str)\n    return [''];\n\n  var parts = [];\n  var m = balanced('{', '}', str);\n\n  if (!m)\n    return str.split(',');\n\n  var pre = m.pre;\n  var body = m.body;\n  var post = m.post;\n  var p = pre.split(',');\n\n  p[p.length-1] += '{' + body + '}';\n  var postParts = parseCommaParts(post);\n  if (post.length) {\n    p[p.length-1] += postParts.shift();\n    p.push.apply(p, postParts);\n  }\n\n  parts.push.apply(parts, p);\n\n  return parts;\n}\n\nfunction expandTop(str) {\n  if (!str)\n    return [];\n\n  // I don't know why Bash 4.3 does this, but it does.\n  // Anything starting with {} will have the first two bytes preserved\n  // but *only* at the top level, so {},a}b will not expand to anything,\n  // but a{},b}c will be expanded to [a}c,abc].\n  // One could argue that this is a bug in Bash, but since the goal of\n  // this module is to match Bash's rules, we escape a leading {}\n  if (str.substr(0, 2) === '{}') {\n    str = '\\\\{\\\\}' + str.substr(2);\n  }\n\n  return expand(escapeBraces(str), true).map(unescapeBraces);\n}\n\nfunction identity(e) {\n  return e;\n}\n\nfunction embrace(str) {\n  return '{' + str + '}';\n}\nfunction isPadded(el) {\n  return /^-?0\\d/.test(el);\n}\n\nfunction lte(i, y) {\n  return i <= y;\n}\nfunction gte(i, y) {\n  return i >= y;\n}\n\nfunction expand(str, isTop) {\n  var expansions = [];\n\n  var m = balanced('{', '}', str);\n  if (!m || /\\$$/.test(m.pre)) return [str];\n\n  var isNumericSequence = /^-?\\d+\\.\\.-?\\d+(?:\\.\\.-?\\d+)?$/.test(m.body);\n  var isAlphaSequence = /^[a-zA-Z]\\.\\.[a-zA-Z](?:\\.\\.-?\\d+)?$/.test(m.body);\n  var isSequence = isNumericSequence || isAlphaSequence;\n  var isOptions = m.body.indexOf(',') >= 0;\n  if (!isSequence && !isOptions) {\n    // {a},b}\n    if (m.post.match(/,.*\\}/)) {\n      str = m.pre + '{' + m.body + escClose + m.post;\n      return expand(str);\n    }\n    return [str];\n  }\n\n  var n;\n  if (isSequence) {\n    n = m.body.split(/\\.\\./);\n  } else {\n    n = parseCommaParts(m.body);\n    if (n.length === 1) {\n      // x{{a,b}}y ==> x{a}y x{b}y\n      n = expand(n[0], false).map(embrace);\n      if (n.length === 1) {\n        var post = m.post.length\n          ? expand(m.post, false)\n          : [''];\n        return post.map(function(p) {\n          return m.pre + n[0] + p;\n        });\n      }\n    }\n  }\n\n  // at this point, n is the parts, and we know it's not a comma set\n  // with a single entry.\n\n  // no need to expand pre, since it is guaranteed to be free of brace-sets\n  var pre = m.pre;\n  var post = m.post.length\n    ? expand(m.post, false)\n    : [''];\n\n  var N;\n\n  if (isSequence) {\n    var x = numeric(n[0]);\n    var y = numeric(n[1]);\n    var width = Math.max(n[0].length, n[1].length)\n    var incr = n.length == 3\n      ? Math.abs(numeric(n[2]))\n      : 1;\n    var test = lte;\n    var reverse = y < x;\n    if (reverse) {\n      incr *= -1;\n      test = gte;\n    }\n    var pad = n.some(isPadded);\n\n    N = [];\n\n    for (var i = x; test(i, y); i += incr) {\n      var c;\n      if (isAlphaSequence) {\n        c = String.fromCharCode(i);\n        if (c === '\\\\')\n          c = '';\n      } else {\n        c = String(i);\n        if (pad) {\n          var need = width - c.length;\n          if (need > 0) {\n            var z = new Array(need + 1).join('0');\n            if (i < 0)\n              c = '-' + z + c.slice(1);\n            else\n              c = z + c;\n          }\n        }\n      }\n      N.push(c);\n    }\n  } else {\n    N = concatMap(n, function(el) { return expand(el, false) });\n  }\n\n  for (var j = 0; j < N.length; j++) {\n    for (var k = 0; k < post.length; k++) {\n      var expansion = pre + N[j] + post[k];\n      if (!isTop || isSequence || expansion)\n        expansions.push(expansion);\n    }\n  }\n\n  return expansions;\n}\n\n\n\n//# sourceURL=webpack:///./node_modules/brace-expansion/index.js?");

/***/ }),

/***/ "./node_modules/brace-expansion/node_modules/balanced-match/index.js":
/*!***************************************************************************!*\
  !*** ./node_modules/brace-expansion/node_modules/balanced-match/index.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nmodule.exports = balanced;\nfunction balanced(a, b, str) {\n  if (a instanceof RegExp) a = maybeMatch(a, str);\n  if (b instanceof RegExp) b = maybeMatch(b, str);\n\n  var r = range(a, b, str);\n\n  return r && {\n    start: r[0],\n    end: r[1],\n    pre: str.slice(0, r[0]),\n    body: str.slice(r[0] + a.length, r[1]),\n    post: str.slice(r[1] + b.length)\n  };\n}\n\nfunction maybeMatch(reg, str) {\n  var m = str.match(reg);\n  return m ? m[0] : null;\n}\n\nbalanced.range = range;\nfunction range(a, b, str) {\n  var begs, beg, left, right, result;\n  var ai = str.indexOf(a);\n  var bi = str.indexOf(b, ai + 1);\n  var i = ai;\n\n  if (ai >= 0 && bi > 0) {\n    begs = [];\n    left = str.length;\n\n    while (i >= 0 && !result) {\n      if (i == ai) {\n        begs.push(i);\n        ai = str.indexOf(a, i + 1);\n      } else if (begs.length == 1) {\n        result = [ begs.pop(), bi ];\n      } else {\n        beg = begs.pop();\n        if (beg < left) {\n          left = beg;\n          right = bi;\n        }\n\n        bi = str.indexOf(b, i + 1);\n      }\n\n      i = ai < bi && ai >= 0 ? ai : bi;\n    }\n\n    if (begs.length) {\n      result = [ left, right ];\n    }\n  }\n\n  return result;\n}\n\n\n//# sourceURL=webpack:///./node_modules/brace-expansion/node_modules/balanced-match/index.js?");

/***/ }),

/***/ "./node_modules/concat-map/index.js":
/*!******************************************!*\
  !*** ./node_modules/concat-map/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function (xs, fn) {\n    var res = [];\n    for (var i = 0; i < xs.length; i++) {\n        var x = fn(xs[i], i);\n        if (isArray(x)) res.push.apply(res, x);\n        else res.push(x);\n    }\n    return res;\n};\n\nvar isArray = Array.isArray || function (xs) {\n    return Object.prototype.toString.call(xs) === '[object Array]';\n};\n\n\n//# sourceURL=webpack:///./node_modules/concat-map/index.js?");

/***/ }),

/***/ "./node_modules/cross-unzip/index.js":
/*!*******************************************!*\
  !*** ./node_modules/cross-unzip/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar spawn = __webpack_require__(/*! child_process */ \"child_process\").spawn\nvar slice = Array.prototype.slice\n\nvar unzip = process.platform === 'win32' ? forWin32 : forUnix\nunzip.unzip = unzip\nmodule.exports = unzip\n\n// todo: progress feedback\n\n// https://github.com/fritx/win-7zip\nfunction forWin32 (inPath, outPath, callback) {\n  var _7z = __webpack_require__(/*! 7zip */ \"./node_modules/7zip/index.js\")['7z']\n\n  // very 奇葩\n  // eg. 7z x archive.zip -oc:\\Doc\n  run(_7z, ['x', inPath, '-y', '-o' + outPath], callback)\n}\n\nfunction forUnix (inPath, outPath, callback) {\n  run('unzip', ['-o', inPath, '-d', outPath], callback)\n}\n\n// https://nodejs.org/api/child_process.html#child_process_event_error\n// Note that the 'exit' event may or may not fire after an error has occurred.\n// If you are listening to both the 'exit' and 'error' events,\n// it is important to guard against accidentally invoking handler functions multiple times.\nfunction run (bin, args, callback) {\n  callback = onceify(callback)\n\n  var prc = spawn(bin, args, {\n    stdio: 'ignore'\n  })\n  prc.on('error', function (err) {\n    callback(err)\n  })\n  prc.on('exit', function (code) {\n    callback(code ? new Error('Exited with code ' + code) : null)\n  })\n}\n\n// http://stackoverflow.com/questions/30234908/javascript-v8-optimisation-and-leaking-arguments\n// javascript V8 optimisation and “leaking arguments”\n// making callback to be invoked only once\nfunction onceify (fn) {\n  var called = false\n  return function () {\n    if (called) return\n    called = true\n    fn.apply(this, slice.call(arguments)) // slice arguments\n  }\n}\n\n\n//# sourceURL=webpack:///./node_modules/cross-unzip/index.js?");

/***/ }),

/***/ "./node_modules/debug/src/browser.js":
/*!*******************************************!*\
  !*** ./node_modules/debug/src/browser.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * This is the web browser implementation of `debug()`.\n *\n * Expose `debug()` as the module.\n */\n\nexports = module.exports = __webpack_require__(/*! ./debug */ \"./node_modules/debug/src/debug.js\");\nexports.log = log;\nexports.formatArgs = formatArgs;\nexports.save = save;\nexports.load = load;\nexports.useColors = useColors;\nexports.storage = 'undefined' != typeof chrome\n               && 'undefined' != typeof chrome.storage\n                  ? chrome.storage.local\n                  : localstorage();\n\n/**\n * Colors.\n */\n\nexports.colors = [\n  'lightseagreen',\n  'forestgreen',\n  'goldenrod',\n  'dodgerblue',\n  'darkorchid',\n  'crimson'\n];\n\n/**\n * Currently only WebKit-based Web Inspectors, Firefox >= v31,\n * and the Firebug extension (any Firefox version) are known\n * to support \"%c\" CSS customizations.\n *\n * TODO: add a `localStorage` variable to explicitly enable/disable colors\n */\n\nfunction useColors() {\n  // NB: In an Electron preload script, document will be defined but not fully\n  // initialized. Since we know we're in Chrome, we'll just detect this case\n  // explicitly\n  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {\n    return true;\n  }\n\n  // is webkit? http://stackoverflow.com/a/16459606/376773\n  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632\n  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||\n    // is firebug? http://stackoverflow.com/a/398120/376773\n    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||\n    // is firefox >= v31?\n    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages\n    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\\/(\\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||\n    // double check webkit in userAgent just in case we are in a worker\n    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\\/(\\d+)/));\n}\n\n/**\n * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.\n */\n\nexports.formatters.j = function(v) {\n  try {\n    return JSON.stringify(v);\n  } catch (err) {\n    return '[UnexpectedJSONParseError]: ' + err.message;\n  }\n};\n\n\n/**\n * Colorize log arguments if enabled.\n *\n * @api public\n */\n\nfunction formatArgs(args) {\n  var useColors = this.useColors;\n\n  args[0] = (useColors ? '%c' : '')\n    + this.namespace\n    + (useColors ? ' %c' : ' ')\n    + args[0]\n    + (useColors ? '%c ' : ' ')\n    + '+' + exports.humanize(this.diff);\n\n  if (!useColors) return;\n\n  var c = 'color: ' + this.color;\n  args.splice(1, 0, c, 'color: inherit')\n\n  // the final \"%c\" is somewhat tricky, because there could be other\n  // arguments passed either before or after the %c, so we need to\n  // figure out the correct index to insert the CSS into\n  var index = 0;\n  var lastC = 0;\n  args[0].replace(/%[a-zA-Z%]/g, function(match) {\n    if ('%%' === match) return;\n    index++;\n    if ('%c' === match) {\n      // we only are interested in the *last* %c\n      // (the user may have provided their own)\n      lastC = index;\n    }\n  });\n\n  args.splice(lastC, 0, c);\n}\n\n/**\n * Invokes `console.log()` when available.\n * No-op when `console.log` is not a \"function\".\n *\n * @api public\n */\n\nfunction log() {\n  // this hackery is required for IE8/9, where\n  // the `console.log` function doesn't have 'apply'\n  return 'object' === typeof console\n    && console.log\n    && Function.prototype.apply.call(console.log, console, arguments);\n}\n\n/**\n * Save `namespaces`.\n *\n * @param {String} namespaces\n * @api private\n */\n\nfunction save(namespaces) {\n  try {\n    if (null == namespaces) {\n      exports.storage.removeItem('debug');\n    } else {\n      exports.storage.debug = namespaces;\n    }\n  } catch(e) {}\n}\n\n/**\n * Load `namespaces`.\n *\n * @return {String} returns the previously persisted debug modes\n * @api private\n */\n\nfunction load() {\n  var r;\n  try {\n    r = exports.storage.debug;\n  } catch(e) {}\n\n  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG\n  if (!r && typeof process !== 'undefined' && 'env' in process) {\n    r = process.env.DEBUG;\n  }\n\n  return r;\n}\n\n/**\n * Enable namespaces listed in `localStorage.debug` initially.\n */\n\nexports.enable(load());\n\n/**\n * Localstorage attempts to return the localstorage.\n *\n * This is necessary because safari throws\n * when a user disables cookies/localstorage\n * and you attempt to access it.\n *\n * @return {LocalStorage}\n * @api private\n */\n\nfunction localstorage() {\n  try {\n    return window.localStorage;\n  } catch (e) {}\n}\n\n\n//# sourceURL=webpack:///./node_modules/debug/src/browser.js?");

/***/ }),

/***/ "./node_modules/debug/src/debug.js":
/*!*****************************************!*\
  !*** ./node_modules/debug/src/debug.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\n/**\n * This is the common logic for both the Node.js and web browser\n * implementations of `debug()`.\n *\n * Expose `debug()` as the module.\n */\n\nexports = module.exports = createDebug.debug = createDebug['default'] = createDebug;\nexports.coerce = coerce;\nexports.disable = disable;\nexports.enable = enable;\nexports.enabled = enabled;\nexports.humanize = __webpack_require__(/*! ms */ \"./node_modules/ms/index.js\");\n\n/**\n * The currently active debug mode names, and names to skip.\n */\n\nexports.names = [];\nexports.skips = [];\n\n/**\n * Map of special \"%n\" handling functions, for the debug \"format\" argument.\n *\n * Valid key names are a single, lower or upper-case letter, i.e. \"n\" and \"N\".\n */\n\nexports.formatters = {};\n\n/**\n * Previous log timestamp.\n */\n\nvar prevTime;\n\n/**\n * Select a color.\n * @param {String} namespace\n * @return {Number}\n * @api private\n */\n\nfunction selectColor(namespace) {\n  var hash = 0, i;\n\n  for (i in namespace) {\n    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);\n    hash |= 0; // Convert to 32bit integer\n  }\n\n  return exports.colors[Math.abs(hash) % exports.colors.length];\n}\n\n/**\n * Create a debugger with the given `namespace`.\n *\n * @param {String} namespace\n * @return {Function}\n * @api public\n */\n\nfunction createDebug(namespace) {\n\n  function debug() {\n    // disabled?\n    if (!debug.enabled) return;\n\n    var self = debug;\n\n    // set `diff` timestamp\n    var curr = +new Date();\n    var ms = curr - (prevTime || curr);\n    self.diff = ms;\n    self.prev = prevTime;\n    self.curr = curr;\n    prevTime = curr;\n\n    // turn the `arguments` into a proper Array\n    var args = new Array(arguments.length);\n    for (var i = 0; i < args.length; i++) {\n      args[i] = arguments[i];\n    }\n\n    args[0] = exports.coerce(args[0]);\n\n    if ('string' !== typeof args[0]) {\n      // anything else let's inspect with %O\n      args.unshift('%O');\n    }\n\n    // apply any `formatters` transformations\n    var index = 0;\n    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {\n      // if we encounter an escaped % then don't increase the array index\n      if (match === '%%') return match;\n      index++;\n      var formatter = exports.formatters[format];\n      if ('function' === typeof formatter) {\n        var val = args[index];\n        match = formatter.call(self, val);\n\n        // now we need to remove `args[index]` since it's inlined in the `format`\n        args.splice(index, 1);\n        index--;\n      }\n      return match;\n    });\n\n    // apply env-specific formatting (colors, etc.)\n    exports.formatArgs.call(self, args);\n\n    var logFn = debug.log || exports.log || console.log.bind(console);\n    logFn.apply(self, args);\n  }\n\n  debug.namespace = namespace;\n  debug.enabled = exports.enabled(namespace);\n  debug.useColors = exports.useColors();\n  debug.color = selectColor(namespace);\n\n  // env-specific initialization logic for debug instances\n  if ('function' === typeof exports.init) {\n    exports.init(debug);\n  }\n\n  return debug;\n}\n\n/**\n * Enables a debug mode by namespaces. This can include modes\n * separated by a colon and wildcards.\n *\n * @param {String} namespaces\n * @api public\n */\n\nfunction enable(namespaces) {\n  exports.save(namespaces);\n\n  exports.names = [];\n  exports.skips = [];\n\n  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\\s,]+/);\n  var len = split.length;\n\n  for (var i = 0; i < len; i++) {\n    if (!split[i]) continue; // ignore empty strings\n    namespaces = split[i].replace(/\\*/g, '.*?');\n    if (namespaces[0] === '-') {\n      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));\n    } else {\n      exports.names.push(new RegExp('^' + namespaces + '$'));\n    }\n  }\n}\n\n/**\n * Disable debug output.\n *\n * @api public\n */\n\nfunction disable() {\n  exports.enable('');\n}\n\n/**\n * Returns true if the given mode name is enabled, false otherwise.\n *\n * @param {String} name\n * @return {Boolean}\n * @api public\n */\n\nfunction enabled(name) {\n  var i, len;\n  for (i = 0, len = exports.skips.length; i < len; i++) {\n    if (exports.skips[i].test(name)) {\n      return false;\n    }\n  }\n  for (i = 0, len = exports.names.length; i < len; i++) {\n    if (exports.names[i].test(name)) {\n      return true;\n    }\n  }\n  return false;\n}\n\n/**\n * Coerce `val`.\n *\n * @param {Mixed} val\n * @return {Mixed}\n * @api private\n */\n\nfunction coerce(val) {\n  if (val instanceof Error) return val.stack || val.message;\n  return val;\n}\n\n\n//# sourceURL=webpack:///./node_modules/debug/src/debug.js?");

/***/ }),

/***/ "./node_modules/debug/src/index.js":
/*!*****************************************!*\
  !*** ./node_modules/debug/src/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Detect Electron renderer process, which is node, but we should\n * treat as a browser.\n */\n\nif (typeof process !== 'undefined' && process.type === 'renderer') {\n  module.exports = __webpack_require__(/*! ./browser.js */ \"./node_modules/debug/src/browser.js\");\n} else {\n  module.exports = __webpack_require__(/*! ./node.js */ \"./node_modules/debug/src/node.js\");\n}\n\n\n//# sourceURL=webpack:///./node_modules/debug/src/index.js?");

/***/ }),

/***/ "./node_modules/debug/src/node.js":
/*!****************************************!*\
  !*** ./node_modules/debug/src/node.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * Module dependencies.\n */\n\nvar tty = __webpack_require__(/*! tty */ \"tty\");\nvar util = __webpack_require__(/*! util */ \"util\");\n\n/**\n * This is the Node.js implementation of `debug()`.\n *\n * Expose `debug()` as the module.\n */\n\nexports = module.exports = __webpack_require__(/*! ./debug */ \"./node_modules/debug/src/debug.js\");\nexports.init = init;\nexports.log = log;\nexports.formatArgs = formatArgs;\nexports.save = save;\nexports.load = load;\nexports.useColors = useColors;\n\n/**\n * Colors.\n */\n\nexports.colors = [6, 2, 3, 4, 5, 1];\n\n/**\n * Build up the default `inspectOpts` object from the environment variables.\n *\n *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js\n */\n\nexports.inspectOpts = Object.keys(process.env).filter(function (key) {\n  return /^debug_/i.test(key);\n}).reduce(function (obj, key) {\n  // camel-case\n  var prop = key\n    .substring(6)\n    .toLowerCase()\n    .replace(/_([a-z])/g, function (_, k) { return k.toUpperCase() });\n\n  // coerce string value into JS value\n  var val = process.env[key];\n  if (/^(yes|on|true|enabled)$/i.test(val)) val = true;\n  else if (/^(no|off|false|disabled)$/i.test(val)) val = false;\n  else if (val === 'null') val = null;\n  else val = Number(val);\n\n  obj[prop] = val;\n  return obj;\n}, {});\n\n/**\n * The file descriptor to write the `debug()` calls to.\n * Set the `DEBUG_FD` env variable to override with another value. i.e.:\n *\n *   $ DEBUG_FD=3 node script.js 3>debug.log\n */\n\nvar fd = parseInt(process.env.DEBUG_FD, 10) || 2;\n\nif (1 !== fd && 2 !== fd) {\n  util.deprecate(function(){}, 'except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)')()\n}\n\nvar stream = 1 === fd ? process.stdout :\n             2 === fd ? process.stderr :\n             createWritableStdioStream(fd);\n\n/**\n * Is stdout a TTY? Colored output is enabled when `true`.\n */\n\nfunction useColors() {\n  return 'colors' in exports.inspectOpts\n    ? Boolean(exports.inspectOpts.colors)\n    : tty.isatty(fd);\n}\n\n/**\n * Map %o to `util.inspect()`, all on a single line.\n */\n\nexports.formatters.o = function(v) {\n  this.inspectOpts.colors = this.useColors;\n  return util.inspect(v, this.inspectOpts)\n    .split('\\n').map(function(str) {\n      return str.trim()\n    }).join(' ');\n};\n\n/**\n * Map %o to `util.inspect()`, allowing multiple lines if needed.\n */\n\nexports.formatters.O = function(v) {\n  this.inspectOpts.colors = this.useColors;\n  return util.inspect(v, this.inspectOpts);\n};\n\n/**\n * Adds ANSI color escape codes if enabled.\n *\n * @api public\n */\n\nfunction formatArgs(args) {\n  var name = this.namespace;\n  var useColors = this.useColors;\n\n  if (useColors) {\n    var c = this.color;\n    var prefix = '  \\u001b[3' + c + ';1m' + name + ' ' + '\\u001b[0m';\n\n    args[0] = prefix + args[0].split('\\n').join('\\n' + prefix);\n    args.push('\\u001b[3' + c + 'm+' + exports.humanize(this.diff) + '\\u001b[0m');\n  } else {\n    args[0] = new Date().toUTCString()\n      + ' ' + name + ' ' + args[0];\n  }\n}\n\n/**\n * Invokes `util.format()` with the specified arguments and writes to `stream`.\n */\n\nfunction log() {\n  return stream.write(util.format.apply(util, arguments) + '\\n');\n}\n\n/**\n * Save `namespaces`.\n *\n * @param {String} namespaces\n * @api private\n */\n\nfunction save(namespaces) {\n  if (null == namespaces) {\n    // If you set a process.env field to null or undefined, it gets cast to the\n    // string 'null' or 'undefined'. Just delete instead.\n    delete process.env.DEBUG;\n  } else {\n    process.env.DEBUG = namespaces;\n  }\n}\n\n/**\n * Load `namespaces`.\n *\n * @return {String} returns the previously persisted debug modes\n * @api private\n */\n\nfunction load() {\n  return process.env.DEBUG;\n}\n\n/**\n * Copied from `node/src/node.js`.\n *\n * XXX: It's lame that node doesn't expose this API out-of-the-box. It also\n * relies on the undocumented `tty_wrap.guessHandleType()` which is also lame.\n */\n\nfunction createWritableStdioStream (fd) {\n  var stream;\n  var tty_wrap = process.binding('tty_wrap');\n\n  // Note stream._type is used for test-module-load-list.js\n\n  switch (tty_wrap.guessHandleType(fd)) {\n    case 'TTY':\n      stream = new tty.WriteStream(fd);\n      stream._type = 'tty';\n\n      // Hack to have stream not keep the event loop alive.\n      // See https://github.com/joyent/node/issues/1726\n      if (stream._handle && stream._handle.unref) {\n        stream._handle.unref();\n      }\n      break;\n\n    case 'FILE':\n      var fs = __webpack_require__(/*! fs */ \"fs\");\n      stream = new fs.SyncWriteStream(fd, { autoClose: false });\n      stream._type = 'fs';\n      break;\n\n    case 'PIPE':\n    case 'TCP':\n      var net = __webpack_require__(/*! net */ \"net\");\n      stream = new net.Socket({\n        fd: fd,\n        readable: false,\n        writable: true\n      });\n\n      // FIXME Should probably have an option in net.Socket to create a\n      // stream from an existing fd which is writable only. But for now\n      // we'll just add this hack and set the `readable` member to false.\n      // Test: ./node test/fixtures/echo.js < /etc/passwd\n      stream.readable = false;\n      stream.read = null;\n      stream._type = 'pipe';\n\n      // FIXME Hack to have stream not keep the event loop alive.\n      // See https://github.com/joyent/node/issues/1726\n      if (stream._handle && stream._handle.unref) {\n        stream._handle.unref();\n      }\n      break;\n\n    default:\n      // Probably an error on in uv_guess_handle()\n      throw new Error('Implement me. Unknown stream file type!');\n  }\n\n  // For supporting legacy API we put the FD here.\n  stream.fd = fd;\n\n  stream._isStdio = true;\n\n  return stream;\n}\n\n/**\n * Init logic for `debug` instances.\n *\n * Create a new `inspectOpts` object in case `useColors` is set\n * differently for a particular `debug` instance.\n */\n\nfunction init (debug) {\n  debug.inspectOpts = {};\n\n  var keys = Object.keys(exports.inspectOpts);\n  for (var i = 0; i < keys.length; i++) {\n    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];\n  }\n}\n\n/**\n * Enable namespaces listed in `process.env.DEBUG` initially.\n */\n\nexports.enable(load());\n\n\n//# sourceURL=webpack:///./node_modules/debug/src/node.js?");

/***/ }),

/***/ "./node_modules/electron-debug sync recursive":
/*!******************************************!*\
  !*** ./node_modules/electron-debug sync ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function webpackEmptyContext(req) {\n\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\te.code = 'MODULE_NOT_FOUND';\n\tthrow e;\n}\nwebpackEmptyContext.keys = function() { return []; };\nwebpackEmptyContext.resolve = webpackEmptyContext;\nmodule.exports = webpackEmptyContext;\nwebpackEmptyContext.id = \"./node_modules/electron-debug sync recursive\";\n\n//# sourceURL=webpack:///./node_modules/electron-debug_sync?");

/***/ }),

/***/ "./node_modules/electron-debug/index.js":
/*!**********************************************!*\
  !*** ./node_modules/electron-debug/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nconst electron = __webpack_require__(/*! electron */ \"electron\");\nconst localShortcut = __webpack_require__(/*! electron-localshortcut */ \"./node_modules/electron-localshortcut/index.js\");\nconst isDev = __webpack_require__(/*! electron-is-dev */ \"./node_modules/electron-is-dev/index.js\");\n\nconst app = electron.app;\nconst BrowserWindow = electron.BrowserWindow;\nconst isMacOS = process.platform === 'darwin';\n\nfunction devTools(win) {\n\twin = win || BrowserWindow.getFocusedWindow();\n\n\tif (win) {\n\t\twin.toggleDevTools();\n\t}\n}\n\nfunction openDevTools(win, showDevTools) {\n\twin = win || BrowserWindow.getFocusedWindow();\n\n\tif (win) {\n\t\tconst mode = showDevTools === true ? undefined : showDevTools;\n\t\twin.webContents.openDevTools({mode});\n\t}\n}\n\nfunction refresh(win) {\n\twin = win || BrowserWindow.getFocusedWindow();\n\n\tif (win) {\n\t\twin.webContents.reloadIgnoringCache();\n\t}\n}\n\nfunction inspectElements() {\n\tconst win = BrowserWindow.getFocusedWindow();\n\tconst inspect = () => {\n\t\twin.devToolsWebContents.executeJavaScript('DevToolsAPI.enterInspectElementMode()');\n\t};\n\n\tif (win) {\n\t\tif (win.webContents.isDevToolsOpened()) {\n\t\t\tinspect();\n\t\t} else {\n\t\t\twin.webContents.on('devtools-opened', inspect);\n\t\t\twin.openDevTools();\n\t\t}\n\t}\n}\n\nconst addExtensionIfInstalled = (name, getPath) => {\n\tconst isExtensionInstalled = name => {\n\t\treturn BrowserWindow.getDevToolsExtensions &&\n\t\t\t{}.hasOwnProperty.call(BrowserWindow.getDevToolsExtensions(), name);\n\t};\n\n\ttry {\n\t\tif (!isExtensionInstalled(name)) {\n\t\t\tBrowserWindow.addDevToolsExtension(getPath(name));\n\t\t}\n\t} catch (err) {}\n};\n\nmodule.exports = opts => {\n\topts = Object.assign({\n\t\tenabled: null,\n\t\tshowDevTools: false\n\t}, opts);\n\n\tif (opts.enabled === false || (opts.enabled === null && !isDev)) {\n\t\treturn;\n\t}\n\n\tapp.on('browser-window-created', (e, win) => {\n\t\tif (opts.showDevTools) {\n\t\t\topenDevTools(win, opts.showDevTools);\n\t\t}\n\t});\n\n\tapp.on('ready', () => {\n\t\taddExtensionIfInstalled('devtron', name => __webpack_require__(\"./node_modules/electron-debug sync recursive\")(name).path);\n\t\t// TODO: Use this when https://github.com/firejune/electron-react-devtools/pull/6 is out\n\t\t// addExtensionIfInstalled('electron-react-devtools', name => require(name).path);\n\t\taddExtensionIfInstalled('electron-react-devtools', name => __webpack_require__(/*! path */ \"path\").dirname(/*require.resolve*/(__webpack_require__(\"./node_modules/electron-debug sync recursive\").resolve(name))));\n\n\t\tlocalShortcut.register('CmdOrCtrl+Shift+C', inspectElements);\n\t\tlocalShortcut.register(isMacOS ? 'Cmd+Alt+I' : 'Ctrl+Shift+I', devTools);\n\t\tlocalShortcut.register('F12', devTools);\n\n\t\tlocalShortcut.register('CmdOrCtrl+R', refresh);\n\t\tlocalShortcut.register('F5', refresh);\n\t});\n};\n\nmodule.exports.refresh = refresh;\nmodule.exports.devTools = devTools;\nmodule.exports.openDevTools = openDevTools;\n\n\n//# sourceURL=webpack:///./node_modules/electron-debug/index.js?");

/***/ }),

/***/ "./node_modules/electron-devtools-installer/dist/downloadChromeExtension.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/electron-devtools-installer/dist/downloadChromeExtension.js ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _fs = __webpack_require__(/*! fs */ \"fs\");\n\nvar _fs2 = _interopRequireDefault(_fs);\n\nvar _path = __webpack_require__(/*! path */ \"path\");\n\nvar _path2 = _interopRequireDefault(_path);\n\nvar _rimraf = __webpack_require__(/*! rimraf */ \"./node_modules/rimraf/rimraf.js\");\n\nvar _rimraf2 = _interopRequireDefault(_rimraf);\n\nvar _crossUnzip = __webpack_require__(/*! cross-unzip */ \"./node_modules/cross-unzip/index.js\");\n\nvar _crossUnzip2 = _interopRequireDefault(_crossUnzip);\n\nvar _utils = __webpack_require__(/*! ./utils */ \"./node_modules/electron-devtools-installer/dist/utils.js\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar downloadChromeExtension = function downloadChromeExtension(chromeStoreID, forceDownload) {\n  var attempts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5;\n\n  var extensionsStore = (0, _utils.getPath)();\n  if (!_fs2.default.existsSync(extensionsStore)) {\n    _fs2.default.mkdirSync(extensionsStore);\n  }\n  var extensionFolder = _path2.default.resolve(extensionsStore + '/' + chromeStoreID);\n  return new Promise(function (resolve, reject) {\n    if (!_fs2.default.existsSync(extensionFolder) || forceDownload) {\n      if (_fs2.default.existsSync(extensionFolder)) {\n        _rimraf2.default.sync(extensionFolder);\n      }\n      var fileURL = 'https://clients2.google.com/service/update2/crx?response=redirect&x=id%3D' + chromeStoreID + '%26uc&prodversion=32'; // eslint-disable-line\n      var filePath = _path2.default.resolve(extensionFolder + '.crx');\n      (0, _utils.downloadFile)(fileURL, filePath).then(function () {\n        (0, _crossUnzip2.default)(filePath, extensionFolder, function (err) {\n          if (err && !_fs2.default.existsSync(_path2.default.resolve(extensionFolder, 'manifest.json'))) {\n            return reject(err);\n          }\n          (0, _utils.changePermissions)(extensionFolder, 755);\n          resolve(extensionFolder);\n        });\n      }).catch(function (err) {\n        console.log('Failed to fetch extension, trying ' + (attempts - 1) + ' more times'); // eslint-disable-line\n        if (attempts <= 1) {\n          return reject(err);\n        }\n        setTimeout(function () {\n          downloadChromeExtension(chromeStoreID, forceDownload, attempts - 1).then(resolve).catch(reject);\n        }, 200);\n      });\n    } else {\n      resolve(extensionFolder);\n    }\n  });\n};\n\nexports.default = downloadChromeExtension;\n\n//# sourceURL=webpack:///./node_modules/electron-devtools-installer/dist/downloadChromeExtension.js?");

/***/ }),

/***/ "./node_modules/electron-devtools-installer/dist/index.js":
/*!****************************************************************!*\
  !*** ./node_modules/electron-devtools-installer/dist/index.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.MOBX_DEVTOOLS = exports.APOLLO_DEVELOPER_TOOLS = exports.CYCLEJS_DEVTOOL = exports.REACT_PERF = exports.REDUX_DEVTOOLS = exports.VUEJS_DEVTOOLS = exports.ANGULARJS_BATARANG = exports.JQUERY_DEBUGGER = exports.BACKBONE_DEBUGGER = exports.REACT_DEVELOPER_TOOLS = exports.EMBER_INSPECTOR = undefined;\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\nvar _electron = __webpack_require__(/*! electron */ \"electron\");\n\nvar _electron2 = _interopRequireDefault(_electron);\n\nvar _fs = __webpack_require__(/*! fs */ \"fs\");\n\nvar _fs2 = _interopRequireDefault(_fs);\n\nvar _path = __webpack_require__(/*! path */ \"path\");\n\nvar _path2 = _interopRequireDefault(_path);\n\nvar _semver = __webpack_require__(/*! semver */ \"./node_modules/semver/semver.js\");\n\nvar _semver2 = _interopRequireDefault(_semver);\n\nvar _downloadChromeExtension = __webpack_require__(/*! ./downloadChromeExtension */ \"./node_modules/electron-devtools-installer/dist/downloadChromeExtension.js\");\n\nvar _downloadChromeExtension2 = _interopRequireDefault(_downloadChromeExtension);\n\nvar _utils = __webpack_require__(/*! ./utils */ \"./node_modules/electron-devtools-installer/dist/utils.js\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\nvar _ref = _electron.remote || _electron2.default,\n    BrowserWindow = _ref.BrowserWindow;\n\nvar IDMap = {};\nvar IDMapPath = _path2.default.resolve((0, _utils.getPath)(), 'IDMap.json');\nif (_fs2.default.existsSync(IDMapPath)) {\n  try {\n    IDMap = JSON.parse(_fs2.default.readFileSync(IDMapPath, 'utf8'));\n  } catch (err) {\n    console.error('electron-devtools-installer: Invalid JSON present in the IDMap file');\n  }\n}\n\nvar install = function install(extensionReference) {\n  var forceDownload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;\n\n  if (Array.isArray(extensionReference)) {\n    return Promise.all(extensionReference.map(function (extension) {\n      return install(extension, forceDownload);\n    }));\n  }\n  var chromeStoreID = void 0;\n  if ((typeof extensionReference === 'undefined' ? 'undefined' : _typeof(extensionReference)) === 'object' && extensionReference.id) {\n    chromeStoreID = extensionReference.id;\n    var electronVersion = process.versions.electron.split('-')[0];\n    if (!_semver2.default.satisfies(electronVersion, extensionReference.electron)) {\n      return Promise.reject(new Error('Version of Electron: ' + electronVersion + ' does not match required range ' + extensionReference.electron + ' for extension ' + chromeStoreID) // eslint-disable-line\n      );\n    }\n  } else if (typeof extensionReference === 'string') {\n    chromeStoreID = extensionReference;\n  } else {\n    return Promise.reject(new Error('Invalid extensionReference passed in: \"' + extensionReference + '\"'));\n  }\n  var extensionName = IDMap[chromeStoreID];\n  var extensionInstalled = extensionName && BrowserWindow.getDevToolsExtensions && BrowserWindow.getDevToolsExtensions()[extensionName];\n  if (!forceDownload && extensionInstalled) {\n    return Promise.resolve(IDMap[chromeStoreID]);\n  }\n  return (0, _downloadChromeExtension2.default)(chromeStoreID, forceDownload).then(function (extensionFolder) {\n    // Use forceDownload, but already installed\n    if (extensionInstalled) {\n      BrowserWindow.removeDevToolsExtension(extensionName);\n    }\n    var name = BrowserWindow.addDevToolsExtension(extensionFolder); // eslint-disable-line\n    _fs2.default.writeFileSync(IDMapPath, JSON.stringify(Object.assign(IDMap, _defineProperty({}, chromeStoreID, name))));\n    return Promise.resolve(name);\n  });\n};\n\nexports.default = install;\nvar EMBER_INSPECTOR = exports.EMBER_INSPECTOR = {\n  id: 'bmdblncegkenkacieihfhpjfppoconhi',\n  electron: '>=1.2.1'\n};\nvar REACT_DEVELOPER_TOOLS = exports.REACT_DEVELOPER_TOOLS = {\n  id: 'fmkadmapgofadopljbjfkapdkoienihi',\n  electron: '>=1.2.1'\n};\nvar BACKBONE_DEBUGGER = exports.BACKBONE_DEBUGGER = {\n  id: 'bhljhndlimiafopmmhjlgfpnnchjjbhd',\n  electron: '>=1.2.1'\n};\nvar JQUERY_DEBUGGER = exports.JQUERY_DEBUGGER = {\n  id: 'dbhhnnnpaeobfddmlalhnehgclcmjimi',\n  electron: '>=1.2.1'\n};\nvar ANGULARJS_BATARANG = exports.ANGULARJS_BATARANG = {\n  id: 'ighdmehidhipcmcojjgiloacoafjmpfk',\n  electron: '>=1.2.1'\n};\nvar VUEJS_DEVTOOLS = exports.VUEJS_DEVTOOLS = {\n  id: 'nhdogjmejiglipccpnnnanhbledajbpd',\n  electron: '>=1.2.1'\n};\nvar REDUX_DEVTOOLS = exports.REDUX_DEVTOOLS = {\n  id: 'lmhkpmbekcpmknklioeibfkpmmfibljd',\n  electron: '>=1.2.1'\n};\nvar REACT_PERF = exports.REACT_PERF = {\n  id: 'hacmcodfllhbnekmghgdlplbdnahmhmm',\n  electron: '>=1.2.6'\n};\nvar CYCLEJS_DEVTOOL = exports.CYCLEJS_DEVTOOL = {\n  id: 'dfgplfmhhmdekalbpejekgfegkonjpfp',\n  electron: '>=1.2.1'\n};\nvar APOLLO_DEVELOPER_TOOLS = exports.APOLLO_DEVELOPER_TOOLS = {\n  id: 'jdkknkkbebbapilgoeccciglkfbmbnfm',\n  electron: '>=1.2.1'\n};\nvar MOBX_DEVTOOLS = exports.MOBX_DEVTOOLS = {\n  id: 'pfgnfdagidkfgccljigdamigbcnndkod',\n  electron: '>=1.2.1'\n};\n\n//# sourceURL=webpack:///./node_modules/electron-devtools-installer/dist/index.js?");

/***/ }),

/***/ "./node_modules/electron-devtools-installer/dist/utils.js":
/*!****************************************************************!*\
  !*** ./node_modules/electron-devtools-installer/dist/utils.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.changePermissions = exports.downloadFile = exports.getPath = undefined;\n\nvar _electron = __webpack_require__(/*! electron */ \"electron\");\n\nvar _electron2 = _interopRequireDefault(_electron);\n\nvar _fs = __webpack_require__(/*! fs */ \"fs\");\n\nvar _fs2 = _interopRequireDefault(_fs);\n\nvar _path = __webpack_require__(/*! path */ \"path\");\n\nvar _path2 = _interopRequireDefault(_path);\n\nvar _https = __webpack_require__(/*! https */ \"https\");\n\nvar _https2 = _interopRequireDefault(_https);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar getPath = exports.getPath = function getPath() {\n  var savePath = (_electron.remote || _electron2.default).app.getPath('userData');\n  return _path2.default.resolve(savePath + '/extensions');\n};\n\n// Use https.get fallback for Electron < 1.4.5\n\nvar _ref = _electron.remote || _electron2.default,\n    net = _ref.net;\n\nvar request = net ? net.request : _https2.default.get;\n\nvar downloadFile = exports.downloadFile = function downloadFile(from, to) {\n  return new Promise(function (resolve, reject) {\n    var req = request(from);\n    req.on('response', function (res) {\n      // Shouldn't handle redirect with `electron.net`, this is for https.get fallback\n      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {\n        return downloadFile(res.headers.location, to).then(resolve).catch(reject);\n      }\n      res.pipe(_fs2.default.createWriteStream(to)).on('close', resolve);\n    });\n    req.on('error', reject);\n    req.end();\n  });\n};\n\nvar changePermissions = exports.changePermissions = function changePermissions(dir, mode) {\n  var files = _fs2.default.readdirSync(dir);\n  files.forEach(function (file) {\n    var filePath = _path2.default.join(dir, file);\n    _fs2.default.chmodSync(filePath, parseInt(mode, 8));\n    if (_fs2.default.statSync(filePath).isDirectory()) {\n      changePermissions(filePath, mode);\n    }\n  });\n};\n\n//# sourceURL=webpack:///./node_modules/electron-devtools-installer/dist/utils.js?");

/***/ }),

/***/ "./node_modules/electron-is-accelerator/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/electron-is-accelerator/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nconst modifiers = /^(Command|Cmd|Control|Ctrl|CommandOrControl|CmdOrCtrl|Alt|Option|AltGr|Shift|Super)$/;\nconst keyCodes = /^([0-9A-Z)!@#$%^&*(:+<_>?~{|}\";=,\\-./`[\\\\\\]']|F1*[1-9]|F10|F2[0-4]|Plus|Space|Tab|Backspace|Delete|Insert|Return|Enter|Up|Down|Left|Right|Home|End|PageUp|PageDown|Escape|Esc|VolumeUp|VolumeDown|VolumeMute|MediaNextTrack|MediaPreviousTrack|MediaStop|MediaPlayPause|PrintScreen)$/;\n\nmodule.exports = function (str) {\n\tlet parts = str.split(\"+\");\n\tlet keyFound = false;\n    return parts.every((val, index) => {\n\t\tconst isKey = keyCodes.test(val);\n\t\tconst isModifier = modifiers.test(val);\n\t\tif (isKey) {\n\t\t\t// Key must be unique\n\t\t\tif (keyFound) return false;\n\t\t\tkeyFound = true;\n\t\t}\n\t\t// Key is required\n\t\tif (index === parts.length - 1 && !keyFound) return false;\n        return isKey || isModifier;\n    });\n};\n\n\n//# sourceURL=webpack:///./node_modules/electron-is-accelerator/index.js?");

/***/ }),

/***/ "./node_modules/electron-is-dev/index.js":
/*!***********************************************!*\
  !*** ./node_modules/electron-is-dev/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nconst getFromEnv = parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;\nconst isEnvSet = 'ELECTRON_IS_DEV' in process.env;\n\nmodule.exports = isEnvSet ? getFromEnv : (process.defaultApp || /node_modules[\\\\/]electron[\\\\/]/.test(process.execPath));\n\n\n//# sourceURL=webpack:///./node_modules/electron-is-dev/index.js?");

/***/ }),

/***/ "./node_modules/electron-localshortcut/index.js":
/*!******************************************************!*\
  !*** ./node_modules/electron-localshortcut/index.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nconst {app, BrowserWindow} = __webpack_require__(/*! electron */ \"electron\");\nconst isAccelerator = __webpack_require__(/*! electron-is-accelerator */ \"./node_modules/electron-is-accelerator/index.js\");\nconst equals = __webpack_require__(/*! keyboardevents-areequal */ \"./node_modules/keyboardevents-areequal/index.js\");\nconst {toKeyEvent} = __webpack_require__(/*! keyboardevent-from-electron-accelerator */ \"./node_modules/keyboardevent-from-electron-accelerator/index.js\");\nconst _debug = __webpack_require__(/*! debug */ \"./node_modules/debug/src/index.js\");\n\nconst debug = _debug('electron-localshortcut');\n\n// A placeholder to register shortcuts\n// on any window of the app.\nconst ANY_WINDOW = {};\n\nconst windowsWithShortcuts = new WeakMap();\n\nconst title = win => {\n\tif (win) {\n\t\ttry {\n\t\t\treturn win.getTitle();\n\t\t} catch (err) {\n\t\t\treturn 'A destroyed window';\n\t\t}\n\t}\n\n\treturn 'An falsy value';\n};\n\nfunction _checkAccelerator(accelerator) {\n\tif (!isAccelerator(accelerator)) {\n\t\tconst w = {};\n\t\tError.captureStackTrace(w);\n\t\tconst msg = `\nWARNING: ${accelerator} is not a valid accelerator.\n\n${w.stack\n\t\t\t.split('\\n')\n\t\t\t.slice(4)\n\t\t\t.join('\\n')}\n`;\n\t\tconsole.error(msg);\n\t}\n}\n\n/**\n * Disable all of the shortcuts registered on the BrowserWindow instance.\n * Registered shortcuts no more works on the `window` instance, but the module\n * keep a reference on them. You can reactivate them later by calling `enableAll`\n * method on the same window instance.\n * @param  {BrowserWindow} win BrowserWindow instance\n * @return {Undefined}\n */\nfunction disableAll(win) {\n\tdebug(`Disabling all shortcuts on window ${title(win)}`);\n\tconst wc = win.webContents;\n\tconst shortcutsOfWindow = windowsWithShortcuts.get(wc);\n\n\tfor (const shortcut of shortcutsOfWindow) {\n\t\tshortcut.enabled = false;\n\t}\n}\n\n/**\n * Enable all of the shortcuts registered on the BrowserWindow instance that\n * you had previously disabled calling `disableAll` method.\n * @param  {BrowserWindow} win BrowserWindow instance\n * @return {Undefined}\n */\nfunction enableAll(win) {\n\tdebug(`Enabling all shortcuts on window ${title(win)}`);\n\tconst wc = win.webContents;\n\tconst shortcutsOfWindow = windowsWithShortcuts.get(wc);\n\n\tfor (const shortcut of shortcutsOfWindow) {\n\t\tshortcut.enabled = true;\n\t}\n}\n\n/**\n * Unregisters all of the shortcuts registered on any focused BrowserWindow\n * instance. This method does not unregister any shortcut you registered on\n * a particular window instance.\n * @param  {BrowserWindow} win BrowserWindow instance\n * @return {Undefined}\n */\nfunction unregisterAll(win) {\n\tdebug(`Unregistering all shortcuts on window ${title(win)}`);\n\tconst wc = win.webContents;\n\tconst shortcutsOfWindow = windowsWithShortcuts.get(wc);\n\n\t// Remove listener from window\n\tshortcutsOfWindow.removeListener();\n\n\twindowsWithShortcuts.delete(wc);\n}\n\nfunction _normalizeEvent(input) {\n\tconst normalizedEvent = {\n\t\tcode: input.code,\n\t\tkey: input.key\n\t};\n\n\t['alt', 'shift', 'meta'].forEach(prop => {\n\t\tif (typeof input[prop] !== 'undefined') {\n\t\t\tnormalizedEvent[`${prop}Key`] = input[prop];\n\t\t}\n\t});\n\n\tif (typeof input.control !== 'undefined') {\n\t\tnormalizedEvent.ctrlKey = input.control;\n\t}\n\n\treturn normalizedEvent;\n}\n\nfunction _findShortcut(event, shortcutsOfWindow) {\n\tlet i = 0;\n\tfor (const shortcut of shortcutsOfWindow) {\n\t\tif (equals(shortcut.eventStamp, event)) {\n\t\t\treturn i;\n\t\t}\n\t\ti++;\n\t}\n\treturn -1;\n}\n\nconst _onBeforeInput = shortcutsOfWindow => (e, input) => {\n\tif (input.type === 'keyUp') {\n\t\treturn;\n\t}\n\n\tconst event = _normalizeEvent(input);\n\n\tdebug(`before-input-event: ${input} is translated to: ${event}`);\n\tfor (const {eventStamp, callback} of shortcutsOfWindow) {\n\t\tif (equals(eventStamp, event)) {\n\t\t\tdebug(`eventStamp: ${eventStamp} match`);\n\t\t\tcallback();\n\t\t\treturn;\n\t\t}\n\t\tdebug(`eventStamp: ${eventStamp} no match`);\n\t}\n};\n\n/**\n* Registers the shortcut `accelerator`on the BrowserWindow instance.\n * @param  {BrowserWindow} win - BrowserWindow instance to register.\n * This argument could be omitted, in this case the function register\n * the shortcut on all app windows.\n * @param  {String} accelerator - the shortcut to register\n * @param  {Function} callback    This function is called when the shortcut is pressed\n * and the window is focused and not minimized.\n * @return {Undefined}\n */\nfunction register(win, accelerator, callback) {\n\tlet wc;\n\tif (typeof callback === 'undefined') {\n\t\twc = ANY_WINDOW;\n\t\tcallback = accelerator;\n\t\taccelerator = win;\n\t} else {\n\t\twc = win.webContents;\n\t}\n\n\tdebug(`Registering callback for ${accelerator} on window ${title(win)}`);\n\t_checkAccelerator(accelerator);\n\n\tdebug(`${accelerator} seems a valid shortcut sequence.`);\n\n\tlet shortcutsOfWindow;\n\tif (windowsWithShortcuts.has(wc)) {\n\t\tdebug(`Window has others shortcuts registered.`);\n\t\tshortcutsOfWindow = windowsWithShortcuts.get(wc);\n\t} else {\n\t\tdebug(`This is the first shortcut of the window.`);\n\t\tshortcutsOfWindow = [];\n\t\twindowsWithShortcuts.set(wc, shortcutsOfWindow);\n\n\t\tif (wc === ANY_WINDOW) {\n\t\t\tconst keyHandler = _onBeforeInput(shortcutsOfWindow);\n\t\t\tconst enableAppShortcuts = (e, win) => {\n\t\t\t\tconst wc = win.webContents;\n\t\t\t\twc.on('before-input-event', keyHandler);\n\t\t\t\twc.once('closed', () =>\n\t\t\t\t\twc.removeListener('before-input-event', keyHandler)\n\t\t\t\t);\n\t\t\t};\n\n\t\t\t// Enable shortcut on current windows\n\t\t\tconst windows = BrowserWindow.getAllWindows();\n\n\t\t\twindows.forEach(win => enableAppShortcuts(null, win));\n\n\t\t\t// Enable shortcut on future windows\n\t\t\tapp.on('browser-window-created', enableAppShortcuts);\n\n\t\t\tshortcutsOfWindow.removeListener = () => {\n\t\t\t\tconst windows = BrowserWindow.getAllWindows();\n\t\t\t\twindows.forEach(win =>\n\t\t\t\t\twin.webContents.removeListener('before-input-event', keyHandler)\n\t\t\t\t);\n\t\t\t\tapp.removeListener('browser-window-created', enableAppShortcuts);\n\t\t\t};\n\t\t} else {\n\t\t\tconst keyHandler = _onBeforeInput(shortcutsOfWindow);\n\t\t\twc.on('before-input-event', keyHandler);\n\n\t\t\t// Save a reference to allow remove of listener from elsewhere\n\t\t\tshortcutsOfWindow.removeListener = () =>\n\t\t\t\twc.removeListener('before-input-event', keyHandler);\n\t\t\twc.once('closed', shortcutsOfWindow.removeListener);\n\t\t}\n\t}\n\n\tdebug(`Adding shortcut to window set.`);\n\n\tconst eventStamp = toKeyEvent(accelerator);\n\n\tshortcutsOfWindow.push({\n\t\teventStamp,\n\t\tcallback,\n\t\tenabled: true\n\t});\n\n\tdebug(`Shortcut registered.`);\n}\n\n/**\n * Unregisters the shortcut of `accelerator` registered on the BrowserWindow instance.\n * @param  {BrowserWindow} win - BrowserWindow instance to unregister.\n * This argument could be omitted, in this case the function unregister the shortcut\n * on all app windows. If you registered the shortcut on a particular window instance, it will do nothing.\n * @param  {String} accelerator - the shortcut to unregister\n * @return {Undefined}\n */\nfunction unregister(win, accelerator) {\n\tlet wc;\n\tif (typeof accelerator === 'undefined') {\n\t\twc = ANY_WINDOW;\n\t\taccelerator = win;\n\t} else {\n\t\tif (win.isDestroyed()) {\n\t\t\tdebug(`Early return because window is destroyed.`);\n\t\t\treturn;\n\t\t}\n\t\twc = win.webContents;\n\t}\n\n\tdebug(`Unregistering callback for ${accelerator} on window ${title(win)}`);\n\n\t_checkAccelerator(accelerator);\n\n\tdebug(`${accelerator} seems a valid shortcut sequence.`);\n\n\tif (!windowsWithShortcuts.has(wc)) {\n\t\tdebug(`Early return because window has never had shortcuts registered.`);\n\t\treturn;\n\t}\n\n\tconst shortcutsOfWindow = windowsWithShortcuts.get(wc);\n\n\tconst eventStamp = toKeyEvent(accelerator);\n\tconst shortcutIdx = _findShortcut(eventStamp, shortcutsOfWindow);\n\tif (shortcutIdx === -1) {\n\t\treturn;\n\t}\n\n\tshortcutsOfWindow.splice(shortcutIdx, 1);\n\n\t// If the window has no more shortcuts,\n\t// we remove it early from the WeakMap\n\t// and unregistering the event listener\n\tif (shortcutsOfWindow.length === 0) {\n\t\t// Remove listener from window\n\t\tshortcutsOfWindow.removeListener();\n\n\t\t// Remove window from shrtcuts catalog\n\t\twindowsWithShortcuts.delete(wc);\n\t}\n}\n\n/**\n * Returns `true` or `false` depending on whether the shortcut `accelerator`\n * is registered on `window`.\n * @param  {BrowserWindow} win - BrowserWindow instance to check. This argument\n * could be omitted, in this case the function returns whether the shortcut\n * `accelerator` is registered on all app windows. If you registered the\n * shortcut on a particular window instance, it return false.\n * @param  {String} accelerator - the shortcut to check\n * @return {Boolean} - if the shortcut `accelerator` is registered on `window`.\n */\nfunction isRegistered(win, accelerator) {\n\t_checkAccelerator(accelerator);\n}\n\nmodule.exports = {\n\tregister,\n\tunregister,\n\tisRegistered,\n\tunregisterAll,\n\tenableAll,\n\tdisableAll\n};\n\n\n//# sourceURL=webpack:///./node_modules/electron-localshortcut/index.js?");

/***/ }),

/***/ "./node_modules/fs.realpath/index.js":
/*!*******************************************!*\
  !*** ./node_modules/fs.realpath/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = realpath\nrealpath.realpath = realpath\nrealpath.sync = realpathSync\nrealpath.realpathSync = realpathSync\nrealpath.monkeypatch = monkeypatch\nrealpath.unmonkeypatch = unmonkeypatch\n\nvar fs = __webpack_require__(/*! fs */ \"fs\")\nvar origRealpath = fs.realpath\nvar origRealpathSync = fs.realpathSync\n\nvar version = process.version\nvar ok = /^v[0-5]\\./.test(version)\nvar old = __webpack_require__(/*! ./old.js */ \"./node_modules/fs.realpath/old.js\")\n\nfunction newError (er) {\n  return er && er.syscall === 'realpath' && (\n    er.code === 'ELOOP' ||\n    er.code === 'ENOMEM' ||\n    er.code === 'ENAMETOOLONG'\n  )\n}\n\nfunction realpath (p, cache, cb) {\n  if (ok) {\n    return origRealpath(p, cache, cb)\n  }\n\n  if (typeof cache === 'function') {\n    cb = cache\n    cache = null\n  }\n  origRealpath(p, cache, function (er, result) {\n    if (newError(er)) {\n      old.realpath(p, cache, cb)\n    } else {\n      cb(er, result)\n    }\n  })\n}\n\nfunction realpathSync (p, cache) {\n  if (ok) {\n    return origRealpathSync(p, cache)\n  }\n\n  try {\n    return origRealpathSync(p, cache)\n  } catch (er) {\n    if (newError(er)) {\n      return old.realpathSync(p, cache)\n    } else {\n      throw er\n    }\n  }\n}\n\nfunction monkeypatch () {\n  fs.realpath = realpath\n  fs.realpathSync = realpathSync\n}\n\nfunction unmonkeypatch () {\n  fs.realpath = origRealpath\n  fs.realpathSync = origRealpathSync\n}\n\n\n//# sourceURL=webpack:///./node_modules/fs.realpath/index.js?");

/***/ }),

/***/ "./node_modules/fs.realpath/old.js":
/*!*****************************************!*\
  !*** ./node_modules/fs.realpath/old.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Copyright Joyent, Inc. and other Node contributors.\n//\n// Permission is hereby granted, free of charge, to any person obtaining a\n// copy of this software and associated documentation files (the\n// \"Software\"), to deal in the Software without restriction, including\n// without limitation the rights to use, copy, modify, merge, publish,\n// distribute, sublicense, and/or sell copies of the Software, and to permit\n// persons to whom the Software is furnished to do so, subject to the\n// following conditions:\n//\n// The above copyright notice and this permission notice shall be included\n// in all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS\n// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\n// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN\n// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\n// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\n// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE\n// USE OR OTHER DEALINGS IN THE SOFTWARE.\n\nvar pathModule = __webpack_require__(/*! path */ \"path\");\nvar isWindows = process.platform === 'win32';\nvar fs = __webpack_require__(/*! fs */ \"fs\");\n\n// JavaScript implementation of realpath, ported from node pre-v6\n\nvar DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);\n\nfunction rethrow() {\n  // Only enable in debug mode. A backtrace uses ~1000 bytes of heap space and\n  // is fairly slow to generate.\n  var callback;\n  if (DEBUG) {\n    var backtrace = new Error;\n    callback = debugCallback;\n  } else\n    callback = missingCallback;\n\n  return callback;\n\n  function debugCallback(err) {\n    if (err) {\n      backtrace.message = err.message;\n      err = backtrace;\n      missingCallback(err);\n    }\n  }\n\n  function missingCallback(err) {\n    if (err) {\n      if (process.throwDeprecation)\n        throw err;  // Forgot a callback but don't know where? Use NODE_DEBUG=fs\n      else if (!process.noDeprecation) {\n        var msg = 'fs: missing callback ' + (err.stack || err.message);\n        if (process.traceDeprecation)\n          console.trace(msg);\n        else\n          console.error(msg);\n      }\n    }\n  }\n}\n\nfunction maybeCallback(cb) {\n  return typeof cb === 'function' ? cb : rethrow();\n}\n\nvar normalize = pathModule.normalize;\n\n// Regexp that finds the next partion of a (partial) path\n// result is [base_with_slash, base], e.g. ['somedir/', 'somedir']\nif (isWindows) {\n  var nextPartRe = /(.*?)(?:[\\/\\\\]+|$)/g;\n} else {\n  var nextPartRe = /(.*?)(?:[\\/]+|$)/g;\n}\n\n// Regex to find the device root, including trailing slash. E.g. 'c:\\\\'.\nif (isWindows) {\n  var splitRootRe = /^(?:[a-zA-Z]:|[\\\\\\/]{2}[^\\\\\\/]+[\\\\\\/][^\\\\\\/]+)?[\\\\\\/]*/;\n} else {\n  var splitRootRe = /^[\\/]*/;\n}\n\nexports.realpathSync = function realpathSync(p, cache) {\n  // make p is absolute\n  p = pathModule.resolve(p);\n\n  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {\n    return cache[p];\n  }\n\n  var original = p,\n      seenLinks = {},\n      knownHard = {};\n\n  // current character position in p\n  var pos;\n  // the partial path so far, including a trailing slash if any\n  var current;\n  // the partial path without a trailing slash (except when pointing at a root)\n  var base;\n  // the partial path scanned in the previous round, with slash\n  var previous;\n\n  start();\n\n  function start() {\n    // Skip over roots\n    var m = splitRootRe.exec(p);\n    pos = m[0].length;\n    current = m[0];\n    base = m[0];\n    previous = '';\n\n    // On windows, check that the root exists. On unix there is no need.\n    if (isWindows && !knownHard[base]) {\n      fs.lstatSync(base);\n      knownHard[base] = true;\n    }\n  }\n\n  // walk down the path, swapping out linked pathparts for their real\n  // values\n  // NB: p.length changes.\n  while (pos < p.length) {\n    // find the next part\n    nextPartRe.lastIndex = pos;\n    var result = nextPartRe.exec(p);\n    previous = current;\n    current += result[0];\n    base = previous + result[1];\n    pos = nextPartRe.lastIndex;\n\n    // continue if not a symlink\n    if (knownHard[base] || (cache && cache[base] === base)) {\n      continue;\n    }\n\n    var resolvedLink;\n    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {\n      // some known symbolic link.  no need to stat again.\n      resolvedLink = cache[base];\n    } else {\n      var stat = fs.lstatSync(base);\n      if (!stat.isSymbolicLink()) {\n        knownHard[base] = true;\n        if (cache) cache[base] = base;\n        continue;\n      }\n\n      // read the link if it wasn't read before\n      // dev/ino always return 0 on windows, so skip the check.\n      var linkTarget = null;\n      if (!isWindows) {\n        var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);\n        if (seenLinks.hasOwnProperty(id)) {\n          linkTarget = seenLinks[id];\n        }\n      }\n      if (linkTarget === null) {\n        fs.statSync(base);\n        linkTarget = fs.readlinkSync(base);\n      }\n      resolvedLink = pathModule.resolve(previous, linkTarget);\n      // track this, if given a cache.\n      if (cache) cache[base] = resolvedLink;\n      if (!isWindows) seenLinks[id] = linkTarget;\n    }\n\n    // resolve the link, then start over\n    p = pathModule.resolve(resolvedLink, p.slice(pos));\n    start();\n  }\n\n  if (cache) cache[original] = p;\n\n  return p;\n};\n\n\nexports.realpath = function realpath(p, cache, cb) {\n  if (typeof cb !== 'function') {\n    cb = maybeCallback(cache);\n    cache = null;\n  }\n\n  // make p is absolute\n  p = pathModule.resolve(p);\n\n  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {\n    return process.nextTick(cb.bind(null, null, cache[p]));\n  }\n\n  var original = p,\n      seenLinks = {},\n      knownHard = {};\n\n  // current character position in p\n  var pos;\n  // the partial path so far, including a trailing slash if any\n  var current;\n  // the partial path without a trailing slash (except when pointing at a root)\n  var base;\n  // the partial path scanned in the previous round, with slash\n  var previous;\n\n  start();\n\n  function start() {\n    // Skip over roots\n    var m = splitRootRe.exec(p);\n    pos = m[0].length;\n    current = m[0];\n    base = m[0];\n    previous = '';\n\n    // On windows, check that the root exists. On unix there is no need.\n    if (isWindows && !knownHard[base]) {\n      fs.lstat(base, function(err) {\n        if (err) return cb(err);\n        knownHard[base] = true;\n        LOOP();\n      });\n    } else {\n      process.nextTick(LOOP);\n    }\n  }\n\n  // walk down the path, swapping out linked pathparts for their real\n  // values\n  function LOOP() {\n    // stop if scanned past end of path\n    if (pos >= p.length) {\n      if (cache) cache[original] = p;\n      return cb(null, p);\n    }\n\n    // find the next part\n    nextPartRe.lastIndex = pos;\n    var result = nextPartRe.exec(p);\n    previous = current;\n    current += result[0];\n    base = previous + result[1];\n    pos = nextPartRe.lastIndex;\n\n    // continue if not a symlink\n    if (knownHard[base] || (cache && cache[base] === base)) {\n      return process.nextTick(LOOP);\n    }\n\n    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {\n      // known symbolic link.  no need to stat again.\n      return gotResolvedLink(cache[base]);\n    }\n\n    return fs.lstat(base, gotStat);\n  }\n\n  function gotStat(err, stat) {\n    if (err) return cb(err);\n\n    // if not a symlink, skip to the next path part\n    if (!stat.isSymbolicLink()) {\n      knownHard[base] = true;\n      if (cache) cache[base] = base;\n      return process.nextTick(LOOP);\n    }\n\n    // stat & read the link if not read before\n    // call gotTarget as soon as the link target is known\n    // dev/ino always return 0 on windows, so skip the check.\n    if (!isWindows) {\n      var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);\n      if (seenLinks.hasOwnProperty(id)) {\n        return gotTarget(null, seenLinks[id], base);\n      }\n    }\n    fs.stat(base, function(err) {\n      if (err) return cb(err);\n\n      fs.readlink(base, function(err, target) {\n        if (!isWindows) seenLinks[id] = target;\n        gotTarget(err, target);\n      });\n    });\n  }\n\n  function gotTarget(err, target, base) {\n    if (err) return cb(err);\n\n    var resolvedLink = pathModule.resolve(previous, target);\n    if (cache) cache[base] = resolvedLink;\n    gotResolvedLink(resolvedLink);\n  }\n\n  function gotResolvedLink(resolvedLink) {\n    // resolve the link, then start over\n    p = pathModule.resolve(resolvedLink, p.slice(pos));\n    start();\n  }\n};\n\n\n//# sourceURL=webpack:///./node_modules/fs.realpath/old.js?");

/***/ }),

/***/ "./node_modules/glob/common.js":
/*!*************************************!*\
  !*** ./node_modules/glob/common.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("exports.alphasort = alphasort\nexports.alphasorti = alphasorti\nexports.setopts = setopts\nexports.ownProp = ownProp\nexports.makeAbs = makeAbs\nexports.finish = finish\nexports.mark = mark\nexports.isIgnored = isIgnored\nexports.childrenIgnored = childrenIgnored\n\nfunction ownProp (obj, field) {\n  return Object.prototype.hasOwnProperty.call(obj, field)\n}\n\nvar path = __webpack_require__(/*! path */ \"path\")\nvar minimatch = __webpack_require__(/*! minimatch */ \"./node_modules/minimatch/minimatch.js\")\nvar isAbsolute = __webpack_require__(/*! path-is-absolute */ \"./node_modules/path-is-absolute/index.js\")\nvar Minimatch = minimatch.Minimatch\n\nfunction alphasorti (a, b) {\n  return a.toLowerCase().localeCompare(b.toLowerCase())\n}\n\nfunction alphasort (a, b) {\n  return a.localeCompare(b)\n}\n\nfunction setupIgnores (self, options) {\n  self.ignore = options.ignore || []\n\n  if (!Array.isArray(self.ignore))\n    self.ignore = [self.ignore]\n\n  if (self.ignore.length) {\n    self.ignore = self.ignore.map(ignoreMap)\n  }\n}\n\n// ignore patterns are always in dot:true mode.\nfunction ignoreMap (pattern) {\n  var gmatcher = null\n  if (pattern.slice(-3) === '/**') {\n    var gpattern = pattern.replace(/(\\/\\*\\*)+$/, '')\n    gmatcher = new Minimatch(gpattern, { dot: true })\n  }\n\n  return {\n    matcher: new Minimatch(pattern, { dot: true }),\n    gmatcher: gmatcher\n  }\n}\n\nfunction setopts (self, pattern, options) {\n  if (!options)\n    options = {}\n\n  // base-matching: just use globstar for that.\n  if (options.matchBase && -1 === pattern.indexOf(\"/\")) {\n    if (options.noglobstar) {\n      throw new Error(\"base matching requires globstar\")\n    }\n    pattern = \"**/\" + pattern\n  }\n\n  self.silent = !!options.silent\n  self.pattern = pattern\n  self.strict = options.strict !== false\n  self.realpath = !!options.realpath\n  self.realpathCache = options.realpathCache || Object.create(null)\n  self.follow = !!options.follow\n  self.dot = !!options.dot\n  self.mark = !!options.mark\n  self.nodir = !!options.nodir\n  if (self.nodir)\n    self.mark = true\n  self.sync = !!options.sync\n  self.nounique = !!options.nounique\n  self.nonull = !!options.nonull\n  self.nosort = !!options.nosort\n  self.nocase = !!options.nocase\n  self.stat = !!options.stat\n  self.noprocess = !!options.noprocess\n  self.absolute = !!options.absolute\n\n  self.maxLength = options.maxLength || Infinity\n  self.cache = options.cache || Object.create(null)\n  self.statCache = options.statCache || Object.create(null)\n  self.symlinks = options.symlinks || Object.create(null)\n\n  setupIgnores(self, options)\n\n  self.changedCwd = false\n  var cwd = process.cwd()\n  if (!ownProp(options, \"cwd\"))\n    self.cwd = cwd\n  else {\n    self.cwd = path.resolve(options.cwd)\n    self.changedCwd = self.cwd !== cwd\n  }\n\n  self.root = options.root || path.resolve(self.cwd, \"/\")\n  self.root = path.resolve(self.root)\n  if (process.platform === \"win32\")\n    self.root = self.root.replace(/\\\\/g, \"/\")\n\n  // TODO: is an absolute `cwd` supposed to be resolved against `root`?\n  // e.g. { cwd: '/test', root: __dirname } === path.join(__dirname, '/test')\n  self.cwdAbs = isAbsolute(self.cwd) ? self.cwd : makeAbs(self, self.cwd)\n  if (process.platform === \"win32\")\n    self.cwdAbs = self.cwdAbs.replace(/\\\\/g, \"/\")\n  self.nomount = !!options.nomount\n\n  // disable comments and negation in Minimatch.\n  // Note that they are not supported in Glob itself anyway.\n  options.nonegate = true\n  options.nocomment = true\n\n  self.minimatch = new Minimatch(pattern, options)\n  self.options = self.minimatch.options\n}\n\nfunction finish (self) {\n  var nou = self.nounique\n  var all = nou ? [] : Object.create(null)\n\n  for (var i = 0, l = self.matches.length; i < l; i ++) {\n    var matches = self.matches[i]\n    if (!matches || Object.keys(matches).length === 0) {\n      if (self.nonull) {\n        // do like the shell, and spit out the literal glob\n        var literal = self.minimatch.globSet[i]\n        if (nou)\n          all.push(literal)\n        else\n          all[literal] = true\n      }\n    } else {\n      // had matches\n      var m = Object.keys(matches)\n      if (nou)\n        all.push.apply(all, m)\n      else\n        m.forEach(function (m) {\n          all[m] = true\n        })\n    }\n  }\n\n  if (!nou)\n    all = Object.keys(all)\n\n  if (!self.nosort)\n    all = all.sort(self.nocase ? alphasorti : alphasort)\n\n  // at *some* point we statted all of these\n  if (self.mark) {\n    for (var i = 0; i < all.length; i++) {\n      all[i] = self._mark(all[i])\n    }\n    if (self.nodir) {\n      all = all.filter(function (e) {\n        var notDir = !(/\\/$/.test(e))\n        var c = self.cache[e] || self.cache[makeAbs(self, e)]\n        if (notDir && c)\n          notDir = c !== 'DIR' && !Array.isArray(c)\n        return notDir\n      })\n    }\n  }\n\n  if (self.ignore.length)\n    all = all.filter(function(m) {\n      return !isIgnored(self, m)\n    })\n\n  self.found = all\n}\n\nfunction mark (self, p) {\n  var abs = makeAbs(self, p)\n  var c = self.cache[abs]\n  var m = p\n  if (c) {\n    var isDir = c === 'DIR' || Array.isArray(c)\n    var slash = p.slice(-1) === '/'\n\n    if (isDir && !slash)\n      m += '/'\n    else if (!isDir && slash)\n      m = m.slice(0, -1)\n\n    if (m !== p) {\n      var mabs = makeAbs(self, m)\n      self.statCache[mabs] = self.statCache[abs]\n      self.cache[mabs] = self.cache[abs]\n    }\n  }\n\n  return m\n}\n\n// lotta situps...\nfunction makeAbs (self, f) {\n  var abs = f\n  if (f.charAt(0) === '/') {\n    abs = path.join(self.root, f)\n  } else if (isAbsolute(f) || f === '') {\n    abs = f\n  } else if (self.changedCwd) {\n    abs = path.resolve(self.cwd, f)\n  } else {\n    abs = path.resolve(f)\n  }\n\n  if (process.platform === 'win32')\n    abs = abs.replace(/\\\\/g, '/')\n\n  return abs\n}\n\n\n// Return true, if pattern ends with globstar '**', for the accompanying parent directory.\n// Ex:- If node_modules/** is the pattern, add 'node_modules' to ignore list along with it's contents\nfunction isIgnored (self, path) {\n  if (!self.ignore.length)\n    return false\n\n  return self.ignore.some(function(item) {\n    return item.matcher.match(path) || !!(item.gmatcher && item.gmatcher.match(path))\n  })\n}\n\nfunction childrenIgnored (self, path) {\n  if (!self.ignore.length)\n    return false\n\n  return self.ignore.some(function(item) {\n    return !!(item.gmatcher && item.gmatcher.match(path))\n  })\n}\n\n\n//# sourceURL=webpack:///./node_modules/glob/common.js?");

/***/ }),

/***/ "./node_modules/glob/glob.js":
/*!***********************************!*\
  !*** ./node_modules/glob/glob.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Approach:\n//\n// 1. Get the minimatch set\n// 2. For each pattern in the set, PROCESS(pattern, false)\n// 3. Store matches per-set, then uniq them\n//\n// PROCESS(pattern, inGlobStar)\n// Get the first [n] items from pattern that are all strings\n// Join these together.  This is PREFIX.\n//   If there is no more remaining, then stat(PREFIX) and\n//   add to matches if it succeeds.  END.\n//\n// If inGlobStar and PREFIX is symlink and points to dir\n//   set ENTRIES = []\n// else readdir(PREFIX) as ENTRIES\n//   If fail, END\n//\n// with ENTRIES\n//   If pattern[n] is GLOBSTAR\n//     // handle the case where the globstar match is empty\n//     // by pruning it out, and testing the resulting pattern\n//     PROCESS(pattern[0..n] + pattern[n+1 .. $], false)\n//     // handle other cases.\n//     for ENTRY in ENTRIES (not dotfiles)\n//       // attach globstar + tail onto the entry\n//       // Mark that this entry is a globstar match\n//       PROCESS(pattern[0..n] + ENTRY + pattern[n .. $], true)\n//\n//   else // not globstar\n//     for ENTRY in ENTRIES (not dotfiles, unless pattern[n] is dot)\n//       Test ENTRY against pattern[n]\n//       If fails, continue\n//       If passes, PROCESS(pattern[0..n] + item + pattern[n+1 .. $])\n//\n// Caveat:\n//   Cache all stats and readdirs results to minimize syscall.  Since all\n//   we ever care about is existence and directory-ness, we can just keep\n//   `true` for files, and [children,...] for directories, or `false` for\n//   things that don't exist.\n\nmodule.exports = glob\n\nvar fs = __webpack_require__(/*! fs */ \"fs\")\nvar rp = __webpack_require__(/*! fs.realpath */ \"./node_modules/fs.realpath/index.js\")\nvar minimatch = __webpack_require__(/*! minimatch */ \"./node_modules/minimatch/minimatch.js\")\nvar Minimatch = minimatch.Minimatch\nvar inherits = __webpack_require__(/*! inherits */ \"./node_modules/inherits/inherits.js\")\nvar EE = __webpack_require__(/*! events */ \"events\").EventEmitter\nvar path = __webpack_require__(/*! path */ \"path\")\nvar assert = __webpack_require__(/*! assert */ \"assert\")\nvar isAbsolute = __webpack_require__(/*! path-is-absolute */ \"./node_modules/path-is-absolute/index.js\")\nvar globSync = __webpack_require__(/*! ./sync.js */ \"./node_modules/glob/sync.js\")\nvar common = __webpack_require__(/*! ./common.js */ \"./node_modules/glob/common.js\")\nvar alphasort = common.alphasort\nvar alphasorti = common.alphasorti\nvar setopts = common.setopts\nvar ownProp = common.ownProp\nvar inflight = __webpack_require__(/*! inflight */ \"./node_modules/inflight/inflight.js\")\nvar util = __webpack_require__(/*! util */ \"util\")\nvar childrenIgnored = common.childrenIgnored\nvar isIgnored = common.isIgnored\n\nvar once = __webpack_require__(/*! once */ \"./node_modules/once/once.js\")\n\nfunction glob (pattern, options, cb) {\n  if (typeof options === 'function') cb = options, options = {}\n  if (!options) options = {}\n\n  if (options.sync) {\n    if (cb)\n      throw new TypeError('callback provided to sync glob')\n    return globSync(pattern, options)\n  }\n\n  return new Glob(pattern, options, cb)\n}\n\nglob.sync = globSync\nvar GlobSync = glob.GlobSync = globSync.GlobSync\n\n// old api surface\nglob.glob = glob\n\nfunction extend (origin, add) {\n  if (add === null || typeof add !== 'object') {\n    return origin\n  }\n\n  var keys = Object.keys(add)\n  var i = keys.length\n  while (i--) {\n    origin[keys[i]] = add[keys[i]]\n  }\n  return origin\n}\n\nglob.hasMagic = function (pattern, options_) {\n  var options = extend({}, options_)\n  options.noprocess = true\n\n  var g = new Glob(pattern, options)\n  var set = g.minimatch.set\n\n  if (!pattern)\n    return false\n\n  if (set.length > 1)\n    return true\n\n  for (var j = 0; j < set[0].length; j++) {\n    if (typeof set[0][j] !== 'string')\n      return true\n  }\n\n  return false\n}\n\nglob.Glob = Glob\ninherits(Glob, EE)\nfunction Glob (pattern, options, cb) {\n  if (typeof options === 'function') {\n    cb = options\n    options = null\n  }\n\n  if (options && options.sync) {\n    if (cb)\n      throw new TypeError('callback provided to sync glob')\n    return new GlobSync(pattern, options)\n  }\n\n  if (!(this instanceof Glob))\n    return new Glob(pattern, options, cb)\n\n  setopts(this, pattern, options)\n  this._didRealPath = false\n\n  // process each pattern in the minimatch set\n  var n = this.minimatch.set.length\n\n  // The matches are stored as {<filename>: true,...} so that\n  // duplicates are automagically pruned.\n  // Later, we do an Object.keys() on these.\n  // Keep them as a list so we can fill in when nonull is set.\n  this.matches = new Array(n)\n\n  if (typeof cb === 'function') {\n    cb = once(cb)\n    this.on('error', cb)\n    this.on('end', function (matches) {\n      cb(null, matches)\n    })\n  }\n\n  var self = this\n  this._processing = 0\n\n  this._emitQueue = []\n  this._processQueue = []\n  this.paused = false\n\n  if (this.noprocess)\n    return this\n\n  if (n === 0)\n    return done()\n\n  var sync = true\n  for (var i = 0; i < n; i ++) {\n    this._process(this.minimatch.set[i], i, false, done)\n  }\n  sync = false\n\n  function done () {\n    --self._processing\n    if (self._processing <= 0) {\n      if (sync) {\n        process.nextTick(function () {\n          self._finish()\n        })\n      } else {\n        self._finish()\n      }\n    }\n  }\n}\n\nGlob.prototype._finish = function () {\n  assert(this instanceof Glob)\n  if (this.aborted)\n    return\n\n  if (this.realpath && !this._didRealpath)\n    return this._realpath()\n\n  common.finish(this)\n  this.emit('end', this.found)\n}\n\nGlob.prototype._realpath = function () {\n  if (this._didRealpath)\n    return\n\n  this._didRealpath = true\n\n  var n = this.matches.length\n  if (n === 0)\n    return this._finish()\n\n  var self = this\n  for (var i = 0; i < this.matches.length; i++)\n    this._realpathSet(i, next)\n\n  function next () {\n    if (--n === 0)\n      self._finish()\n  }\n}\n\nGlob.prototype._realpathSet = function (index, cb) {\n  var matchset = this.matches[index]\n  if (!matchset)\n    return cb()\n\n  var found = Object.keys(matchset)\n  var self = this\n  var n = found.length\n\n  if (n === 0)\n    return cb()\n\n  var set = this.matches[index] = Object.create(null)\n  found.forEach(function (p, i) {\n    // If there's a problem with the stat, then it means that\n    // one or more of the links in the realpath couldn't be\n    // resolved.  just return the abs value in that case.\n    p = self._makeAbs(p)\n    rp.realpath(p, self.realpathCache, function (er, real) {\n      if (!er)\n        set[real] = true\n      else if (er.syscall === 'stat')\n        set[p] = true\n      else\n        self.emit('error', er) // srsly wtf right here\n\n      if (--n === 0) {\n        self.matches[index] = set\n        cb()\n      }\n    })\n  })\n}\n\nGlob.prototype._mark = function (p) {\n  return common.mark(this, p)\n}\n\nGlob.prototype._makeAbs = function (f) {\n  return common.makeAbs(this, f)\n}\n\nGlob.prototype.abort = function () {\n  this.aborted = true\n  this.emit('abort')\n}\n\nGlob.prototype.pause = function () {\n  if (!this.paused) {\n    this.paused = true\n    this.emit('pause')\n  }\n}\n\nGlob.prototype.resume = function () {\n  if (this.paused) {\n    this.emit('resume')\n    this.paused = false\n    if (this._emitQueue.length) {\n      var eq = this._emitQueue.slice(0)\n      this._emitQueue.length = 0\n      for (var i = 0; i < eq.length; i ++) {\n        var e = eq[i]\n        this._emitMatch(e[0], e[1])\n      }\n    }\n    if (this._processQueue.length) {\n      var pq = this._processQueue.slice(0)\n      this._processQueue.length = 0\n      for (var i = 0; i < pq.length; i ++) {\n        var p = pq[i]\n        this._processing--\n        this._process(p[0], p[1], p[2], p[3])\n      }\n    }\n  }\n}\n\nGlob.prototype._process = function (pattern, index, inGlobStar, cb) {\n  assert(this instanceof Glob)\n  assert(typeof cb === 'function')\n\n  if (this.aborted)\n    return\n\n  this._processing++\n  if (this.paused) {\n    this._processQueue.push([pattern, index, inGlobStar, cb])\n    return\n  }\n\n  //console.error('PROCESS %d', this._processing, pattern)\n\n  // Get the first [n] parts of pattern that are all strings.\n  var n = 0\n  while (typeof pattern[n] === 'string') {\n    n ++\n  }\n  // now n is the index of the first one that is *not* a string.\n\n  // see if there's anything else\n  var prefix\n  switch (n) {\n    // if not, then this is rather simple\n    case pattern.length:\n      this._processSimple(pattern.join('/'), index, cb)\n      return\n\n    case 0:\n      // pattern *starts* with some non-trivial item.\n      // going to readdir(cwd), but not include the prefix in matches.\n      prefix = null\n      break\n\n    default:\n      // pattern has some string bits in the front.\n      // whatever it starts with, whether that's 'absolute' like /foo/bar,\n      // or 'relative' like '../baz'\n      prefix = pattern.slice(0, n).join('/')\n      break\n  }\n\n  var remain = pattern.slice(n)\n\n  // get the list of entries.\n  var read\n  if (prefix === null)\n    read = '.'\n  else if (isAbsolute(prefix) || isAbsolute(pattern.join('/'))) {\n    if (!prefix || !isAbsolute(prefix))\n      prefix = '/' + prefix\n    read = prefix\n  } else\n    read = prefix\n\n  var abs = this._makeAbs(read)\n\n  //if ignored, skip _processing\n  if (childrenIgnored(this, read))\n    return cb()\n\n  var isGlobStar = remain[0] === minimatch.GLOBSTAR\n  if (isGlobStar)\n    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb)\n  else\n    this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb)\n}\n\nGlob.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar, cb) {\n  var self = this\n  this._readdir(abs, inGlobStar, function (er, entries) {\n    return self._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb)\n  })\n}\n\nGlob.prototype._processReaddir2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {\n\n  // if the abs isn't a dir, then nothing can match!\n  if (!entries)\n    return cb()\n\n  // It will only match dot entries if it starts with a dot, or if\n  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.\n  var pn = remain[0]\n  var negate = !!this.minimatch.negate\n  var rawGlob = pn._glob\n  var dotOk = this.dot || rawGlob.charAt(0) === '.'\n\n  var matchedEntries = []\n  for (var i = 0; i < entries.length; i++) {\n    var e = entries[i]\n    if (e.charAt(0) !== '.' || dotOk) {\n      var m\n      if (negate && !prefix) {\n        m = !e.match(pn)\n      } else {\n        m = e.match(pn)\n      }\n      if (m)\n        matchedEntries.push(e)\n    }\n  }\n\n  //console.error('prd2', prefix, entries, remain[0]._glob, matchedEntries)\n\n  var len = matchedEntries.length\n  // If there are no matched entries, then nothing matches.\n  if (len === 0)\n    return cb()\n\n  // if this is the last remaining pattern bit, then no need for\n  // an additional stat *unless* the user has specified mark or\n  // stat explicitly.  We know they exist, since readdir returned\n  // them.\n\n  if (remain.length === 1 && !this.mark && !this.stat) {\n    if (!this.matches[index])\n      this.matches[index] = Object.create(null)\n\n    for (var i = 0; i < len; i ++) {\n      var e = matchedEntries[i]\n      if (prefix) {\n        if (prefix !== '/')\n          e = prefix + '/' + e\n        else\n          e = prefix + e\n      }\n\n      if (e.charAt(0) === '/' && !this.nomount) {\n        e = path.join(this.root, e)\n      }\n      this._emitMatch(index, e)\n    }\n    // This was the last one, and no stats were needed\n    return cb()\n  }\n\n  // now test all matched entries as stand-ins for that part\n  // of the pattern.\n  remain.shift()\n  for (var i = 0; i < len; i ++) {\n    var e = matchedEntries[i]\n    var newPattern\n    if (prefix) {\n      if (prefix !== '/')\n        e = prefix + '/' + e\n      else\n        e = prefix + e\n    }\n    this._process([e].concat(remain), index, inGlobStar, cb)\n  }\n  cb()\n}\n\nGlob.prototype._emitMatch = function (index, e) {\n  if (this.aborted)\n    return\n\n  if (isIgnored(this, e))\n    return\n\n  if (this.paused) {\n    this._emitQueue.push([index, e])\n    return\n  }\n\n  var abs = isAbsolute(e) ? e : this._makeAbs(e)\n\n  if (this.mark)\n    e = this._mark(e)\n\n  if (this.absolute)\n    e = abs\n\n  if (this.matches[index][e])\n    return\n\n  if (this.nodir) {\n    var c = this.cache[abs]\n    if (c === 'DIR' || Array.isArray(c))\n      return\n  }\n\n  this.matches[index][e] = true\n\n  var st = this.statCache[abs]\n  if (st)\n    this.emit('stat', e, st)\n\n  this.emit('match', e)\n}\n\nGlob.prototype._readdirInGlobStar = function (abs, cb) {\n  if (this.aborted)\n    return\n\n  // follow all symlinked directories forever\n  // just proceed as if this is a non-globstar situation\n  if (this.follow)\n    return this._readdir(abs, false, cb)\n\n  var lstatkey = 'lstat\\0' + abs\n  var self = this\n  var lstatcb = inflight(lstatkey, lstatcb_)\n\n  if (lstatcb)\n    fs.lstat(abs, lstatcb)\n\n  function lstatcb_ (er, lstat) {\n    if (er && er.code === 'ENOENT')\n      return cb()\n\n    var isSym = lstat && lstat.isSymbolicLink()\n    self.symlinks[abs] = isSym\n\n    // If it's not a symlink or a dir, then it's definitely a regular file.\n    // don't bother doing a readdir in that case.\n    if (!isSym && lstat && !lstat.isDirectory()) {\n      self.cache[abs] = 'FILE'\n      cb()\n    } else\n      self._readdir(abs, false, cb)\n  }\n}\n\nGlob.prototype._readdir = function (abs, inGlobStar, cb) {\n  if (this.aborted)\n    return\n\n  cb = inflight('readdir\\0'+abs+'\\0'+inGlobStar, cb)\n  if (!cb)\n    return\n\n  //console.error('RD %j %j', +inGlobStar, abs)\n  if (inGlobStar && !ownProp(this.symlinks, abs))\n    return this._readdirInGlobStar(abs, cb)\n\n  if (ownProp(this.cache, abs)) {\n    var c = this.cache[abs]\n    if (!c || c === 'FILE')\n      return cb()\n\n    if (Array.isArray(c))\n      return cb(null, c)\n  }\n\n  var self = this\n  fs.readdir(abs, readdirCb(this, abs, cb))\n}\n\nfunction readdirCb (self, abs, cb) {\n  return function (er, entries) {\n    if (er)\n      self._readdirError(abs, er, cb)\n    else\n      self._readdirEntries(abs, entries, cb)\n  }\n}\n\nGlob.prototype._readdirEntries = function (abs, entries, cb) {\n  if (this.aborted)\n    return\n\n  // if we haven't asked to stat everything, then just\n  // assume that everything in there exists, so we can avoid\n  // having to stat it a second time.\n  if (!this.mark && !this.stat) {\n    for (var i = 0; i < entries.length; i ++) {\n      var e = entries[i]\n      if (abs === '/')\n        e = abs + e\n      else\n        e = abs + '/' + e\n      this.cache[e] = true\n    }\n  }\n\n  this.cache[abs] = entries\n  return cb(null, entries)\n}\n\nGlob.prototype._readdirError = function (f, er, cb) {\n  if (this.aborted)\n    return\n\n  // handle errors, and cache the information\n  switch (er.code) {\n    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205\n    case 'ENOTDIR': // totally normal. means it *does* exist.\n      var abs = this._makeAbs(f)\n      this.cache[abs] = 'FILE'\n      if (abs === this.cwdAbs) {\n        var error = new Error(er.code + ' invalid cwd ' + this.cwd)\n        error.path = this.cwd\n        error.code = er.code\n        this.emit('error', error)\n        this.abort()\n      }\n      break\n\n    case 'ENOENT': // not terribly unusual\n    case 'ELOOP':\n    case 'ENAMETOOLONG':\n    case 'UNKNOWN':\n      this.cache[this._makeAbs(f)] = false\n      break\n\n    default: // some unusual error.  Treat as failure.\n      this.cache[this._makeAbs(f)] = false\n      if (this.strict) {\n        this.emit('error', er)\n        // If the error is handled, then we abort\n        // if not, we threw out of here\n        this.abort()\n      }\n      if (!this.silent)\n        console.error('glob error', er)\n      break\n  }\n\n  return cb()\n}\n\nGlob.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar, cb) {\n  var self = this\n  this._readdir(abs, inGlobStar, function (er, entries) {\n    self._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb)\n  })\n}\n\n\nGlob.prototype._processGlobStar2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {\n  //console.error('pgs2', prefix, remain[0], entries)\n\n  // no entries means not a dir, so it can never have matches\n  // foo.txt/** doesn't match foo.txt\n  if (!entries)\n    return cb()\n\n  // test without the globstar, and with every child both below\n  // and replacing the globstar.\n  var remainWithoutGlobStar = remain.slice(1)\n  var gspref = prefix ? [ prefix ] : []\n  var noGlobStar = gspref.concat(remainWithoutGlobStar)\n\n  // the noGlobStar pattern exits the inGlobStar state\n  this._process(noGlobStar, index, false, cb)\n\n  var isSym = this.symlinks[abs]\n  var len = entries.length\n\n  // If it's a symlink, and we're in a globstar, then stop\n  if (isSym && inGlobStar)\n    return cb()\n\n  for (var i = 0; i < len; i++) {\n    var e = entries[i]\n    if (e.charAt(0) === '.' && !this.dot)\n      continue\n\n    // these two cases enter the inGlobStar state\n    var instead = gspref.concat(entries[i], remainWithoutGlobStar)\n    this._process(instead, index, true, cb)\n\n    var below = gspref.concat(entries[i], remain)\n    this._process(below, index, true, cb)\n  }\n\n  cb()\n}\n\nGlob.prototype._processSimple = function (prefix, index, cb) {\n  // XXX review this.  Shouldn't it be doing the mounting etc\n  // before doing stat?  kinda weird?\n  var self = this\n  this._stat(prefix, function (er, exists) {\n    self._processSimple2(prefix, index, er, exists, cb)\n  })\n}\nGlob.prototype._processSimple2 = function (prefix, index, er, exists, cb) {\n\n  //console.error('ps2', prefix, exists)\n\n  if (!this.matches[index])\n    this.matches[index] = Object.create(null)\n\n  // If it doesn't exist, then just mark the lack of results\n  if (!exists)\n    return cb()\n\n  if (prefix && isAbsolute(prefix) && !this.nomount) {\n    var trail = /[\\/\\\\]$/.test(prefix)\n    if (prefix.charAt(0) === '/') {\n      prefix = path.join(this.root, prefix)\n    } else {\n      prefix = path.resolve(this.root, prefix)\n      if (trail)\n        prefix += '/'\n    }\n  }\n\n  if (process.platform === 'win32')\n    prefix = prefix.replace(/\\\\/g, '/')\n\n  // Mark this as a match\n  this._emitMatch(index, prefix)\n  cb()\n}\n\n// Returns either 'DIR', 'FILE', or false\nGlob.prototype._stat = function (f, cb) {\n  var abs = this._makeAbs(f)\n  var needDir = f.slice(-1) === '/'\n\n  if (f.length > this.maxLength)\n    return cb()\n\n  if (!this.stat && ownProp(this.cache, abs)) {\n    var c = this.cache[abs]\n\n    if (Array.isArray(c))\n      c = 'DIR'\n\n    // It exists, but maybe not how we need it\n    if (!needDir || c === 'DIR')\n      return cb(null, c)\n\n    if (needDir && c === 'FILE')\n      return cb()\n\n    // otherwise we have to stat, because maybe c=true\n    // if we know it exists, but not what it is.\n  }\n\n  var exists\n  var stat = this.statCache[abs]\n  if (stat !== undefined) {\n    if (stat === false)\n      return cb(null, stat)\n    else {\n      var type = stat.isDirectory() ? 'DIR' : 'FILE'\n      if (needDir && type === 'FILE')\n        return cb()\n      else\n        return cb(null, type, stat)\n    }\n  }\n\n  var self = this\n  var statcb = inflight('stat\\0' + abs, lstatcb_)\n  if (statcb)\n    fs.lstat(abs, statcb)\n\n  function lstatcb_ (er, lstat) {\n    if (lstat && lstat.isSymbolicLink()) {\n      // If it's a symlink, then treat it as the target, unless\n      // the target does not exist, then treat it as a file.\n      return fs.stat(abs, function (er, stat) {\n        if (er)\n          self._stat2(f, abs, null, lstat, cb)\n        else\n          self._stat2(f, abs, er, stat, cb)\n      })\n    } else {\n      self._stat2(f, abs, er, lstat, cb)\n    }\n  }\n}\n\nGlob.prototype._stat2 = function (f, abs, er, stat, cb) {\n  if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {\n    this.statCache[abs] = false\n    return cb()\n  }\n\n  var needDir = f.slice(-1) === '/'\n  this.statCache[abs] = stat\n\n  if (abs.slice(-1) === '/' && stat && !stat.isDirectory())\n    return cb(null, false, stat)\n\n  var c = true\n  if (stat)\n    c = stat.isDirectory() ? 'DIR' : 'FILE'\n  this.cache[abs] = this.cache[abs] || c\n\n  if (needDir && c === 'FILE')\n    return cb()\n\n  return cb(null, c, stat)\n}\n\n\n//# sourceURL=webpack:///./node_modules/glob/glob.js?");

/***/ }),

/***/ "./node_modules/glob/sync.js":
/*!***********************************!*\
  !*** ./node_modules/glob/sync.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = globSync\nglobSync.GlobSync = GlobSync\n\nvar fs = __webpack_require__(/*! fs */ \"fs\")\nvar rp = __webpack_require__(/*! fs.realpath */ \"./node_modules/fs.realpath/index.js\")\nvar minimatch = __webpack_require__(/*! minimatch */ \"./node_modules/minimatch/minimatch.js\")\nvar Minimatch = minimatch.Minimatch\nvar Glob = __webpack_require__(/*! ./glob.js */ \"./node_modules/glob/glob.js\").Glob\nvar util = __webpack_require__(/*! util */ \"util\")\nvar path = __webpack_require__(/*! path */ \"path\")\nvar assert = __webpack_require__(/*! assert */ \"assert\")\nvar isAbsolute = __webpack_require__(/*! path-is-absolute */ \"./node_modules/path-is-absolute/index.js\")\nvar common = __webpack_require__(/*! ./common.js */ \"./node_modules/glob/common.js\")\nvar alphasort = common.alphasort\nvar alphasorti = common.alphasorti\nvar setopts = common.setopts\nvar ownProp = common.ownProp\nvar childrenIgnored = common.childrenIgnored\nvar isIgnored = common.isIgnored\n\nfunction globSync (pattern, options) {\n  if (typeof options === 'function' || arguments.length === 3)\n    throw new TypeError('callback provided to sync glob\\n'+\n                        'See: https://github.com/isaacs/node-glob/issues/167')\n\n  return new GlobSync(pattern, options).found\n}\n\nfunction GlobSync (pattern, options) {\n  if (!pattern)\n    throw new Error('must provide pattern')\n\n  if (typeof options === 'function' || arguments.length === 3)\n    throw new TypeError('callback provided to sync glob\\n'+\n                        'See: https://github.com/isaacs/node-glob/issues/167')\n\n  if (!(this instanceof GlobSync))\n    return new GlobSync(pattern, options)\n\n  setopts(this, pattern, options)\n\n  if (this.noprocess)\n    return this\n\n  var n = this.minimatch.set.length\n  this.matches = new Array(n)\n  for (var i = 0; i < n; i ++) {\n    this._process(this.minimatch.set[i], i, false)\n  }\n  this._finish()\n}\n\nGlobSync.prototype._finish = function () {\n  assert(this instanceof GlobSync)\n  if (this.realpath) {\n    var self = this\n    this.matches.forEach(function (matchset, index) {\n      var set = self.matches[index] = Object.create(null)\n      for (var p in matchset) {\n        try {\n          p = self._makeAbs(p)\n          var real = rp.realpathSync(p, self.realpathCache)\n          set[real] = true\n        } catch (er) {\n          if (er.syscall === 'stat')\n            set[self._makeAbs(p)] = true\n          else\n            throw er\n        }\n      }\n    })\n  }\n  common.finish(this)\n}\n\n\nGlobSync.prototype._process = function (pattern, index, inGlobStar) {\n  assert(this instanceof GlobSync)\n\n  // Get the first [n] parts of pattern that are all strings.\n  var n = 0\n  while (typeof pattern[n] === 'string') {\n    n ++\n  }\n  // now n is the index of the first one that is *not* a string.\n\n  // See if there's anything else\n  var prefix\n  switch (n) {\n    // if not, then this is rather simple\n    case pattern.length:\n      this._processSimple(pattern.join('/'), index)\n      return\n\n    case 0:\n      // pattern *starts* with some non-trivial item.\n      // going to readdir(cwd), but not include the prefix in matches.\n      prefix = null\n      break\n\n    default:\n      // pattern has some string bits in the front.\n      // whatever it starts with, whether that's 'absolute' like /foo/bar,\n      // or 'relative' like '../baz'\n      prefix = pattern.slice(0, n).join('/')\n      break\n  }\n\n  var remain = pattern.slice(n)\n\n  // get the list of entries.\n  var read\n  if (prefix === null)\n    read = '.'\n  else if (isAbsolute(prefix) || isAbsolute(pattern.join('/'))) {\n    if (!prefix || !isAbsolute(prefix))\n      prefix = '/' + prefix\n    read = prefix\n  } else\n    read = prefix\n\n  var abs = this._makeAbs(read)\n\n  //if ignored, skip processing\n  if (childrenIgnored(this, read))\n    return\n\n  var isGlobStar = remain[0] === minimatch.GLOBSTAR\n  if (isGlobStar)\n    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar)\n  else\n    this._processReaddir(prefix, read, abs, remain, index, inGlobStar)\n}\n\n\nGlobSync.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar) {\n  var entries = this._readdir(abs, inGlobStar)\n\n  // if the abs isn't a dir, then nothing can match!\n  if (!entries)\n    return\n\n  // It will only match dot entries if it starts with a dot, or if\n  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.\n  var pn = remain[0]\n  var negate = !!this.minimatch.negate\n  var rawGlob = pn._glob\n  var dotOk = this.dot || rawGlob.charAt(0) === '.'\n\n  var matchedEntries = []\n  for (var i = 0; i < entries.length; i++) {\n    var e = entries[i]\n    if (e.charAt(0) !== '.' || dotOk) {\n      var m\n      if (negate && !prefix) {\n        m = !e.match(pn)\n      } else {\n        m = e.match(pn)\n      }\n      if (m)\n        matchedEntries.push(e)\n    }\n  }\n\n  var len = matchedEntries.length\n  // If there are no matched entries, then nothing matches.\n  if (len === 0)\n    return\n\n  // if this is the last remaining pattern bit, then no need for\n  // an additional stat *unless* the user has specified mark or\n  // stat explicitly.  We know they exist, since readdir returned\n  // them.\n\n  if (remain.length === 1 && !this.mark && !this.stat) {\n    if (!this.matches[index])\n      this.matches[index] = Object.create(null)\n\n    for (var i = 0; i < len; i ++) {\n      var e = matchedEntries[i]\n      if (prefix) {\n        if (prefix.slice(-1) !== '/')\n          e = prefix + '/' + e\n        else\n          e = prefix + e\n      }\n\n      if (e.charAt(0) === '/' && !this.nomount) {\n        e = path.join(this.root, e)\n      }\n      this._emitMatch(index, e)\n    }\n    // This was the last one, and no stats were needed\n    return\n  }\n\n  // now test all matched entries as stand-ins for that part\n  // of the pattern.\n  remain.shift()\n  for (var i = 0; i < len; i ++) {\n    var e = matchedEntries[i]\n    var newPattern\n    if (prefix)\n      newPattern = [prefix, e]\n    else\n      newPattern = [e]\n    this._process(newPattern.concat(remain), index, inGlobStar)\n  }\n}\n\n\nGlobSync.prototype._emitMatch = function (index, e) {\n  if (isIgnored(this, e))\n    return\n\n  var abs = this._makeAbs(e)\n\n  if (this.mark)\n    e = this._mark(e)\n\n  if (this.absolute) {\n    e = abs\n  }\n\n  if (this.matches[index][e])\n    return\n\n  if (this.nodir) {\n    var c = this.cache[abs]\n    if (c === 'DIR' || Array.isArray(c))\n      return\n  }\n\n  this.matches[index][e] = true\n\n  if (this.stat)\n    this._stat(e)\n}\n\n\nGlobSync.prototype._readdirInGlobStar = function (abs) {\n  // follow all symlinked directories forever\n  // just proceed as if this is a non-globstar situation\n  if (this.follow)\n    return this._readdir(abs, false)\n\n  var entries\n  var lstat\n  var stat\n  try {\n    lstat = fs.lstatSync(abs)\n  } catch (er) {\n    if (er.code === 'ENOENT') {\n      // lstat failed, doesn't exist\n      return null\n    }\n  }\n\n  var isSym = lstat && lstat.isSymbolicLink()\n  this.symlinks[abs] = isSym\n\n  // If it's not a symlink or a dir, then it's definitely a regular file.\n  // don't bother doing a readdir in that case.\n  if (!isSym && lstat && !lstat.isDirectory())\n    this.cache[abs] = 'FILE'\n  else\n    entries = this._readdir(abs, false)\n\n  return entries\n}\n\nGlobSync.prototype._readdir = function (abs, inGlobStar) {\n  var entries\n\n  if (inGlobStar && !ownProp(this.symlinks, abs))\n    return this._readdirInGlobStar(abs)\n\n  if (ownProp(this.cache, abs)) {\n    var c = this.cache[abs]\n    if (!c || c === 'FILE')\n      return null\n\n    if (Array.isArray(c))\n      return c\n  }\n\n  try {\n    return this._readdirEntries(abs, fs.readdirSync(abs))\n  } catch (er) {\n    this._readdirError(abs, er)\n    return null\n  }\n}\n\nGlobSync.prototype._readdirEntries = function (abs, entries) {\n  // if we haven't asked to stat everything, then just\n  // assume that everything in there exists, so we can avoid\n  // having to stat it a second time.\n  if (!this.mark && !this.stat) {\n    for (var i = 0; i < entries.length; i ++) {\n      var e = entries[i]\n      if (abs === '/')\n        e = abs + e\n      else\n        e = abs + '/' + e\n      this.cache[e] = true\n    }\n  }\n\n  this.cache[abs] = entries\n\n  // mark and cache dir-ness\n  return entries\n}\n\nGlobSync.prototype._readdirError = function (f, er) {\n  // handle errors, and cache the information\n  switch (er.code) {\n    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205\n    case 'ENOTDIR': // totally normal. means it *does* exist.\n      var abs = this._makeAbs(f)\n      this.cache[abs] = 'FILE'\n      if (abs === this.cwdAbs) {\n        var error = new Error(er.code + ' invalid cwd ' + this.cwd)\n        error.path = this.cwd\n        error.code = er.code\n        throw error\n      }\n      break\n\n    case 'ENOENT': // not terribly unusual\n    case 'ELOOP':\n    case 'ENAMETOOLONG':\n    case 'UNKNOWN':\n      this.cache[this._makeAbs(f)] = false\n      break\n\n    default: // some unusual error.  Treat as failure.\n      this.cache[this._makeAbs(f)] = false\n      if (this.strict)\n        throw er\n      if (!this.silent)\n        console.error('glob error', er)\n      break\n  }\n}\n\nGlobSync.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar) {\n\n  var entries = this._readdir(abs, inGlobStar)\n\n  // no entries means not a dir, so it can never have matches\n  // foo.txt/** doesn't match foo.txt\n  if (!entries)\n    return\n\n  // test without the globstar, and with every child both below\n  // and replacing the globstar.\n  var remainWithoutGlobStar = remain.slice(1)\n  var gspref = prefix ? [ prefix ] : []\n  var noGlobStar = gspref.concat(remainWithoutGlobStar)\n\n  // the noGlobStar pattern exits the inGlobStar state\n  this._process(noGlobStar, index, false)\n\n  var len = entries.length\n  var isSym = this.symlinks[abs]\n\n  // If it's a symlink, and we're in a globstar, then stop\n  if (isSym && inGlobStar)\n    return\n\n  for (var i = 0; i < len; i++) {\n    var e = entries[i]\n    if (e.charAt(0) === '.' && !this.dot)\n      continue\n\n    // these two cases enter the inGlobStar state\n    var instead = gspref.concat(entries[i], remainWithoutGlobStar)\n    this._process(instead, index, true)\n\n    var below = gspref.concat(entries[i], remain)\n    this._process(below, index, true)\n  }\n}\n\nGlobSync.prototype._processSimple = function (prefix, index) {\n  // XXX review this.  Shouldn't it be doing the mounting etc\n  // before doing stat?  kinda weird?\n  var exists = this._stat(prefix)\n\n  if (!this.matches[index])\n    this.matches[index] = Object.create(null)\n\n  // If it doesn't exist, then just mark the lack of results\n  if (!exists)\n    return\n\n  if (prefix && isAbsolute(prefix) && !this.nomount) {\n    var trail = /[\\/\\\\]$/.test(prefix)\n    if (prefix.charAt(0) === '/') {\n      prefix = path.join(this.root, prefix)\n    } else {\n      prefix = path.resolve(this.root, prefix)\n      if (trail)\n        prefix += '/'\n    }\n  }\n\n  if (process.platform === 'win32')\n    prefix = prefix.replace(/\\\\/g, '/')\n\n  // Mark this as a match\n  this._emitMatch(index, prefix)\n}\n\n// Returns either 'DIR', 'FILE', or false\nGlobSync.prototype._stat = function (f) {\n  var abs = this._makeAbs(f)\n  var needDir = f.slice(-1) === '/'\n\n  if (f.length > this.maxLength)\n    return false\n\n  if (!this.stat && ownProp(this.cache, abs)) {\n    var c = this.cache[abs]\n\n    if (Array.isArray(c))\n      c = 'DIR'\n\n    // It exists, but maybe not how we need it\n    if (!needDir || c === 'DIR')\n      return c\n\n    if (needDir && c === 'FILE')\n      return false\n\n    // otherwise we have to stat, because maybe c=true\n    // if we know it exists, but not what it is.\n  }\n\n  var exists\n  var stat = this.statCache[abs]\n  if (!stat) {\n    var lstat\n    try {\n      lstat = fs.lstatSync(abs)\n    } catch (er) {\n      if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {\n        this.statCache[abs] = false\n        return false\n      }\n    }\n\n    if (lstat && lstat.isSymbolicLink()) {\n      try {\n        stat = fs.statSync(abs)\n      } catch (er) {\n        stat = lstat\n      }\n    } else {\n      stat = lstat\n    }\n  }\n\n  this.statCache[abs] = stat\n\n  var c = true\n  if (stat)\n    c = stat.isDirectory() ? 'DIR' : 'FILE'\n\n  this.cache[abs] = this.cache[abs] || c\n\n  if (needDir && c === 'FILE')\n    return false\n\n  return c\n}\n\nGlobSync.prototype._mark = function (p) {\n  return common.mark(this, p)\n}\n\nGlobSync.prototype._makeAbs = function (f) {\n  return common.makeAbs(this, f)\n}\n\n\n//# sourceURL=webpack:///./node_modules/glob/sync.js?");

/***/ }),

/***/ "./node_modules/inflight/inflight.js":
/*!*******************************************!*\
  !*** ./node_modules/inflight/inflight.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var wrappy = __webpack_require__(/*! wrappy */ \"./node_modules/wrappy/wrappy.js\")\nvar reqs = Object.create(null)\nvar once = __webpack_require__(/*! once */ \"./node_modules/once/once.js\")\n\nmodule.exports = wrappy(inflight)\n\nfunction inflight (key, cb) {\n  if (reqs[key]) {\n    reqs[key].push(cb)\n    return null\n  } else {\n    reqs[key] = [cb]\n    return makeres(key)\n  }\n}\n\nfunction makeres (key) {\n  return once(function RES () {\n    var cbs = reqs[key]\n    var len = cbs.length\n    var args = slice(arguments)\n\n    // XXX It's somewhat ambiguous whether a new callback added in this\n    // pass should be queued for later execution if something in the\n    // list of callbacks throws, or if it should just be discarded.\n    // However, it's such an edge case that it hardly matters, and either\n    // choice is likely as surprising as the other.\n    // As it happens, we do go ahead and schedule it for later execution.\n    try {\n      for (var i = 0; i < len; i++) {\n        cbs[i].apply(null, args)\n      }\n    } finally {\n      if (cbs.length > len) {\n        // added more in the interim.\n        // de-zalgo, just in case, but don't call again.\n        cbs.splice(0, len)\n        process.nextTick(function () {\n          RES.apply(null, args)\n        })\n      } else {\n        delete reqs[key]\n      }\n    }\n  })\n}\n\nfunction slice (args) {\n  var length = args.length\n  var array = []\n\n  for (var i = 0; i < length; i++) array[i] = args[i]\n  return array\n}\n\n\n//# sourceURL=webpack:///./node_modules/inflight/inflight.js?");

/***/ }),

/***/ "./node_modules/inherits/inherits.js":
/*!*******************************************!*\
  !*** ./node_modules/inherits/inherits.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("try {\n  var util = __webpack_require__(/*! util */ \"util\");\n  if (typeof util.inherits !== 'function') throw '';\n  module.exports = util.inherits;\n} catch (e) {\n  module.exports = __webpack_require__(/*! ./inherits_browser.js */ \"./node_modules/inherits/inherits_browser.js\");\n}\n\n\n//# sourceURL=webpack:///./node_modules/inherits/inherits.js?");

/***/ }),

/***/ "./node_modules/inherits/inherits_browser.js":
/*!***************************************************!*\
  !*** ./node_modules/inherits/inherits_browser.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("if (typeof Object.create === 'function') {\n  // implementation from standard node.js 'util' module\n  module.exports = function inherits(ctor, superCtor) {\n    ctor.super_ = superCtor\n    ctor.prototype = Object.create(superCtor.prototype, {\n      constructor: {\n        value: ctor,\n        enumerable: false,\n        writable: true,\n        configurable: true\n      }\n    });\n  };\n} else {\n  // old school shim for old browsers\n  module.exports = function inherits(ctor, superCtor) {\n    ctor.super_ = superCtor\n    var TempCtor = function () {}\n    TempCtor.prototype = superCtor.prototype\n    ctor.prototype = new TempCtor()\n    ctor.prototype.constructor = ctor\n  }\n}\n\n\n//# sourceURL=webpack:///./node_modules/inherits/inherits_browser.js?");

/***/ }),

/***/ "./node_modules/keyboardevent-from-electron-accelerator/index.js":
/*!***********************************************************************!*\
  !*** ./node_modules/keyboardevent-from-electron-accelerator/index.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, '__esModule', { value: true });\n\nconst modifiers = /^(CommandOrControl|CmdOrCtrl|Command|Cmd|Control|Ctrl|Alt|Option|AltGr|Shift|Super)/i;\nconst keyCodes = /^(Plus|Space|Tab|Backspace|Delete|Insert|Return|Enter|Up|Down|Left|Right|Home|End|PageUp|PageDown|Escape|Esc|VolumeUp|VolumeDown|VolumeMute|MediaNextTrack|MediaPreviousTrack|MediaStop|MediaPlayPause|PrintScreen|F24|F23|F22|F21|F20|F19|F18|F17|F16|F15|F14|F13|F12|F11|F10|F9|F8|F7|F6|F5|F4|F3|F2|F1|[0-9A-Z)!@#$%^&*(:+<_>?~{|}\";=,\\-./`[\\\\\\]'])/i;\nconst UNSUPPORTED = {};\n\nfunction reduceModifier({accelerator, event}, modifier) {\n\tswitch (modifier) {\n\t\tcase 'command':\n\t\tcase 'cmd': {\n\t\t\tif (process.platform !== 'darwin') {\n\t\t\t\treturn UNSUPPORTED;\n\t\t\t}\n\n\t\t\tif (event.metaKey) {\n\t\t\t\tthrow new Error('Double `Command` modifier specified.');\n\t\t\t}\n\n\t\t\treturn {\n\t\t\t\tevent: Object.assign({}, event, {metaKey: true}),\n\t\t\t\taccelerator: accelerator.slice(modifier.length)\n\t\t\t};\n\t\t}\n\t\tcase 'super': {\n\t\t\tif (event.metaKey) {\n\t\t\t\tthrow new Error('Double `Super` modifier specified.');\n\t\t\t}\n\n\t\t\treturn {\n\t\t\t\tevent: Object.assign({}, event, {metaKey: true}),\n\t\t\t\taccelerator: accelerator.slice(modifier.length)\n\t\t\t};\n\t\t}\n\t\tcase 'control':\n\t\tcase 'ctrl': {\n\t\t\tif (event.ctrlKey) {\n\t\t\t\tthrow new Error('Double `Control` modifier specified.');\n\t\t\t}\n\n\t\t\treturn {\n\t\t\t\tevent: Object.assign({}, event, {ctrlKey: true}),\n\t\t\t\taccelerator: accelerator.slice(modifier.length)\n\t\t\t};\n\t\t}\n\t\tcase 'commandorcontrol':\n\t\tcase 'cmdorctrl': {\n\t\t\tif (process.platform === 'darwin') {\n\t\t\t\tif (event.metaKey) {\n\t\t\t\t\tthrow new Error('Double `Command` modifier specified.');\n\t\t\t\t}\n\n\t\t\t\treturn {\n\t\t\t\t\tevent: Object.assign({}, event, {metaKey: true}),\n\t\t\t\t\taccelerator: accelerator.slice(modifier.length)\n\t\t\t\t};\n\t\t\t}\n\n\t\t\tif (event.ctrlKey) {\n\t\t\t\tthrow new Error('Double `Control` modifier specified.');\n\t\t\t}\n\n\t\t\treturn {\n\t\t\t\tevent: Object.assign({}, event, {ctrlKey: true}),\n\t\t\t\taccelerator: accelerator.slice(modifier.length)\n\t\t\t};\n\t\t}\n\t\tcase 'option':\n\t\tcase 'altgr':\n\t\tcase 'alt': {\n\t\t\tif (modifier === 'option' && process.platform !== 'darwin') {\n\t\t\t\treturn UNSUPPORTED;\n\t\t\t}\n\n\t\t\tif (event.altKey) {\n\t\t\t\tthrow new Error('Double `Alt` modifier specified.');\n\t\t\t}\n\n\t\t\treturn {\n\t\t\t\tevent: Object.assign({}, event, {altKey: true}),\n\t\t\t\taccelerator: accelerator.slice(modifier.length)\n\t\t\t};\n\t\t}\n\t\tcase 'shift': {\n\t\t\tif (event.shiftKey) {\n\t\t\t\tthrow new Error('Double `Shift` modifier specified.');\n\t\t\t}\n\n\t\t\treturn {\n\t\t\t\tevent: Object.assign({}, event, {shiftKey: true}),\n\t\t\t\taccelerator: accelerator.slice(modifier.length)\n\t\t\t};\n\t\t}\n\n\t\tdefault:\n\t\t\tconsole.error(modifier);\n\t}\n}\n\nfunction reducePlus({accelerator, event}) {\n\treturn {\n\t\tevent,\n\t\taccelerator: accelerator.trim().slice(1)\n\t};\n}\n\nconst virtualKeyCodes = {\n\t0: 'Digit0',\n\t1: 'Digit1',\n\t2: 'Digit2',\n\t3: 'Digit3',\n\t4: 'Digit4',\n\t5: 'Digit5',\n\t6: 'Digit6',\n\t7: 'Digit7',\n\t8: 'Digit8',\n\t9: 'Digit9',\n\t'-': 'Minus',\n\t'=': 'Equal',\n\tQ: 'KeyQ',\n\tW: 'KeyW',\n\tE: 'KeyE',\n\tR: 'KeyR',\n\tT: 'KeyT',\n\tY: 'KeyY',\n\tU: 'KeyU',\n\tI: 'KeyI',\n\tO: 'KeyO',\n\tP: 'KeyP',\n\t'[': 'BracketLeft',\n\t']': 'BracketRight',\n\tA: 'KeyA',\n\tS: 'KeyS',\n\tD: 'KeyD',\n\tF: 'KeyF',\n\tG: 'KeyG',\n\tH: 'KeyH',\n\tJ: 'KeyJ',\n\tK: 'KeyK',\n\tL: 'KeyL',\n\t';': 'Semicolon',\n\t'\\'': 'Quote',\n\t'`': 'Backquote',\n\t'/': 'Backslash',\n\tZ: 'KeyZ',\n\tX: 'KeyX',\n\tC: 'KeyC',\n\tV: 'KeyV',\n\tB: 'KeyB',\n\tN: 'KeyN',\n\tM: 'KeyM',\n\t',': 'Comma',\n\t'.': 'Period',\n\t'\\\\': 'Slash',\n\t' ': 'Space'\n};\n\nfunction reduceKey({accelerator, event}, key) {\n\tif (key.length > 1 || event.key) {\n\t\tthrow new Error(`Unvalid keycode \\`${key}\\`.`);\n\t}\n\n\tconst code =\n\t\tkey.toUpperCase() in virtualKeyCodes ?\n\t\t\tvirtualKeyCodes[key.toUpperCase()] :\n\t\t\tnull;\n\n\treturn {\n\t\tevent: Object.assign({}, event, {key}, code ? {code} : null),\n\t\taccelerator: accelerator.trim().slice(key.length)\n\t};\n}\n\nconst domKeys = Object.assign(Object.create(null), {\n\tplus: 'Add',\n\tspace: ' ',\n\ttab: 'Tab',\n\tbackspace: 'Backspace',\n\tdelete: 'Delete',\n\tinsert: 'Insert',\n\treturn: 'Return',\n\tenter: 'Return',\n\tup: 'ArrowUp',\n\tdown: 'ArrowDown',\n\tleft: 'ArrowLeft',\n\tright: 'ArrowRight',\n\thome: 'Home',\n\tend: 'End',\n\tpageup: 'PageUp',\n\tpagedown: 'PageDown',\n\tescape: 'Escape',\n\tesc: 'Escape',\n\tvolumeup: 'AudioVolumeUp',\n\tvolumedown: 'AudioVolumeDown',\n\tvolumemute: 'AudioVolumeMute',\n\tmedianexttrack: 'MediaTrackNext',\n\tmediaprevioustrack: 'MediaTrackPrevious',\n\tmediastop: 'MediaStop',\n\tmediaplaypause: 'MediaPlayPause',\n\tprintscreen: 'PrintScreen'\n});\n\n// Add function keys\nfor (let i = 1; i <= 24; i++) {\n\tdomKeys[`f${i}`] = `F${i}`;\n}\n\nfunction reduceCode({accelerator, event}, {code, key}) {\n\tif (event.code) {\n\t\tthrow new Error(`Duplicated keycode \\`${key}\\`.`);\n\t}\n\n\treturn {\n\t\tevent: Object.assign({}, event, {key}, code ? {code} : null),\n\t\taccelerator: accelerator.trim().slice((key && key.length) || 0)\n\t};\n}\n\n/**\n * This function transform an Electron Accelerator string into\n * a DOM KeyboardEvent object.\n *\n * @param  {string} accelerator an Electron Accelerator string, e.g. `Ctrl+C` or `Shift+Space`.\n * @return {object} a DOM KeyboardEvent object derivate from the `accelerator` argument.\n */\nfunction toKeyEvent(accelerator) {\n\tlet state = {accelerator, event: {}};\n\twhile (state.accelerator !== '') {\n\t\tconst modifierMatch = state.accelerator.match(modifiers);\n\t\tif (modifierMatch) {\n\t\t\tconst modifier = modifierMatch[0].toLowerCase();\n\t\t\tstate = reduceModifier(state, modifier);\n\t\t\tif (state === UNSUPPORTED) {\n\t\t\t\treturn {unsupportedKeyForPlatform: true};\n\t\t\t}\n\t\t} else if (state.accelerator.trim()[0] === '+') {\n\t\t\tstate = reducePlus(state);\n\t\t} else {\n\t\t\tconst codeMatch = state.accelerator.match(keyCodes);\n\t\t\tif (codeMatch) {\n\t\t\t\tconst code = codeMatch[0].toLowerCase();\n\t\t\t\tif (code in domKeys) {\n\t\t\t\t\tstate = reduceCode(state, {\n\t\t\t\t\t\tcode: domKeys[code],\n\t\t\t\t\t\tkey: code\n\t\t\t\t\t});\n\t\t\t\t} else {\n\t\t\t\t\tstate = reduceKey(state, code);\n\t\t\t\t}\n\t\t\t} else {\n\t\t\t\tthrow new Error(`Unvalid accelerator: \"${state.accelerator}\"`);\n\t\t\t}\n\t\t}\n\t}\n\treturn state.event;\n}\n\nexports.UNSUPPORTED = UNSUPPORTED;\nexports.reduceModifier = reduceModifier;\nexports.reducePlus = reducePlus;\nexports.reduceKey = reduceKey;\nexports.reduceCode = reduceCode;\nexports.toKeyEvent = toKeyEvent;\n\n\n//# sourceURL=webpack:///./node_modules/keyboardevent-from-electron-accelerator/index.js?");

/***/ }),

/***/ "./node_modules/keyboardevents-areequal/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/keyboardevents-areequal/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nfunction _lower(key) {\n\tif (typeof key !== 'string') {\n\t\treturn key;\n\t}\n\treturn key.toLowerCase();\n}\n\nfunction areEqual(ev1, ev2) {\n\tif (ev1 === ev2) {\n\t\t// Same object\n\t\t// console.log(`Events are same.`)\n\t\treturn true;\n\t}\n\n\tfor (const prop of ['altKey', 'ctrlKey', 'shiftKey', 'metaKey']) {\n\t\tconst [value1, value2] = [ev1[prop], ev2[prop]];\n\n\t\tif (Boolean(value1) !== Boolean(value2)) {\n\t\t\t// One of the prop is different\n\t\t\t// console.log(`Comparing prop ${prop}: ${value1} ${value2}`);\n\t\t\treturn false;\n\t\t}\n\t}\n\n\tif ((_lower(ev1.key) === _lower(ev2.key) && ev1.key !== undefined) ||\n\t\t(ev1.code === ev2.code && ev1.code !== undefined)) {\n\t\t// Events are equals\n\t\treturn true;\n\t}\n\n\t// Key or code are differents\n\t// console.log(`key or code are differents. ${ev1.key} !== ${ev2.key} ${ev1.code} !== ${ev2.code}`);\n\n\treturn false;\n}\n\nmodule.exports = areEqual;\n\n\n//# sourceURL=webpack:///./node_modules/keyboardevents-areequal/index.js?");

/***/ }),

/***/ "./node_modules/minimatch/minimatch.js":
/*!*********************************************!*\
  !*** ./node_modules/minimatch/minimatch.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = minimatch\nminimatch.Minimatch = Minimatch\n\nvar path = { sep: '/' }\ntry {\n  path = __webpack_require__(/*! path */ \"path\")\n} catch (er) {}\n\nvar GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}\nvar expand = __webpack_require__(/*! brace-expansion */ \"./node_modules/brace-expansion/index.js\")\n\nvar plTypes = {\n  '!': { open: '(?:(?!(?:', close: '))[^/]*?)'},\n  '?': { open: '(?:', close: ')?' },\n  '+': { open: '(?:', close: ')+' },\n  '*': { open: '(?:', close: ')*' },\n  '@': { open: '(?:', close: ')' }\n}\n\n// any single thing other than /\n// don't need to escape / when using new RegExp()\nvar qmark = '[^/]'\n\n// * => any number of characters\nvar star = qmark + '*?'\n\n// ** when dots are allowed.  Anything goes, except .. and .\n// not (^ or / followed by one or two dots followed by $ or /),\n// followed by anything, any number of times.\nvar twoStarDot = '(?:(?!(?:\\\\\\/|^)(?:\\\\.{1,2})($|\\\\\\/)).)*?'\n\n// not a ^ or / followed by a dot,\n// followed by anything, any number of times.\nvar twoStarNoDot = '(?:(?!(?:\\\\\\/|^)\\\\.).)*?'\n\n// characters that need to be escaped in RegExp.\nvar reSpecials = charSet('().*{}+?[]^$\\\\!')\n\n// \"abc\" -> { a:true, b:true, c:true }\nfunction charSet (s) {\n  return s.split('').reduce(function (set, c) {\n    set[c] = true\n    return set\n  }, {})\n}\n\n// normalizes slashes.\nvar slashSplit = /\\/+/\n\nminimatch.filter = filter\nfunction filter (pattern, options) {\n  options = options || {}\n  return function (p, i, list) {\n    return minimatch(p, pattern, options)\n  }\n}\n\nfunction ext (a, b) {\n  a = a || {}\n  b = b || {}\n  var t = {}\n  Object.keys(b).forEach(function (k) {\n    t[k] = b[k]\n  })\n  Object.keys(a).forEach(function (k) {\n    t[k] = a[k]\n  })\n  return t\n}\n\nminimatch.defaults = function (def) {\n  if (!def || !Object.keys(def).length) return minimatch\n\n  var orig = minimatch\n\n  var m = function minimatch (p, pattern, options) {\n    return orig.minimatch(p, pattern, ext(def, options))\n  }\n\n  m.Minimatch = function Minimatch (pattern, options) {\n    return new orig.Minimatch(pattern, ext(def, options))\n  }\n\n  return m\n}\n\nMinimatch.defaults = function (def) {\n  if (!def || !Object.keys(def).length) return Minimatch\n  return minimatch.defaults(def).Minimatch\n}\n\nfunction minimatch (p, pattern, options) {\n  if (typeof pattern !== 'string') {\n    throw new TypeError('glob pattern string required')\n  }\n\n  if (!options) options = {}\n\n  // shortcut: comments match nothing.\n  if (!options.nocomment && pattern.charAt(0) === '#') {\n    return false\n  }\n\n  // \"\" only matches \"\"\n  if (pattern.trim() === '') return p === ''\n\n  return new Minimatch(pattern, options).match(p)\n}\n\nfunction Minimatch (pattern, options) {\n  if (!(this instanceof Minimatch)) {\n    return new Minimatch(pattern, options)\n  }\n\n  if (typeof pattern !== 'string') {\n    throw new TypeError('glob pattern string required')\n  }\n\n  if (!options) options = {}\n  pattern = pattern.trim()\n\n  // windows support: need to use /, not \\\n  if (path.sep !== '/') {\n    pattern = pattern.split(path.sep).join('/')\n  }\n\n  this.options = options\n  this.set = []\n  this.pattern = pattern\n  this.regexp = null\n  this.negate = false\n  this.comment = false\n  this.empty = false\n\n  // make the set of regexps etc.\n  this.make()\n}\n\nMinimatch.prototype.debug = function () {}\n\nMinimatch.prototype.make = make\nfunction make () {\n  // don't do it more than once.\n  if (this._made) return\n\n  var pattern = this.pattern\n  var options = this.options\n\n  // empty patterns and comments match nothing.\n  if (!options.nocomment && pattern.charAt(0) === '#') {\n    this.comment = true\n    return\n  }\n  if (!pattern) {\n    this.empty = true\n    return\n  }\n\n  // step 1: figure out negation, etc.\n  this.parseNegate()\n\n  // step 2: expand braces\n  var set = this.globSet = this.braceExpand()\n\n  if (options.debug) this.debug = console.error\n\n  this.debug(this.pattern, set)\n\n  // step 3: now we have a set, so turn each one into a series of path-portion\n  // matching patterns.\n  // These will be regexps, except in the case of \"**\", which is\n  // set to the GLOBSTAR object for globstar behavior,\n  // and will not contain any / characters\n  set = this.globParts = set.map(function (s) {\n    return s.split(slashSplit)\n  })\n\n  this.debug(this.pattern, set)\n\n  // glob --> regexps\n  set = set.map(function (s, si, set) {\n    return s.map(this.parse, this)\n  }, this)\n\n  this.debug(this.pattern, set)\n\n  // filter out everything that didn't compile properly.\n  set = set.filter(function (s) {\n    return s.indexOf(false) === -1\n  })\n\n  this.debug(this.pattern, set)\n\n  this.set = set\n}\n\nMinimatch.prototype.parseNegate = parseNegate\nfunction parseNegate () {\n  var pattern = this.pattern\n  var negate = false\n  var options = this.options\n  var negateOffset = 0\n\n  if (options.nonegate) return\n\n  for (var i = 0, l = pattern.length\n    ; i < l && pattern.charAt(i) === '!'\n    ; i++) {\n    negate = !negate\n    negateOffset++\n  }\n\n  if (negateOffset) this.pattern = pattern.substr(negateOffset)\n  this.negate = negate\n}\n\n// Brace expansion:\n// a{b,c}d -> abd acd\n// a{b,}c -> abc ac\n// a{0..3}d -> a0d a1d a2d a3d\n// a{b,c{d,e}f}g -> abg acdfg acefg\n// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg\n//\n// Invalid sets are not expanded.\n// a{2..}b -> a{2..}b\n// a{b}c -> a{b}c\nminimatch.braceExpand = function (pattern, options) {\n  return braceExpand(pattern, options)\n}\n\nMinimatch.prototype.braceExpand = braceExpand\n\nfunction braceExpand (pattern, options) {\n  if (!options) {\n    if (this instanceof Minimatch) {\n      options = this.options\n    } else {\n      options = {}\n    }\n  }\n\n  pattern = typeof pattern === 'undefined'\n    ? this.pattern : pattern\n\n  if (typeof pattern === 'undefined') {\n    throw new TypeError('undefined pattern')\n  }\n\n  if (options.nobrace ||\n    !pattern.match(/\\{.*\\}/)) {\n    // shortcut. no need to expand.\n    return [pattern]\n  }\n\n  return expand(pattern)\n}\n\n// parse a component of the expanded set.\n// At this point, no pattern may contain \"/\" in it\n// so we're going to return a 2d array, where each entry is the full\n// pattern, split on '/', and then turned into a regular expression.\n// A regexp is made at the end which joins each array with an\n// escaped /, and another full one which joins each regexp with |.\n//\n// Following the lead of Bash 4.1, note that \"**\" only has special meaning\n// when it is the *only* thing in a path portion.  Otherwise, any series\n// of * is equivalent to a single *.  Globstar behavior is enabled by\n// default, and can be disabled by setting options.noglobstar.\nMinimatch.prototype.parse = parse\nvar SUBPARSE = {}\nfunction parse (pattern, isSub) {\n  if (pattern.length > 1024 * 64) {\n    throw new TypeError('pattern is too long')\n  }\n\n  var options = this.options\n\n  // shortcuts\n  if (!options.noglobstar && pattern === '**') return GLOBSTAR\n  if (pattern === '') return ''\n\n  var re = ''\n  var hasMagic = !!options.nocase\n  var escaping = false\n  // ? => one single character\n  var patternListStack = []\n  var negativeLists = []\n  var stateChar\n  var inClass = false\n  var reClassStart = -1\n  var classStart = -1\n  // . and .. never match anything that doesn't start with .,\n  // even when options.dot is set.\n  var patternStart = pattern.charAt(0) === '.' ? '' // anything\n  // not (start or / followed by . or .. followed by / or end)\n  : options.dot ? '(?!(?:^|\\\\\\/)\\\\.{1,2}(?:$|\\\\\\/))'\n  : '(?!\\\\.)'\n  var self = this\n\n  function clearStateChar () {\n    if (stateChar) {\n      // we had some state-tracking character\n      // that wasn't consumed by this pass.\n      switch (stateChar) {\n        case '*':\n          re += star\n          hasMagic = true\n        break\n        case '?':\n          re += qmark\n          hasMagic = true\n        break\n        default:\n          re += '\\\\' + stateChar\n        break\n      }\n      self.debug('clearStateChar %j %j', stateChar, re)\n      stateChar = false\n    }\n  }\n\n  for (var i = 0, len = pattern.length, c\n    ; (i < len) && (c = pattern.charAt(i))\n    ; i++) {\n    this.debug('%s\\t%s %s %j', pattern, i, re, c)\n\n    // skip over any that are escaped.\n    if (escaping && reSpecials[c]) {\n      re += '\\\\' + c\n      escaping = false\n      continue\n    }\n\n    switch (c) {\n      case '/':\n        // completely not allowed, even escaped.\n        // Should already be path-split by now.\n        return false\n\n      case '\\\\':\n        clearStateChar()\n        escaping = true\n      continue\n\n      // the various stateChar values\n      // for the \"extglob\" stuff.\n      case '?':\n      case '*':\n      case '+':\n      case '@':\n      case '!':\n        this.debug('%s\\t%s %s %j <-- stateChar', pattern, i, re, c)\n\n        // all of those are literals inside a class, except that\n        // the glob [!a] means [^a] in regexp\n        if (inClass) {\n          this.debug('  in class')\n          if (c === '!' && i === classStart + 1) c = '^'\n          re += c\n          continue\n        }\n\n        // if we already have a stateChar, then it means\n        // that there was something like ** or +? in there.\n        // Handle the stateChar, then proceed with this one.\n        self.debug('call clearStateChar %j', stateChar)\n        clearStateChar()\n        stateChar = c\n        // if extglob is disabled, then +(asdf|foo) isn't a thing.\n        // just clear the statechar *now*, rather than even diving into\n        // the patternList stuff.\n        if (options.noext) clearStateChar()\n      continue\n\n      case '(':\n        if (inClass) {\n          re += '('\n          continue\n        }\n\n        if (!stateChar) {\n          re += '\\\\('\n          continue\n        }\n\n        patternListStack.push({\n          type: stateChar,\n          start: i - 1,\n          reStart: re.length,\n          open: plTypes[stateChar].open,\n          close: plTypes[stateChar].close\n        })\n        // negation is (?:(?!js)[^/]*)\n        re += stateChar === '!' ? '(?:(?!(?:' : '(?:'\n        this.debug('plType %j %j', stateChar, re)\n        stateChar = false\n      continue\n\n      case ')':\n        if (inClass || !patternListStack.length) {\n          re += '\\\\)'\n          continue\n        }\n\n        clearStateChar()\n        hasMagic = true\n        var pl = patternListStack.pop()\n        // negation is (?:(?!js)[^/]*)\n        // The others are (?:<pattern>)<type>\n        re += pl.close\n        if (pl.type === '!') {\n          negativeLists.push(pl)\n        }\n        pl.reEnd = re.length\n      continue\n\n      case '|':\n        if (inClass || !patternListStack.length || escaping) {\n          re += '\\\\|'\n          escaping = false\n          continue\n        }\n\n        clearStateChar()\n        re += '|'\n      continue\n\n      // these are mostly the same in regexp and glob\n      case '[':\n        // swallow any state-tracking char before the [\n        clearStateChar()\n\n        if (inClass) {\n          re += '\\\\' + c\n          continue\n        }\n\n        inClass = true\n        classStart = i\n        reClassStart = re.length\n        re += c\n      continue\n\n      case ']':\n        //  a right bracket shall lose its special\n        //  meaning and represent itself in\n        //  a bracket expression if it occurs\n        //  first in the list.  -- POSIX.2 2.8.3.2\n        if (i === classStart + 1 || !inClass) {\n          re += '\\\\' + c\n          escaping = false\n          continue\n        }\n\n        // handle the case where we left a class open.\n        // \"[z-a]\" is valid, equivalent to \"\\[z-a\\]\"\n        if (inClass) {\n          // split where the last [ was, make sure we don't have\n          // an invalid re. if so, re-walk the contents of the\n          // would-be class to re-translate any characters that\n          // were passed through as-is\n          // TODO: It would probably be faster to determine this\n          // without a try/catch and a new RegExp, but it's tricky\n          // to do safely.  For now, this is safe and works.\n          var cs = pattern.substring(classStart + 1, i)\n          try {\n            RegExp('[' + cs + ']')\n          } catch (er) {\n            // not a valid class!\n            var sp = this.parse(cs, SUBPARSE)\n            re = re.substr(0, reClassStart) + '\\\\[' + sp[0] + '\\\\]'\n            hasMagic = hasMagic || sp[1]\n            inClass = false\n            continue\n          }\n        }\n\n        // finish up the class.\n        hasMagic = true\n        inClass = false\n        re += c\n      continue\n\n      default:\n        // swallow any state char that wasn't consumed\n        clearStateChar()\n\n        if (escaping) {\n          // no need\n          escaping = false\n        } else if (reSpecials[c]\n          && !(c === '^' && inClass)) {\n          re += '\\\\'\n        }\n\n        re += c\n\n    } // switch\n  } // for\n\n  // handle the case where we left a class open.\n  // \"[abc\" is valid, equivalent to \"\\[abc\"\n  if (inClass) {\n    // split where the last [ was, and escape it\n    // this is a huge pita.  We now have to re-walk\n    // the contents of the would-be class to re-translate\n    // any characters that were passed through as-is\n    cs = pattern.substr(classStart + 1)\n    sp = this.parse(cs, SUBPARSE)\n    re = re.substr(0, reClassStart) + '\\\\[' + sp[0]\n    hasMagic = hasMagic || sp[1]\n  }\n\n  // handle the case where we had a +( thing at the *end*\n  // of the pattern.\n  // each pattern list stack adds 3 chars, and we need to go through\n  // and escape any | chars that were passed through as-is for the regexp.\n  // Go through and escape them, taking care not to double-escape any\n  // | chars that were already escaped.\n  for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {\n    var tail = re.slice(pl.reStart + pl.open.length)\n    this.debug('setting tail', re, pl)\n    // maybe some even number of \\, then maybe 1 \\, followed by a |\n    tail = tail.replace(/((?:\\\\{2}){0,64})(\\\\?)\\|/g, function (_, $1, $2) {\n      if (!$2) {\n        // the | isn't already escaped, so escape it.\n        $2 = '\\\\'\n      }\n\n      // need to escape all those slashes *again*, without escaping the\n      // one that we need for escaping the | character.  As it works out,\n      // escaping an even number of slashes can be done by simply repeating\n      // it exactly after itself.  That's why this trick works.\n      //\n      // I am sorry that you have to see this.\n      return $1 + $1 + $2 + '|'\n    })\n\n    this.debug('tail=%j\\n   %s', tail, tail, pl, re)\n    var t = pl.type === '*' ? star\n      : pl.type === '?' ? qmark\n      : '\\\\' + pl.type\n\n    hasMagic = true\n    re = re.slice(0, pl.reStart) + t + '\\\\(' + tail\n  }\n\n  // handle trailing things that only matter at the very end.\n  clearStateChar()\n  if (escaping) {\n    // trailing \\\\\n    re += '\\\\\\\\'\n  }\n\n  // only need to apply the nodot start if the re starts with\n  // something that could conceivably capture a dot\n  var addPatternStart = false\n  switch (re.charAt(0)) {\n    case '.':\n    case '[':\n    case '(': addPatternStart = true\n  }\n\n  // Hack to work around lack of negative lookbehind in JS\n  // A pattern like: *.!(x).!(y|z) needs to ensure that a name\n  // like 'a.xyz.yz' doesn't match.  So, the first negative\n  // lookahead, has to look ALL the way ahead, to the end of\n  // the pattern.\n  for (var n = negativeLists.length - 1; n > -1; n--) {\n    var nl = negativeLists[n]\n\n    var nlBefore = re.slice(0, nl.reStart)\n    var nlFirst = re.slice(nl.reStart, nl.reEnd - 8)\n    var nlLast = re.slice(nl.reEnd - 8, nl.reEnd)\n    var nlAfter = re.slice(nl.reEnd)\n\n    nlLast += nlAfter\n\n    // Handle nested stuff like *(*.js|!(*.json)), where open parens\n    // mean that we should *not* include the ) in the bit that is considered\n    // \"after\" the negated section.\n    var openParensBefore = nlBefore.split('(').length - 1\n    var cleanAfter = nlAfter\n    for (i = 0; i < openParensBefore; i++) {\n      cleanAfter = cleanAfter.replace(/\\)[+*?]?/, '')\n    }\n    nlAfter = cleanAfter\n\n    var dollar = ''\n    if (nlAfter === '' && isSub !== SUBPARSE) {\n      dollar = '$'\n    }\n    var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast\n    re = newRe\n  }\n\n  // if the re is not \"\" at this point, then we need to make sure\n  // it doesn't match against an empty path part.\n  // Otherwise a/* will match a/, which it should not.\n  if (re !== '' && hasMagic) {\n    re = '(?=.)' + re\n  }\n\n  if (addPatternStart) {\n    re = patternStart + re\n  }\n\n  // parsing just a piece of a larger pattern.\n  if (isSub === SUBPARSE) {\n    return [re, hasMagic]\n  }\n\n  // skip the regexp for non-magical patterns\n  // unescape anything in it, though, so that it'll be\n  // an exact match against a file etc.\n  if (!hasMagic) {\n    return globUnescape(pattern)\n  }\n\n  var flags = options.nocase ? 'i' : ''\n  try {\n    var regExp = new RegExp('^' + re + '$', flags)\n  } catch (er) {\n    // If it was an invalid regular expression, then it can't match\n    // anything.  This trick looks for a character after the end of\n    // the string, which is of course impossible, except in multi-line\n    // mode, but it's not a /m regex.\n    return new RegExp('$.')\n  }\n\n  regExp._glob = pattern\n  regExp._src = re\n\n  return regExp\n}\n\nminimatch.makeRe = function (pattern, options) {\n  return new Minimatch(pattern, options || {}).makeRe()\n}\n\nMinimatch.prototype.makeRe = makeRe\nfunction makeRe () {\n  if (this.regexp || this.regexp === false) return this.regexp\n\n  // at this point, this.set is a 2d array of partial\n  // pattern strings, or \"**\".\n  //\n  // It's better to use .match().  This function shouldn't\n  // be used, really, but it's pretty convenient sometimes,\n  // when you just want to work with a regex.\n  var set = this.set\n\n  if (!set.length) {\n    this.regexp = false\n    return this.regexp\n  }\n  var options = this.options\n\n  var twoStar = options.noglobstar ? star\n    : options.dot ? twoStarDot\n    : twoStarNoDot\n  var flags = options.nocase ? 'i' : ''\n\n  var re = set.map(function (pattern) {\n    return pattern.map(function (p) {\n      return (p === GLOBSTAR) ? twoStar\n      : (typeof p === 'string') ? regExpEscape(p)\n      : p._src\n    }).join('\\\\\\/')\n  }).join('|')\n\n  // must match entire pattern\n  // ending in a * or ** will make it less strict.\n  re = '^(?:' + re + ')$'\n\n  // can match anything, as long as it's not this.\n  if (this.negate) re = '^(?!' + re + ').*$'\n\n  try {\n    this.regexp = new RegExp(re, flags)\n  } catch (ex) {\n    this.regexp = false\n  }\n  return this.regexp\n}\n\nminimatch.match = function (list, pattern, options) {\n  options = options || {}\n  var mm = new Minimatch(pattern, options)\n  list = list.filter(function (f) {\n    return mm.match(f)\n  })\n  if (mm.options.nonull && !list.length) {\n    list.push(pattern)\n  }\n  return list\n}\n\nMinimatch.prototype.match = match\nfunction match (f, partial) {\n  this.debug('match', f, this.pattern)\n  // short-circuit in the case of busted things.\n  // comments, etc.\n  if (this.comment) return false\n  if (this.empty) return f === ''\n\n  if (f === '/' && partial) return true\n\n  var options = this.options\n\n  // windows: need to use /, not \\\n  if (path.sep !== '/') {\n    f = f.split(path.sep).join('/')\n  }\n\n  // treat the test path as a set of pathparts.\n  f = f.split(slashSplit)\n  this.debug(this.pattern, 'split', f)\n\n  // just ONE of the pattern sets in this.set needs to match\n  // in order for it to be valid.  If negating, then just one\n  // match means that we have failed.\n  // Either way, return on the first hit.\n\n  var set = this.set\n  this.debug(this.pattern, 'set', set)\n\n  // Find the basename of the path by looking for the last non-empty segment\n  var filename\n  var i\n  for (i = f.length - 1; i >= 0; i--) {\n    filename = f[i]\n    if (filename) break\n  }\n\n  for (i = 0; i < set.length; i++) {\n    var pattern = set[i]\n    var file = f\n    if (options.matchBase && pattern.length === 1) {\n      file = [filename]\n    }\n    var hit = this.matchOne(file, pattern, partial)\n    if (hit) {\n      if (options.flipNegate) return true\n      return !this.negate\n    }\n  }\n\n  // didn't get any hits.  this is success if it's a negative\n  // pattern, failure otherwise.\n  if (options.flipNegate) return false\n  return this.negate\n}\n\n// set partial to true to test if, for example,\n// \"/a/b\" matches the start of \"/*/b/*/d\"\n// Partial means, if you run out of file before you run\n// out of pattern, then that's fine, as long as all\n// the parts match.\nMinimatch.prototype.matchOne = function (file, pattern, partial) {\n  var options = this.options\n\n  this.debug('matchOne',\n    { 'this': this, file: file, pattern: pattern })\n\n  this.debug('matchOne', file.length, pattern.length)\n\n  for (var fi = 0,\n      pi = 0,\n      fl = file.length,\n      pl = pattern.length\n      ; (fi < fl) && (pi < pl)\n      ; fi++, pi++) {\n    this.debug('matchOne loop')\n    var p = pattern[pi]\n    var f = file[fi]\n\n    this.debug(pattern, p, f)\n\n    // should be impossible.\n    // some invalid regexp stuff in the set.\n    if (p === false) return false\n\n    if (p === GLOBSTAR) {\n      this.debug('GLOBSTAR', [pattern, p, f])\n\n      // \"**\"\n      // a/**/b/**/c would match the following:\n      // a/b/x/y/z/c\n      // a/x/y/z/b/c\n      // a/b/x/b/x/c\n      // a/b/c\n      // To do this, take the rest of the pattern after\n      // the **, and see if it would match the file remainder.\n      // If so, return success.\n      // If not, the ** \"swallows\" a segment, and try again.\n      // This is recursively awful.\n      //\n      // a/**/b/**/c matching a/b/x/y/z/c\n      // - a matches a\n      // - doublestar\n      //   - matchOne(b/x/y/z/c, b/**/c)\n      //     - b matches b\n      //     - doublestar\n      //       - matchOne(x/y/z/c, c) -> no\n      //       - matchOne(y/z/c, c) -> no\n      //       - matchOne(z/c, c) -> no\n      //       - matchOne(c, c) yes, hit\n      var fr = fi\n      var pr = pi + 1\n      if (pr === pl) {\n        this.debug('** at the end')\n        // a ** at the end will just swallow the rest.\n        // We have found a match.\n        // however, it will not swallow /.x, unless\n        // options.dot is set.\n        // . and .. are *never* matched by **, for explosively\n        // exponential reasons.\n        for (; fi < fl; fi++) {\n          if (file[fi] === '.' || file[fi] === '..' ||\n            (!options.dot && file[fi].charAt(0) === '.')) return false\n        }\n        return true\n      }\n\n      // ok, let's see if we can swallow whatever we can.\n      while (fr < fl) {\n        var swallowee = file[fr]\n\n        this.debug('\\nglobstar while', file, fr, pattern, pr, swallowee)\n\n        // XXX remove this slice.  Just pass the start index.\n        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {\n          this.debug('globstar found match!', fr, fl, swallowee)\n          // found a match.\n          return true\n        } else {\n          // can't swallow \".\" or \"..\" ever.\n          // can only swallow \".foo\" when explicitly asked.\n          if (swallowee === '.' || swallowee === '..' ||\n            (!options.dot && swallowee.charAt(0) === '.')) {\n            this.debug('dot detected!', file, fr, pattern, pr)\n            break\n          }\n\n          // ** swallows a segment, and continue.\n          this.debug('globstar swallow a segment, and continue')\n          fr++\n        }\n      }\n\n      // no match was found.\n      // However, in partial mode, we can't say this is necessarily over.\n      // If there's more *pattern* left, then\n      if (partial) {\n        // ran out of file\n        this.debug('\\n>>> no match, partial?', file, fr, pattern, pr)\n        if (fr === fl) return true\n      }\n      return false\n    }\n\n    // something other than **\n    // non-magic patterns just have to match exactly\n    // patterns with magic have been turned into regexps.\n    var hit\n    if (typeof p === 'string') {\n      if (options.nocase) {\n        hit = f.toLowerCase() === p.toLowerCase()\n      } else {\n        hit = f === p\n      }\n      this.debug('string match', p, f, hit)\n    } else {\n      hit = f.match(p)\n      this.debug('pattern match', p, f, hit)\n    }\n\n    if (!hit) return false\n  }\n\n  // Note: ending in / means that we'll get a final \"\"\n  // at the end of the pattern.  This can only match a\n  // corresponding \"\" at the end of the file.\n  // If the file ends in /, then it can only match a\n  // a pattern that ends in /, unless the pattern just\n  // doesn't have any more for it. But, a/b/ should *not*\n  // match \"a/b/*\", even though \"\" matches against the\n  // [^/]*? pattern, except in partial mode, where it might\n  // simply not be reached yet.\n  // However, a/b/ should still satisfy a/*\n\n  // now either we fell off the end of the pattern, or we're done.\n  if (fi === fl && pi === pl) {\n    // ran out of pattern and filename at the same time.\n    // an exact hit!\n    return true\n  } else if (fi === fl) {\n    // ran out of file, but still had pattern left.\n    // this is ok if we're doing the match as part of\n    // a glob fs traversal.\n    return partial\n  } else if (pi === pl) {\n    // ran out of pattern, still have file left.\n    // this is only acceptable if we're on the very last\n    // empty segment of a file with a trailing slash.\n    // a/* should match a/b/\n    var emptyFileEnd = (fi === fl - 1) && (file[fi] === '')\n    return emptyFileEnd\n  }\n\n  // should be unreachable.\n  throw new Error('wtf?')\n}\n\n// replace stuff like \\* with *\nfunction globUnescape (s) {\n  return s.replace(/\\\\(.)/g, '$1')\n}\n\nfunction regExpEscape (s) {\n  return s.replace(/[-[\\]{}()*+?.,\\\\^$|#\\s]/g, '\\\\$&')\n}\n\n\n//# sourceURL=webpack:///./node_modules/minimatch/minimatch.js?");

/***/ }),

/***/ "./node_modules/ms/index.js":
/*!**********************************!*\
  !*** ./node_modules/ms/index.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * Helpers.\n */\n\nvar s = 1000;\nvar m = s * 60;\nvar h = m * 60;\nvar d = h * 24;\nvar y = d * 365.25;\n\n/**\n * Parse or format the given `val`.\n *\n * Options:\n *\n *  - `long` verbose formatting [false]\n *\n * @param {String|Number} val\n * @param {Object} [options]\n * @throws {Error} throw an error if val is not a non-empty string or a number\n * @return {String|Number}\n * @api public\n */\n\nmodule.exports = function(val, options) {\n  options = options || {};\n  var type = typeof val;\n  if (type === 'string' && val.length > 0) {\n    return parse(val);\n  } else if (type === 'number' && isNaN(val) === false) {\n    return options.long ? fmtLong(val) : fmtShort(val);\n  }\n  throw new Error(\n    'val is not a non-empty string or a valid number. val=' +\n      JSON.stringify(val)\n  );\n};\n\n/**\n * Parse the given `str` and return milliseconds.\n *\n * @param {String} str\n * @return {Number}\n * @api private\n */\n\nfunction parse(str) {\n  str = String(str);\n  if (str.length > 100) {\n    return;\n  }\n  var match = /^((?:\\d+)?\\.?\\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(\n    str\n  );\n  if (!match) {\n    return;\n  }\n  var n = parseFloat(match[1]);\n  var type = (match[2] || 'ms').toLowerCase();\n  switch (type) {\n    case 'years':\n    case 'year':\n    case 'yrs':\n    case 'yr':\n    case 'y':\n      return n * y;\n    case 'days':\n    case 'day':\n    case 'd':\n      return n * d;\n    case 'hours':\n    case 'hour':\n    case 'hrs':\n    case 'hr':\n    case 'h':\n      return n * h;\n    case 'minutes':\n    case 'minute':\n    case 'mins':\n    case 'min':\n    case 'm':\n      return n * m;\n    case 'seconds':\n    case 'second':\n    case 'secs':\n    case 'sec':\n    case 's':\n      return n * s;\n    case 'milliseconds':\n    case 'millisecond':\n    case 'msecs':\n    case 'msec':\n    case 'ms':\n      return n;\n    default:\n      return undefined;\n  }\n}\n\n/**\n * Short format for `ms`.\n *\n * @param {Number} ms\n * @return {String}\n * @api private\n */\n\nfunction fmtShort(ms) {\n  if (ms >= d) {\n    return Math.round(ms / d) + 'd';\n  }\n  if (ms >= h) {\n    return Math.round(ms / h) + 'h';\n  }\n  if (ms >= m) {\n    return Math.round(ms / m) + 'm';\n  }\n  if (ms >= s) {\n    return Math.round(ms / s) + 's';\n  }\n  return ms + 'ms';\n}\n\n/**\n * Long format for `ms`.\n *\n * @param {Number} ms\n * @return {String}\n * @api private\n */\n\nfunction fmtLong(ms) {\n  return plural(ms, d, 'day') ||\n    plural(ms, h, 'hour') ||\n    plural(ms, m, 'minute') ||\n    plural(ms, s, 'second') ||\n    ms + ' ms';\n}\n\n/**\n * Pluralization helper.\n */\n\nfunction plural(ms, n, name) {\n  if (ms < n) {\n    return;\n  }\n  if (ms < n * 1.5) {\n    return Math.floor(ms / n) + ' ' + name;\n  }\n  return Math.ceil(ms / n) + ' ' + name + 's';\n}\n\n\n//# sourceURL=webpack:///./node_modules/ms/index.js?");

/***/ }),

/***/ "./node_modules/once/once.js":
/*!***********************************!*\
  !*** ./node_modules/once/once.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var wrappy = __webpack_require__(/*! wrappy */ \"./node_modules/wrappy/wrappy.js\")\nmodule.exports = wrappy(once)\nmodule.exports.strict = wrappy(onceStrict)\n\nonce.proto = once(function () {\n  Object.defineProperty(Function.prototype, 'once', {\n    value: function () {\n      return once(this)\n    },\n    configurable: true\n  })\n\n  Object.defineProperty(Function.prototype, 'onceStrict', {\n    value: function () {\n      return onceStrict(this)\n    },\n    configurable: true\n  })\n})\n\nfunction once (fn) {\n  var f = function () {\n    if (f.called) return f.value\n    f.called = true\n    return f.value = fn.apply(this, arguments)\n  }\n  f.called = false\n  return f\n}\n\nfunction onceStrict (fn) {\n  var f = function () {\n    if (f.called)\n      throw new Error(f.onceError)\n    f.called = true\n    return f.value = fn.apply(this, arguments)\n  }\n  var name = fn.name || 'Function wrapped with `once`'\n  f.onceError = name + \" shouldn't be called more than once\"\n  f.called = false\n  return f\n}\n\n\n//# sourceURL=webpack:///./node_modules/once/once.js?");

/***/ }),

/***/ "./node_modules/path-is-absolute/index.js":
/*!************************************************!*\
  !*** ./node_modules/path-is-absolute/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nfunction posix(path) {\n\treturn path.charAt(0) === '/';\n}\n\nfunction win32(path) {\n\t// https://github.com/nodejs/node/blob/b3fcc245fb25539909ef1d5eaa01dbf92e168633/lib/path.js#L56\n\tvar splitDeviceRe = /^([a-zA-Z]:|[\\\\\\/]{2}[^\\\\\\/]+[\\\\\\/]+[^\\\\\\/]+)?([\\\\\\/])?([\\s\\S]*?)$/;\n\tvar result = splitDeviceRe.exec(path);\n\tvar device = result[1] || '';\n\tvar isUnc = Boolean(device && device.charAt(1) !== ':');\n\n\t// UNC paths are always absolute\n\treturn Boolean(result[2] || isUnc);\n}\n\nmodule.exports = process.platform === 'win32' ? win32 : posix;\nmodule.exports.posix = posix;\nmodule.exports.win32 = win32;\n\n\n//# sourceURL=webpack:///./node_modules/path-is-absolute/index.js?");

/***/ }),

/***/ "./node_modules/rimraf/rimraf.js":
/*!***************************************!*\
  !*** ./node_modules/rimraf/rimraf.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = rimraf\nrimraf.sync = rimrafSync\n\nvar assert = __webpack_require__(/*! assert */ \"assert\")\nvar path = __webpack_require__(/*! path */ \"path\")\nvar fs = __webpack_require__(/*! fs */ \"fs\")\nvar glob = __webpack_require__(/*! glob */ \"./node_modules/glob/glob.js\")\nvar _0666 = parseInt('666', 8)\n\nvar defaultGlobOpts = {\n  nosort: true,\n  silent: true\n}\n\n// for EMFILE handling\nvar timeout = 0\n\nvar isWindows = (process.platform === \"win32\")\n\nfunction defaults (options) {\n  var methods = [\n    'unlink',\n    'chmod',\n    'stat',\n    'lstat',\n    'rmdir',\n    'readdir'\n  ]\n  methods.forEach(function(m) {\n    options[m] = options[m] || fs[m]\n    m = m + 'Sync'\n    options[m] = options[m] || fs[m]\n  })\n\n  options.maxBusyTries = options.maxBusyTries || 3\n  options.emfileWait = options.emfileWait || 1000\n  if (options.glob === false) {\n    options.disableGlob = true\n  }\n  options.disableGlob = options.disableGlob || false\n  options.glob = options.glob || defaultGlobOpts\n}\n\nfunction rimraf (p, options, cb) {\n  if (typeof options === 'function') {\n    cb = options\n    options = {}\n  }\n\n  assert(p, 'rimraf: missing path')\n  assert.equal(typeof p, 'string', 'rimraf: path should be a string')\n  assert.equal(typeof cb, 'function', 'rimraf: callback function required')\n  assert(options, 'rimraf: invalid options argument provided')\n  assert.equal(typeof options, 'object', 'rimraf: options should be object')\n\n  defaults(options)\n\n  var busyTries = 0\n  var errState = null\n  var n = 0\n\n  if (options.disableGlob || !glob.hasMagic(p))\n    return afterGlob(null, [p])\n\n  options.lstat(p, function (er, stat) {\n    if (!er)\n      return afterGlob(null, [p])\n\n    glob(p, options.glob, afterGlob)\n  })\n\n  function next (er) {\n    errState = errState || er\n    if (--n === 0)\n      cb(errState)\n  }\n\n  function afterGlob (er, results) {\n    if (er)\n      return cb(er)\n\n    n = results.length\n    if (n === 0)\n      return cb()\n\n    results.forEach(function (p) {\n      rimraf_(p, options, function CB (er) {\n        if (er) {\n          if ((er.code === \"EBUSY\" || er.code === \"ENOTEMPTY\" || er.code === \"EPERM\") &&\n              busyTries < options.maxBusyTries) {\n            busyTries ++\n            var time = busyTries * 100\n            // try again, with the same exact callback as this one.\n            return setTimeout(function () {\n              rimraf_(p, options, CB)\n            }, time)\n          }\n\n          // this one won't happen if graceful-fs is used.\n          if (er.code === \"EMFILE\" && timeout < options.emfileWait) {\n            return setTimeout(function () {\n              rimraf_(p, options, CB)\n            }, timeout ++)\n          }\n\n          // already gone\n          if (er.code === \"ENOENT\") er = null\n        }\n\n        timeout = 0\n        next(er)\n      })\n    })\n  }\n}\n\n// Two possible strategies.\n// 1. Assume it's a file.  unlink it, then do the dir stuff on EPERM or EISDIR\n// 2. Assume it's a directory.  readdir, then do the file stuff on ENOTDIR\n//\n// Both result in an extra syscall when you guess wrong.  However, there\n// are likely far more normal files in the world than directories.  This\n// is based on the assumption that a the average number of files per\n// directory is >= 1.\n//\n// If anyone ever complains about this, then I guess the strategy could\n// be made configurable somehow.  But until then, YAGNI.\nfunction rimraf_ (p, options, cb) {\n  assert(p)\n  assert(options)\n  assert(typeof cb === 'function')\n\n  // sunos lets the root user unlink directories, which is... weird.\n  // so we have to lstat here and make sure it's not a dir.\n  options.lstat(p, function (er, st) {\n    if (er && er.code === \"ENOENT\")\n      return cb(null)\n\n    // Windows can EPERM on stat.  Life is suffering.\n    if (er && er.code === \"EPERM\" && isWindows)\n      fixWinEPERM(p, options, er, cb)\n\n    if (st && st.isDirectory())\n      return rmdir(p, options, er, cb)\n\n    options.unlink(p, function (er) {\n      if (er) {\n        if (er.code === \"ENOENT\")\n          return cb(null)\n        if (er.code === \"EPERM\")\n          return (isWindows)\n            ? fixWinEPERM(p, options, er, cb)\n            : rmdir(p, options, er, cb)\n        if (er.code === \"EISDIR\")\n          return rmdir(p, options, er, cb)\n      }\n      return cb(er)\n    })\n  })\n}\n\nfunction fixWinEPERM (p, options, er, cb) {\n  assert(p)\n  assert(options)\n  assert(typeof cb === 'function')\n  if (er)\n    assert(er instanceof Error)\n\n  options.chmod(p, _0666, function (er2) {\n    if (er2)\n      cb(er2.code === \"ENOENT\" ? null : er)\n    else\n      options.stat(p, function(er3, stats) {\n        if (er3)\n          cb(er3.code === \"ENOENT\" ? null : er)\n        else if (stats.isDirectory())\n          rmdir(p, options, er, cb)\n        else\n          options.unlink(p, cb)\n      })\n  })\n}\n\nfunction fixWinEPERMSync (p, options, er) {\n  assert(p)\n  assert(options)\n  if (er)\n    assert(er instanceof Error)\n\n  try {\n    options.chmodSync(p, _0666)\n  } catch (er2) {\n    if (er2.code === \"ENOENT\")\n      return\n    else\n      throw er\n  }\n\n  try {\n    var stats = options.statSync(p)\n  } catch (er3) {\n    if (er3.code === \"ENOENT\")\n      return\n    else\n      throw er\n  }\n\n  if (stats.isDirectory())\n    rmdirSync(p, options, er)\n  else\n    options.unlinkSync(p)\n}\n\nfunction rmdir (p, options, originalEr, cb) {\n  assert(p)\n  assert(options)\n  if (originalEr)\n    assert(originalEr instanceof Error)\n  assert(typeof cb === 'function')\n\n  // try to rmdir first, and only readdir on ENOTEMPTY or EEXIST (SunOS)\n  // if we guessed wrong, and it's not a directory, then\n  // raise the original error.\n  options.rmdir(p, function (er) {\n    if (er && (er.code === \"ENOTEMPTY\" || er.code === \"EEXIST\" || er.code === \"EPERM\"))\n      rmkids(p, options, cb)\n    else if (er && er.code === \"ENOTDIR\")\n      cb(originalEr)\n    else\n      cb(er)\n  })\n}\n\nfunction rmkids(p, options, cb) {\n  assert(p)\n  assert(options)\n  assert(typeof cb === 'function')\n\n  options.readdir(p, function (er, files) {\n    if (er)\n      return cb(er)\n    var n = files.length\n    if (n === 0)\n      return options.rmdir(p, cb)\n    var errState\n    files.forEach(function (f) {\n      rimraf(path.join(p, f), options, function (er) {\n        if (errState)\n          return\n        if (er)\n          return cb(errState = er)\n        if (--n === 0)\n          options.rmdir(p, cb)\n      })\n    })\n  })\n}\n\n// this looks simpler, and is strictly *faster*, but will\n// tie up the JavaScript thread and fail on excessively\n// deep directory trees.\nfunction rimrafSync (p, options) {\n  options = options || {}\n  defaults(options)\n\n  assert(p, 'rimraf: missing path')\n  assert.equal(typeof p, 'string', 'rimraf: path should be a string')\n  assert(options, 'rimraf: missing options')\n  assert.equal(typeof options, 'object', 'rimraf: options should be object')\n\n  var results\n\n  if (options.disableGlob || !glob.hasMagic(p)) {\n    results = [p]\n  } else {\n    try {\n      options.lstatSync(p)\n      results = [p]\n    } catch (er) {\n      results = glob.sync(p, options.glob)\n    }\n  }\n\n  if (!results.length)\n    return\n\n  for (var i = 0; i < results.length; i++) {\n    var p = results[i]\n\n    try {\n      var st = options.lstatSync(p)\n    } catch (er) {\n      if (er.code === \"ENOENT\")\n        return\n\n      // Windows can EPERM on stat.  Life is suffering.\n      if (er.code === \"EPERM\" && isWindows)\n        fixWinEPERMSync(p, options, er)\n    }\n\n    try {\n      // sunos lets the root user unlink directories, which is... weird.\n      if (st && st.isDirectory())\n        rmdirSync(p, options, null)\n      else\n        options.unlinkSync(p)\n    } catch (er) {\n      if (er.code === \"ENOENT\")\n        return\n      if (er.code === \"EPERM\")\n        return isWindows ? fixWinEPERMSync(p, options, er) : rmdirSync(p, options, er)\n      if (er.code !== \"EISDIR\")\n        throw er\n\n      rmdirSync(p, options, er)\n    }\n  }\n}\n\nfunction rmdirSync (p, options, originalEr) {\n  assert(p)\n  assert(options)\n  if (originalEr)\n    assert(originalEr instanceof Error)\n\n  try {\n    options.rmdirSync(p)\n  } catch (er) {\n    if (er.code === \"ENOENT\")\n      return\n    if (er.code === \"ENOTDIR\")\n      throw originalEr\n    if (er.code === \"ENOTEMPTY\" || er.code === \"EEXIST\" || er.code === \"EPERM\")\n      rmkidsSync(p, options)\n  }\n}\n\nfunction rmkidsSync (p, options) {\n  assert(p)\n  assert(options)\n  options.readdirSync(p).forEach(function (f) {\n    rimrafSync(path.join(p, f), options)\n  })\n\n  // We only end up here once we got ENOTEMPTY at least once, and\n  // at this point, we are guaranteed to have removed all the kids.\n  // So, we know that it won't be ENOENT or ENOTDIR or anything else.\n  // try really hard to delete stuff on windows, because it has a\n  // PROFOUNDLY annoying habit of not closing handles promptly when\n  // files are deleted, resulting in spurious ENOTEMPTY errors.\n  var retries = isWindows ? 100 : 1\n  var i = 0\n  do {\n    var threw = true\n    try {\n      var ret = options.rmdirSync(p, options)\n      threw = false\n      return ret\n    } finally {\n      if (++i < retries && threw)\n        continue\n    }\n  } while (true)\n}\n\n\n//# sourceURL=webpack:///./node_modules/rimraf/rimraf.js?");

/***/ }),

/***/ "./node_modules/semver/semver.js":
/*!***************************************!*\
  !*** ./node_modules/semver/semver.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("exports = module.exports = SemVer;\n\n// The debug function is excluded entirely from the minified version.\n/* nomin */ var debug;\n/* nomin */ if (typeof process === 'object' &&\n    /* nomin */ process.env &&\n    /* nomin */ process.env.NODE_DEBUG &&\n    /* nomin */ /\\bsemver\\b/i.test(process.env.NODE_DEBUG))\n  /* nomin */ debug = function() {\n    /* nomin */ var args = Array.prototype.slice.call(arguments, 0);\n    /* nomin */ args.unshift('SEMVER');\n    /* nomin */ console.log.apply(console, args);\n    /* nomin */ };\n/* nomin */ else\n  /* nomin */ debug = function() {};\n\n// Note: this is the semver.org version of the spec that it implements\n// Not necessarily the package version of this code.\nexports.SEMVER_SPEC_VERSION = '2.0.0';\n\nvar MAX_LENGTH = 256;\nvar MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;\n\n// Max safe segment length for coercion.\nvar MAX_SAFE_COMPONENT_LENGTH = 16;\n\n// The actual regexps go on exports.re\nvar re = exports.re = [];\nvar src = exports.src = [];\nvar R = 0;\n\n// The following Regular Expressions can be used for tokenizing,\n// validating, and parsing SemVer version strings.\n\n// ## Numeric Identifier\n// A single `0`, or a non-zero digit followed by zero or more digits.\n\nvar NUMERICIDENTIFIER = R++;\nsrc[NUMERICIDENTIFIER] = '0|[1-9]\\\\d*';\nvar NUMERICIDENTIFIERLOOSE = R++;\nsrc[NUMERICIDENTIFIERLOOSE] = '[0-9]+';\n\n\n// ## Non-numeric Identifier\n// Zero or more digits, followed by a letter or hyphen, and then zero or\n// more letters, digits, or hyphens.\n\nvar NONNUMERICIDENTIFIER = R++;\nsrc[NONNUMERICIDENTIFIER] = '\\\\d*[a-zA-Z-][a-zA-Z0-9-]*';\n\n\n// ## Main Version\n// Three dot-separated numeric identifiers.\n\nvar MAINVERSION = R++;\nsrc[MAINVERSION] = '(' + src[NUMERICIDENTIFIER] + ')\\\\.' +\n                   '(' + src[NUMERICIDENTIFIER] + ')\\\\.' +\n                   '(' + src[NUMERICIDENTIFIER] + ')';\n\nvar MAINVERSIONLOOSE = R++;\nsrc[MAINVERSIONLOOSE] = '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\\\.' +\n                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\\\.' +\n                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')';\n\n// ## Pre-release Version Identifier\n// A numeric identifier, or a non-numeric identifier.\n\nvar PRERELEASEIDENTIFIER = R++;\nsrc[PRERELEASEIDENTIFIER] = '(?:' + src[NUMERICIDENTIFIER] +\n                            '|' + src[NONNUMERICIDENTIFIER] + ')';\n\nvar PRERELEASEIDENTIFIERLOOSE = R++;\nsrc[PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[NUMERICIDENTIFIERLOOSE] +\n                                 '|' + src[NONNUMERICIDENTIFIER] + ')';\n\n\n// ## Pre-release Version\n// Hyphen, followed by one or more dot-separated pre-release version\n// identifiers.\n\nvar PRERELEASE = R++;\nsrc[PRERELEASE] = '(?:-(' + src[PRERELEASEIDENTIFIER] +\n                  '(?:\\\\.' + src[PRERELEASEIDENTIFIER] + ')*))';\n\nvar PRERELEASELOOSE = R++;\nsrc[PRERELEASELOOSE] = '(?:-?(' + src[PRERELEASEIDENTIFIERLOOSE] +\n                       '(?:\\\\.' + src[PRERELEASEIDENTIFIERLOOSE] + ')*))';\n\n// ## Build Metadata Identifier\n// Any combination of digits, letters, or hyphens.\n\nvar BUILDIDENTIFIER = R++;\nsrc[BUILDIDENTIFIER] = '[0-9A-Za-z-]+';\n\n// ## Build Metadata\n// Plus sign, followed by one or more period-separated build metadata\n// identifiers.\n\nvar BUILD = R++;\nsrc[BUILD] = '(?:\\\\+(' + src[BUILDIDENTIFIER] +\n             '(?:\\\\.' + src[BUILDIDENTIFIER] + ')*))';\n\n\n// ## Full Version String\n// A main version, followed optionally by a pre-release version and\n// build metadata.\n\n// Note that the only major, minor, patch, and pre-release sections of\n// the version string are capturing groups.  The build metadata is not a\n// capturing group, because it should not ever be used in version\n// comparison.\n\nvar FULL = R++;\nvar FULLPLAIN = 'v?' + src[MAINVERSION] +\n                src[PRERELEASE] + '?' +\n                src[BUILD] + '?';\n\nsrc[FULL] = '^' + FULLPLAIN + '$';\n\n// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.\n// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty\n// common in the npm registry.\nvar LOOSEPLAIN = '[v=\\\\s]*' + src[MAINVERSIONLOOSE] +\n                 src[PRERELEASELOOSE] + '?' +\n                 src[BUILD] + '?';\n\nvar LOOSE = R++;\nsrc[LOOSE] = '^' + LOOSEPLAIN + '$';\n\nvar GTLT = R++;\nsrc[GTLT] = '((?:<|>)?=?)';\n\n// Something like \"2.*\" or \"1.2.x\".\n// Note that \"x.x\" is a valid xRange identifer, meaning \"any version\"\n// Only the first item is strictly required.\nvar XRANGEIDENTIFIERLOOSE = R++;\nsrc[XRANGEIDENTIFIERLOOSE] = src[NUMERICIDENTIFIERLOOSE] + '|x|X|\\\\*';\nvar XRANGEIDENTIFIER = R++;\nsrc[XRANGEIDENTIFIER] = src[NUMERICIDENTIFIER] + '|x|X|\\\\*';\n\nvar XRANGEPLAIN = R++;\nsrc[XRANGEPLAIN] = '[v=\\\\s]*(' + src[XRANGEIDENTIFIER] + ')' +\n                   '(?:\\\\.(' + src[XRANGEIDENTIFIER] + ')' +\n                   '(?:\\\\.(' + src[XRANGEIDENTIFIER] + ')' +\n                   '(?:' + src[PRERELEASE] + ')?' +\n                   src[BUILD] + '?' +\n                   ')?)?';\n\nvar XRANGEPLAINLOOSE = R++;\nsrc[XRANGEPLAINLOOSE] = '[v=\\\\s]*(' + src[XRANGEIDENTIFIERLOOSE] + ')' +\n                        '(?:\\\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +\n                        '(?:\\\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +\n                        '(?:' + src[PRERELEASELOOSE] + ')?' +\n                        src[BUILD] + '?' +\n                        ')?)?';\n\nvar XRANGE = R++;\nsrc[XRANGE] = '^' + src[GTLT] + '\\\\s*' + src[XRANGEPLAIN] + '$';\nvar XRANGELOOSE = R++;\nsrc[XRANGELOOSE] = '^' + src[GTLT] + '\\\\s*' + src[XRANGEPLAINLOOSE] + '$';\n\n// Coercion.\n// Extract anything that could conceivably be a part of a valid semver\nvar COERCE = R++;\nsrc[COERCE] = '(?:^|[^\\\\d])' +\n              '(\\\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '})' +\n              '(?:\\\\.(\\\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +\n              '(?:\\\\.(\\\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +\n              '(?:$|[^\\\\d])';\n\n// Tilde ranges.\n// Meaning is \"reasonably at or greater than\"\nvar LONETILDE = R++;\nsrc[LONETILDE] = '(?:~>?)';\n\nvar TILDETRIM = R++;\nsrc[TILDETRIM] = '(\\\\s*)' + src[LONETILDE] + '\\\\s+';\nre[TILDETRIM] = new RegExp(src[TILDETRIM], 'g');\nvar tildeTrimReplace = '$1~';\n\nvar TILDE = R++;\nsrc[TILDE] = '^' + src[LONETILDE] + src[XRANGEPLAIN] + '$';\nvar TILDELOOSE = R++;\nsrc[TILDELOOSE] = '^' + src[LONETILDE] + src[XRANGEPLAINLOOSE] + '$';\n\n// Caret ranges.\n// Meaning is \"at least and backwards compatible with\"\nvar LONECARET = R++;\nsrc[LONECARET] = '(?:\\\\^)';\n\nvar CARETTRIM = R++;\nsrc[CARETTRIM] = '(\\\\s*)' + src[LONECARET] + '\\\\s+';\nre[CARETTRIM] = new RegExp(src[CARETTRIM], 'g');\nvar caretTrimReplace = '$1^';\n\nvar CARET = R++;\nsrc[CARET] = '^' + src[LONECARET] + src[XRANGEPLAIN] + '$';\nvar CARETLOOSE = R++;\nsrc[CARETLOOSE] = '^' + src[LONECARET] + src[XRANGEPLAINLOOSE] + '$';\n\n// A simple gt/lt/eq thing, or just \"\" to indicate \"any version\"\nvar COMPARATORLOOSE = R++;\nsrc[COMPARATORLOOSE] = '^' + src[GTLT] + '\\\\s*(' + LOOSEPLAIN + ')$|^$';\nvar COMPARATOR = R++;\nsrc[COMPARATOR] = '^' + src[GTLT] + '\\\\s*(' + FULLPLAIN + ')$|^$';\n\n\n// An expression to strip any whitespace between the gtlt and the thing\n// it modifies, so that `> 1.2.3` ==> `>1.2.3`\nvar COMPARATORTRIM = R++;\nsrc[COMPARATORTRIM] = '(\\\\s*)' + src[GTLT] +\n                      '\\\\s*(' + LOOSEPLAIN + '|' + src[XRANGEPLAIN] + ')';\n\n// this one has to use the /g flag\nre[COMPARATORTRIM] = new RegExp(src[COMPARATORTRIM], 'g');\nvar comparatorTrimReplace = '$1$2$3';\n\n\n// Something like `1.2.3 - 1.2.4`\n// Note that these all use the loose form, because they'll be\n// checked against either the strict or loose comparator form\n// later.\nvar HYPHENRANGE = R++;\nsrc[HYPHENRANGE] = '^\\\\s*(' + src[XRANGEPLAIN] + ')' +\n                   '\\\\s+-\\\\s+' +\n                   '(' + src[XRANGEPLAIN] + ')' +\n                   '\\\\s*$';\n\nvar HYPHENRANGELOOSE = R++;\nsrc[HYPHENRANGELOOSE] = '^\\\\s*(' + src[XRANGEPLAINLOOSE] + ')' +\n                        '\\\\s+-\\\\s+' +\n                        '(' + src[XRANGEPLAINLOOSE] + ')' +\n                        '\\\\s*$';\n\n// Star ranges basically just allow anything at all.\nvar STAR = R++;\nsrc[STAR] = '(<|>)?=?\\\\s*\\\\*';\n\n// Compile to actual regexp objects.\n// All are flag-free, unless they were created above with a flag.\nfor (var i = 0; i < R; i++) {\n  debug(i, src[i]);\n  if (!re[i])\n    re[i] = new RegExp(src[i]);\n}\n\nexports.parse = parse;\nfunction parse(version, loose) {\n  if (version instanceof SemVer)\n    return version;\n\n  if (typeof version !== 'string')\n    return null;\n\n  if (version.length > MAX_LENGTH)\n    return null;\n\n  var r = loose ? re[LOOSE] : re[FULL];\n  if (!r.test(version))\n    return null;\n\n  try {\n    return new SemVer(version, loose);\n  } catch (er) {\n    return null;\n  }\n}\n\nexports.valid = valid;\nfunction valid(version, loose) {\n  var v = parse(version, loose);\n  return v ? v.version : null;\n}\n\n\nexports.clean = clean;\nfunction clean(version, loose) {\n  var s = parse(version.trim().replace(/^[=v]+/, ''), loose);\n  return s ? s.version : null;\n}\n\nexports.SemVer = SemVer;\n\nfunction SemVer(version, loose) {\n  if (version instanceof SemVer) {\n    if (version.loose === loose)\n      return version;\n    else\n      version = version.version;\n  } else if (typeof version !== 'string') {\n    throw new TypeError('Invalid Version: ' + version);\n  }\n\n  if (version.length > MAX_LENGTH)\n    throw new TypeError('version is longer than ' + MAX_LENGTH + ' characters')\n\n  if (!(this instanceof SemVer))\n    return new SemVer(version, loose);\n\n  debug('SemVer', version, loose);\n  this.loose = loose;\n  var m = version.trim().match(loose ? re[LOOSE] : re[FULL]);\n\n  if (!m)\n    throw new TypeError('Invalid Version: ' + version);\n\n  this.raw = version;\n\n  // these are actually numbers\n  this.major = +m[1];\n  this.minor = +m[2];\n  this.patch = +m[3];\n\n  if (this.major > MAX_SAFE_INTEGER || this.major < 0)\n    throw new TypeError('Invalid major version')\n\n  if (this.minor > MAX_SAFE_INTEGER || this.minor < 0)\n    throw new TypeError('Invalid minor version')\n\n  if (this.patch > MAX_SAFE_INTEGER || this.patch < 0)\n    throw new TypeError('Invalid patch version')\n\n  // numberify any prerelease numeric ids\n  if (!m[4])\n    this.prerelease = [];\n  else\n    this.prerelease = m[4].split('.').map(function(id) {\n      if (/^[0-9]+$/.test(id)) {\n        var num = +id;\n        if (num >= 0 && num < MAX_SAFE_INTEGER)\n          return num;\n      }\n      return id;\n    });\n\n  this.build = m[5] ? m[5].split('.') : [];\n  this.format();\n}\n\nSemVer.prototype.format = function() {\n  this.version = this.major + '.' + this.minor + '.' + this.patch;\n  if (this.prerelease.length)\n    this.version += '-' + this.prerelease.join('.');\n  return this.version;\n};\n\nSemVer.prototype.toString = function() {\n  return this.version;\n};\n\nSemVer.prototype.compare = function(other) {\n  debug('SemVer.compare', this.version, this.loose, other);\n  if (!(other instanceof SemVer))\n    other = new SemVer(other, this.loose);\n\n  return this.compareMain(other) || this.comparePre(other);\n};\n\nSemVer.prototype.compareMain = function(other) {\n  if (!(other instanceof SemVer))\n    other = new SemVer(other, this.loose);\n\n  return compareIdentifiers(this.major, other.major) ||\n         compareIdentifiers(this.minor, other.minor) ||\n         compareIdentifiers(this.patch, other.patch);\n};\n\nSemVer.prototype.comparePre = function(other) {\n  if (!(other instanceof SemVer))\n    other = new SemVer(other, this.loose);\n\n  // NOT having a prerelease is > having one\n  if (this.prerelease.length && !other.prerelease.length)\n    return -1;\n  else if (!this.prerelease.length && other.prerelease.length)\n    return 1;\n  else if (!this.prerelease.length && !other.prerelease.length)\n    return 0;\n\n  var i = 0;\n  do {\n    var a = this.prerelease[i];\n    var b = other.prerelease[i];\n    debug('prerelease compare', i, a, b);\n    if (a === undefined && b === undefined)\n      return 0;\n    else if (b === undefined)\n      return 1;\n    else if (a === undefined)\n      return -1;\n    else if (a === b)\n      continue;\n    else\n      return compareIdentifiers(a, b);\n  } while (++i);\n};\n\n// preminor will bump the version up to the next minor release, and immediately\n// down to pre-release. premajor and prepatch work the same way.\nSemVer.prototype.inc = function(release, identifier) {\n  switch (release) {\n    case 'premajor':\n      this.prerelease.length = 0;\n      this.patch = 0;\n      this.minor = 0;\n      this.major++;\n      this.inc('pre', identifier);\n      break;\n    case 'preminor':\n      this.prerelease.length = 0;\n      this.patch = 0;\n      this.minor++;\n      this.inc('pre', identifier);\n      break;\n    case 'prepatch':\n      // If this is already a prerelease, it will bump to the next version\n      // drop any prereleases that might already exist, since they are not\n      // relevant at this point.\n      this.prerelease.length = 0;\n      this.inc('patch', identifier);\n      this.inc('pre', identifier);\n      break;\n    // If the input is a non-prerelease version, this acts the same as\n    // prepatch.\n    case 'prerelease':\n      if (this.prerelease.length === 0)\n        this.inc('patch', identifier);\n      this.inc('pre', identifier);\n      break;\n\n    case 'major':\n      // If this is a pre-major version, bump up to the same major version.\n      // Otherwise increment major.\n      // 1.0.0-5 bumps to 1.0.0\n      // 1.1.0 bumps to 2.0.0\n      if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0)\n        this.major++;\n      this.minor = 0;\n      this.patch = 0;\n      this.prerelease = [];\n      break;\n    case 'minor':\n      // If this is a pre-minor version, bump up to the same minor version.\n      // Otherwise increment minor.\n      // 1.2.0-5 bumps to 1.2.0\n      // 1.2.1 bumps to 1.3.0\n      if (this.patch !== 0 || this.prerelease.length === 0)\n        this.minor++;\n      this.patch = 0;\n      this.prerelease = [];\n      break;\n    case 'patch':\n      // If this is not a pre-release version, it will increment the patch.\n      // If it is a pre-release it will bump up to the same patch version.\n      // 1.2.0-5 patches to 1.2.0\n      // 1.2.0 patches to 1.2.1\n      if (this.prerelease.length === 0)\n        this.patch++;\n      this.prerelease = [];\n      break;\n    // This probably shouldn't be used publicly.\n    // 1.0.0 \"pre\" would become 1.0.0-0 which is the wrong direction.\n    case 'pre':\n      if (this.prerelease.length === 0)\n        this.prerelease = [0];\n      else {\n        var i = this.prerelease.length;\n        while (--i >= 0) {\n          if (typeof this.prerelease[i] === 'number') {\n            this.prerelease[i]++;\n            i = -2;\n          }\n        }\n        if (i === -1) // didn't increment anything\n          this.prerelease.push(0);\n      }\n      if (identifier) {\n        // 1.2.0-beta.1 bumps to 1.2.0-beta.2,\n        // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0\n        if (this.prerelease[0] === identifier) {\n          if (isNaN(this.prerelease[1]))\n            this.prerelease = [identifier, 0];\n        } else\n          this.prerelease = [identifier, 0];\n      }\n      break;\n\n    default:\n      throw new Error('invalid increment argument: ' + release);\n  }\n  this.format();\n  this.raw = this.version;\n  return this;\n};\n\nexports.inc = inc;\nfunction inc(version, release, loose, identifier) {\n  if (typeof(loose) === 'string') {\n    identifier = loose;\n    loose = undefined;\n  }\n\n  try {\n    return new SemVer(version, loose).inc(release, identifier).version;\n  } catch (er) {\n    return null;\n  }\n}\n\nexports.diff = diff;\nfunction diff(version1, version2) {\n  if (eq(version1, version2)) {\n    return null;\n  } else {\n    var v1 = parse(version1);\n    var v2 = parse(version2);\n    if (v1.prerelease.length || v2.prerelease.length) {\n      for (var key in v1) {\n        if (key === 'major' || key === 'minor' || key === 'patch') {\n          if (v1[key] !== v2[key]) {\n            return 'pre'+key;\n          }\n        }\n      }\n      return 'prerelease';\n    }\n    for (var key in v1) {\n      if (key === 'major' || key === 'minor' || key === 'patch') {\n        if (v1[key] !== v2[key]) {\n          return key;\n        }\n      }\n    }\n  }\n}\n\nexports.compareIdentifiers = compareIdentifiers;\n\nvar numeric = /^[0-9]+$/;\nfunction compareIdentifiers(a, b) {\n  var anum = numeric.test(a);\n  var bnum = numeric.test(b);\n\n  if (anum && bnum) {\n    a = +a;\n    b = +b;\n  }\n\n  return (anum && !bnum) ? -1 :\n         (bnum && !anum) ? 1 :\n         a < b ? -1 :\n         a > b ? 1 :\n         0;\n}\n\nexports.rcompareIdentifiers = rcompareIdentifiers;\nfunction rcompareIdentifiers(a, b) {\n  return compareIdentifiers(b, a);\n}\n\nexports.major = major;\nfunction major(a, loose) {\n  return new SemVer(a, loose).major;\n}\n\nexports.minor = minor;\nfunction minor(a, loose) {\n  return new SemVer(a, loose).minor;\n}\n\nexports.patch = patch;\nfunction patch(a, loose) {\n  return new SemVer(a, loose).patch;\n}\n\nexports.compare = compare;\nfunction compare(a, b, loose) {\n  return new SemVer(a, loose).compare(new SemVer(b, loose));\n}\n\nexports.compareLoose = compareLoose;\nfunction compareLoose(a, b) {\n  return compare(a, b, true);\n}\n\nexports.rcompare = rcompare;\nfunction rcompare(a, b, loose) {\n  return compare(b, a, loose);\n}\n\nexports.sort = sort;\nfunction sort(list, loose) {\n  return list.sort(function(a, b) {\n    return exports.compare(a, b, loose);\n  });\n}\n\nexports.rsort = rsort;\nfunction rsort(list, loose) {\n  return list.sort(function(a, b) {\n    return exports.rcompare(a, b, loose);\n  });\n}\n\nexports.gt = gt;\nfunction gt(a, b, loose) {\n  return compare(a, b, loose) > 0;\n}\n\nexports.lt = lt;\nfunction lt(a, b, loose) {\n  return compare(a, b, loose) < 0;\n}\n\nexports.eq = eq;\nfunction eq(a, b, loose) {\n  return compare(a, b, loose) === 0;\n}\n\nexports.neq = neq;\nfunction neq(a, b, loose) {\n  return compare(a, b, loose) !== 0;\n}\n\nexports.gte = gte;\nfunction gte(a, b, loose) {\n  return compare(a, b, loose) >= 0;\n}\n\nexports.lte = lte;\nfunction lte(a, b, loose) {\n  return compare(a, b, loose) <= 0;\n}\n\nexports.cmp = cmp;\nfunction cmp(a, op, b, loose) {\n  var ret;\n  switch (op) {\n    case '===':\n      if (typeof a === 'object') a = a.version;\n      if (typeof b === 'object') b = b.version;\n      ret = a === b;\n      break;\n    case '!==':\n      if (typeof a === 'object') a = a.version;\n      if (typeof b === 'object') b = b.version;\n      ret = a !== b;\n      break;\n    case '': case '=': case '==': ret = eq(a, b, loose); break;\n    case '!=': ret = neq(a, b, loose); break;\n    case '>': ret = gt(a, b, loose); break;\n    case '>=': ret = gte(a, b, loose); break;\n    case '<': ret = lt(a, b, loose); break;\n    case '<=': ret = lte(a, b, loose); break;\n    default: throw new TypeError('Invalid operator: ' + op);\n  }\n  return ret;\n}\n\nexports.Comparator = Comparator;\nfunction Comparator(comp, loose) {\n  if (comp instanceof Comparator) {\n    if (comp.loose === loose)\n      return comp;\n    else\n      comp = comp.value;\n  }\n\n  if (!(this instanceof Comparator))\n    return new Comparator(comp, loose);\n\n  debug('comparator', comp, loose);\n  this.loose = loose;\n  this.parse(comp);\n\n  if (this.semver === ANY)\n    this.value = '';\n  else\n    this.value = this.operator + this.semver.version;\n\n  debug('comp', this);\n}\n\nvar ANY = {};\nComparator.prototype.parse = function(comp) {\n  var r = this.loose ? re[COMPARATORLOOSE] : re[COMPARATOR];\n  var m = comp.match(r);\n\n  if (!m)\n    throw new TypeError('Invalid comparator: ' + comp);\n\n  this.operator = m[1];\n  if (this.operator === '=')\n    this.operator = '';\n\n  // if it literally is just '>' or '' then allow anything.\n  if (!m[2])\n    this.semver = ANY;\n  else\n    this.semver = new SemVer(m[2], this.loose);\n};\n\nComparator.prototype.toString = function() {\n  return this.value;\n};\n\nComparator.prototype.test = function(version) {\n  debug('Comparator.test', version, this.loose);\n\n  if (this.semver === ANY)\n    return true;\n\n  if (typeof version === 'string')\n    version = new SemVer(version, this.loose);\n\n  return cmp(version, this.operator, this.semver, this.loose);\n};\n\nComparator.prototype.intersects = function(comp, loose) {\n  if (!(comp instanceof Comparator)) {\n    throw new TypeError('a Comparator is required');\n  }\n\n  var rangeTmp;\n\n  if (this.operator === '') {\n    rangeTmp = new Range(comp.value, loose);\n    return satisfies(this.value, rangeTmp, loose);\n  } else if (comp.operator === '') {\n    rangeTmp = new Range(this.value, loose);\n    return satisfies(comp.semver, rangeTmp, loose);\n  }\n\n  var sameDirectionIncreasing =\n    (this.operator === '>=' || this.operator === '>') &&\n    (comp.operator === '>=' || comp.operator === '>');\n  var sameDirectionDecreasing =\n    (this.operator === '<=' || this.operator === '<') &&\n    (comp.operator === '<=' || comp.operator === '<');\n  var sameSemVer = this.semver.version === comp.semver.version;\n  var differentDirectionsInclusive =\n    (this.operator === '>=' || this.operator === '<=') &&\n    (comp.operator === '>=' || comp.operator === '<=');\n  var oppositeDirectionsLessThan =\n    cmp(this.semver, '<', comp.semver, loose) &&\n    ((this.operator === '>=' || this.operator === '>') &&\n    (comp.operator === '<=' || comp.operator === '<'));\n  var oppositeDirectionsGreaterThan =\n    cmp(this.semver, '>', comp.semver, loose) &&\n    ((this.operator === '<=' || this.operator === '<') &&\n    (comp.operator === '>=' || comp.operator === '>'));\n\n  return sameDirectionIncreasing || sameDirectionDecreasing ||\n    (sameSemVer && differentDirectionsInclusive) ||\n    oppositeDirectionsLessThan || oppositeDirectionsGreaterThan;\n};\n\n\nexports.Range = Range;\nfunction Range(range, loose) {\n  if (range instanceof Range) {\n    if (range.loose === loose) {\n      return range;\n    } else {\n      return new Range(range.raw, loose);\n    }\n  }\n\n  if (range instanceof Comparator) {\n    return new Range(range.value, loose);\n  }\n\n  if (!(this instanceof Range))\n    return new Range(range, loose);\n\n  this.loose = loose;\n\n  // First, split based on boolean or ||\n  this.raw = range;\n  this.set = range.split(/\\s*\\|\\|\\s*/).map(function(range) {\n    return this.parseRange(range.trim());\n  }, this).filter(function(c) {\n    // throw out any that are not relevant for whatever reason\n    return c.length;\n  });\n\n  if (!this.set.length) {\n    throw new TypeError('Invalid SemVer Range: ' + range);\n  }\n\n  this.format();\n}\n\nRange.prototype.format = function() {\n  this.range = this.set.map(function(comps) {\n    return comps.join(' ').trim();\n  }).join('||').trim();\n  return this.range;\n};\n\nRange.prototype.toString = function() {\n  return this.range;\n};\n\nRange.prototype.parseRange = function(range) {\n  var loose = this.loose;\n  range = range.trim();\n  debug('range', range, loose);\n  // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`\n  var hr = loose ? re[HYPHENRANGELOOSE] : re[HYPHENRANGE];\n  range = range.replace(hr, hyphenReplace);\n  debug('hyphen replace', range);\n  // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`\n  range = range.replace(re[COMPARATORTRIM], comparatorTrimReplace);\n  debug('comparator trim', range, re[COMPARATORTRIM]);\n\n  // `~ 1.2.3` => `~1.2.3`\n  range = range.replace(re[TILDETRIM], tildeTrimReplace);\n\n  // `^ 1.2.3` => `^1.2.3`\n  range = range.replace(re[CARETTRIM], caretTrimReplace);\n\n  // normalize spaces\n  range = range.split(/\\s+/).join(' ');\n\n  // At this point, the range is completely trimmed and\n  // ready to be split into comparators.\n\n  var compRe = loose ? re[COMPARATORLOOSE] : re[COMPARATOR];\n  var set = range.split(' ').map(function(comp) {\n    return parseComparator(comp, loose);\n  }).join(' ').split(/\\s+/);\n  if (this.loose) {\n    // in loose mode, throw out any that are not valid comparators\n    set = set.filter(function(comp) {\n      return !!comp.match(compRe);\n    });\n  }\n  set = set.map(function(comp) {\n    return new Comparator(comp, loose);\n  });\n\n  return set;\n};\n\nRange.prototype.intersects = function(range, loose) {\n  if (!(range instanceof Range)) {\n    throw new TypeError('a Range is required');\n  }\n\n  return this.set.some(function(thisComparators) {\n    return thisComparators.every(function(thisComparator) {\n      return range.set.some(function(rangeComparators) {\n        return rangeComparators.every(function(rangeComparator) {\n          return thisComparator.intersects(rangeComparator, loose);\n        });\n      });\n    });\n  });\n};\n\n// Mostly just for testing and legacy API reasons\nexports.toComparators = toComparators;\nfunction toComparators(range, loose) {\n  return new Range(range, loose).set.map(function(comp) {\n    return comp.map(function(c) {\n      return c.value;\n    }).join(' ').trim().split(' ');\n  });\n}\n\n// comprised of xranges, tildes, stars, and gtlt's at this point.\n// already replaced the hyphen ranges\n// turn into a set of JUST comparators.\nfunction parseComparator(comp, loose) {\n  debug('comp', comp);\n  comp = replaceCarets(comp, loose);\n  debug('caret', comp);\n  comp = replaceTildes(comp, loose);\n  debug('tildes', comp);\n  comp = replaceXRanges(comp, loose);\n  debug('xrange', comp);\n  comp = replaceStars(comp, loose);\n  debug('stars', comp);\n  return comp;\n}\n\nfunction isX(id) {\n  return !id || id.toLowerCase() === 'x' || id === '*';\n}\n\n// ~, ~> --> * (any, kinda silly)\n// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0\n// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0\n// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0\n// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0\n// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0\nfunction replaceTildes(comp, loose) {\n  return comp.trim().split(/\\s+/).map(function(comp) {\n    return replaceTilde(comp, loose);\n  }).join(' ');\n}\n\nfunction replaceTilde(comp, loose) {\n  var r = loose ? re[TILDELOOSE] : re[TILDE];\n  return comp.replace(r, function(_, M, m, p, pr) {\n    debug('tilde', comp, _, M, m, p, pr);\n    var ret;\n\n    if (isX(M))\n      ret = '';\n    else if (isX(m))\n      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';\n    else if (isX(p))\n      // ~1.2 == >=1.2.0 <1.3.0\n      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';\n    else if (pr) {\n      debug('replaceTilde pr', pr);\n      if (pr.charAt(0) !== '-')\n        pr = '-' + pr;\n      ret = '>=' + M + '.' + m + '.' + p + pr +\n            ' <' + M + '.' + (+m + 1) + '.0';\n    } else\n      // ~1.2.3 == >=1.2.3 <1.3.0\n      ret = '>=' + M + '.' + m + '.' + p +\n            ' <' + M + '.' + (+m + 1) + '.0';\n\n    debug('tilde return', ret);\n    return ret;\n  });\n}\n\n// ^ --> * (any, kinda silly)\n// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0\n// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0\n// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0\n// ^1.2.3 --> >=1.2.3 <2.0.0\n// ^1.2.0 --> >=1.2.0 <2.0.0\nfunction replaceCarets(comp, loose) {\n  return comp.trim().split(/\\s+/).map(function(comp) {\n    return replaceCaret(comp, loose);\n  }).join(' ');\n}\n\nfunction replaceCaret(comp, loose) {\n  debug('caret', comp, loose);\n  var r = loose ? re[CARETLOOSE] : re[CARET];\n  return comp.replace(r, function(_, M, m, p, pr) {\n    debug('caret', comp, _, M, m, p, pr);\n    var ret;\n\n    if (isX(M))\n      ret = '';\n    else if (isX(m))\n      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';\n    else if (isX(p)) {\n      if (M === '0')\n        ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';\n      else\n        ret = '>=' + M + '.' + m + '.0 <' + (+M + 1) + '.0.0';\n    } else if (pr) {\n      debug('replaceCaret pr', pr);\n      if (pr.charAt(0) !== '-')\n        pr = '-' + pr;\n      if (M === '0') {\n        if (m === '0')\n          ret = '>=' + M + '.' + m + '.' + p + pr +\n                ' <' + M + '.' + m + '.' + (+p + 1);\n        else\n          ret = '>=' + M + '.' + m + '.' + p + pr +\n                ' <' + M + '.' + (+m + 1) + '.0';\n      } else\n        ret = '>=' + M + '.' + m + '.' + p + pr +\n              ' <' + (+M + 1) + '.0.0';\n    } else {\n      debug('no pr');\n      if (M === '0') {\n        if (m === '0')\n          ret = '>=' + M + '.' + m + '.' + p +\n                ' <' + M + '.' + m + '.' + (+p + 1);\n        else\n          ret = '>=' + M + '.' + m + '.' + p +\n                ' <' + M + '.' + (+m + 1) + '.0';\n      } else\n        ret = '>=' + M + '.' + m + '.' + p +\n              ' <' + (+M + 1) + '.0.0';\n    }\n\n    debug('caret return', ret);\n    return ret;\n  });\n}\n\nfunction replaceXRanges(comp, loose) {\n  debug('replaceXRanges', comp, loose);\n  return comp.split(/\\s+/).map(function(comp) {\n    return replaceXRange(comp, loose);\n  }).join(' ');\n}\n\nfunction replaceXRange(comp, loose) {\n  comp = comp.trim();\n  var r = loose ? re[XRANGELOOSE] : re[XRANGE];\n  return comp.replace(r, function(ret, gtlt, M, m, p, pr) {\n    debug('xRange', comp, ret, gtlt, M, m, p, pr);\n    var xM = isX(M);\n    var xm = xM || isX(m);\n    var xp = xm || isX(p);\n    var anyX = xp;\n\n    if (gtlt === '=' && anyX)\n      gtlt = '';\n\n    if (xM) {\n      if (gtlt === '>' || gtlt === '<') {\n        // nothing is allowed\n        ret = '<0.0.0';\n      } else {\n        // nothing is forbidden\n        ret = '*';\n      }\n    } else if (gtlt && anyX) {\n      // replace X with 0\n      if (xm)\n        m = 0;\n      if (xp)\n        p = 0;\n\n      if (gtlt === '>') {\n        // >1 => >=2.0.0\n        // >1.2 => >=1.3.0\n        // >1.2.3 => >= 1.2.4\n        gtlt = '>=';\n        if (xm) {\n          M = +M + 1;\n          m = 0;\n          p = 0;\n        } else if (xp) {\n          m = +m + 1;\n          p = 0;\n        }\n      } else if (gtlt === '<=') {\n        // <=0.7.x is actually <0.8.0, since any 0.7.x should\n        // pass.  Similarly, <=7.x is actually <8.0.0, etc.\n        gtlt = '<';\n        if (xm)\n          M = +M + 1;\n        else\n          m = +m + 1;\n      }\n\n      ret = gtlt + M + '.' + m + '.' + p;\n    } else if (xm) {\n      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';\n    } else if (xp) {\n      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';\n    }\n\n    debug('xRange return', ret);\n\n    return ret;\n  });\n}\n\n// Because * is AND-ed with everything else in the comparator,\n// and '' means \"any version\", just remove the *s entirely.\nfunction replaceStars(comp, loose) {\n  debug('replaceStars', comp, loose);\n  // Looseness is ignored here.  star is always as loose as it gets!\n  return comp.trim().replace(re[STAR], '');\n}\n\n// This function is passed to string.replace(re[HYPHENRANGE])\n// M, m, patch, prerelease, build\n// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5\n// 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do\n// 1.2 - 3.4 => >=1.2.0 <3.5.0\nfunction hyphenReplace($0,\n                       from, fM, fm, fp, fpr, fb,\n                       to, tM, tm, tp, tpr, tb) {\n\n  if (isX(fM))\n    from = '';\n  else if (isX(fm))\n    from = '>=' + fM + '.0.0';\n  else if (isX(fp))\n    from = '>=' + fM + '.' + fm + '.0';\n  else\n    from = '>=' + from;\n\n  if (isX(tM))\n    to = '';\n  else if (isX(tm))\n    to = '<' + (+tM + 1) + '.0.0';\n  else if (isX(tp))\n    to = '<' + tM + '.' + (+tm + 1) + '.0';\n  else if (tpr)\n    to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr;\n  else\n    to = '<=' + to;\n\n  return (from + ' ' + to).trim();\n}\n\n\n// if ANY of the sets match ALL of its comparators, then pass\nRange.prototype.test = function(version) {\n  if (!version)\n    return false;\n\n  if (typeof version === 'string')\n    version = new SemVer(version, this.loose);\n\n  for (var i = 0; i < this.set.length; i++) {\n    if (testSet(this.set[i], version))\n      return true;\n  }\n  return false;\n};\n\nfunction testSet(set, version) {\n  for (var i = 0; i < set.length; i++) {\n    if (!set[i].test(version))\n      return false;\n  }\n\n  if (version.prerelease.length) {\n    // Find the set of versions that are allowed to have prereleases\n    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0\n    // That should allow `1.2.3-pr.2` to pass.\n    // However, `1.2.4-alpha.notready` should NOT be allowed,\n    // even though it's within the range set by the comparators.\n    for (var i = 0; i < set.length; i++) {\n      debug(set[i].semver);\n      if (set[i].semver === ANY)\n        continue;\n\n      if (set[i].semver.prerelease.length > 0) {\n        var allowed = set[i].semver;\n        if (allowed.major === version.major &&\n            allowed.minor === version.minor &&\n            allowed.patch === version.patch)\n          return true;\n      }\n    }\n\n    // Version has a -pre, but it's not one of the ones we like.\n    return false;\n  }\n\n  return true;\n}\n\nexports.satisfies = satisfies;\nfunction satisfies(version, range, loose) {\n  try {\n    range = new Range(range, loose);\n  } catch (er) {\n    return false;\n  }\n  return range.test(version);\n}\n\nexports.maxSatisfying = maxSatisfying;\nfunction maxSatisfying(versions, range, loose) {\n  var max = null;\n  var maxSV = null;\n  try {\n    var rangeObj = new Range(range, loose);\n  } catch (er) {\n    return null;\n  }\n  versions.forEach(function (v) {\n    if (rangeObj.test(v)) { // satisfies(v, range, loose)\n      if (!max || maxSV.compare(v) === -1) { // compare(max, v, true)\n        max = v;\n        maxSV = new SemVer(max, loose);\n      }\n    }\n  })\n  return max;\n}\n\nexports.minSatisfying = minSatisfying;\nfunction minSatisfying(versions, range, loose) {\n  var min = null;\n  var minSV = null;\n  try {\n    var rangeObj = new Range(range, loose);\n  } catch (er) {\n    return null;\n  }\n  versions.forEach(function (v) {\n    if (rangeObj.test(v)) { // satisfies(v, range, loose)\n      if (!min || minSV.compare(v) === 1) { // compare(min, v, true)\n        min = v;\n        minSV = new SemVer(min, loose);\n      }\n    }\n  })\n  return min;\n}\n\nexports.validRange = validRange;\nfunction validRange(range, loose) {\n  try {\n    // Return '*' instead of '' so that truthiness works.\n    // This will throw if it's invalid anyway\n    return new Range(range, loose).range || '*';\n  } catch (er) {\n    return null;\n  }\n}\n\n// Determine if version is less than all the versions possible in the range\nexports.ltr = ltr;\nfunction ltr(version, range, loose) {\n  return outside(version, range, '<', loose);\n}\n\n// Determine if version is greater than all the versions possible in the range.\nexports.gtr = gtr;\nfunction gtr(version, range, loose) {\n  return outside(version, range, '>', loose);\n}\n\nexports.outside = outside;\nfunction outside(version, range, hilo, loose) {\n  version = new SemVer(version, loose);\n  range = new Range(range, loose);\n\n  var gtfn, ltefn, ltfn, comp, ecomp;\n  switch (hilo) {\n    case '>':\n      gtfn = gt;\n      ltefn = lte;\n      ltfn = lt;\n      comp = '>';\n      ecomp = '>=';\n      break;\n    case '<':\n      gtfn = lt;\n      ltefn = gte;\n      ltfn = gt;\n      comp = '<';\n      ecomp = '<=';\n      break;\n    default:\n      throw new TypeError('Must provide a hilo val of \"<\" or \">\"');\n  }\n\n  // If it satisifes the range it is not outside\n  if (satisfies(version, range, loose)) {\n    return false;\n  }\n\n  // From now on, variable terms are as if we're in \"gtr\" mode.\n  // but note that everything is flipped for the \"ltr\" function.\n\n  for (var i = 0; i < range.set.length; ++i) {\n    var comparators = range.set[i];\n\n    var high = null;\n    var low = null;\n\n    comparators.forEach(function(comparator) {\n      if (comparator.semver === ANY) {\n        comparator = new Comparator('>=0.0.0')\n      }\n      high = high || comparator;\n      low = low || comparator;\n      if (gtfn(comparator.semver, high.semver, loose)) {\n        high = comparator;\n      } else if (ltfn(comparator.semver, low.semver, loose)) {\n        low = comparator;\n      }\n    });\n\n    // If the edge version comparator has a operator then our version\n    // isn't outside it\n    if (high.operator === comp || high.operator === ecomp) {\n      return false;\n    }\n\n    // If the lowest version comparator has an operator and our version\n    // is less than it then it isn't higher than the range\n    if ((!low.operator || low.operator === comp) &&\n        ltefn(version, low.semver)) {\n      return false;\n    } else if (low.operator === ecomp && ltfn(version, low.semver)) {\n      return false;\n    }\n  }\n  return true;\n}\n\nexports.prerelease = prerelease;\nfunction prerelease(version, loose) {\n  var parsed = parse(version, loose);\n  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null;\n}\n\nexports.intersects = intersects;\nfunction intersects(r1, r2, loose) {\n  r1 = new Range(r1, loose)\n  r2 = new Range(r2, loose)\n  return r1.intersects(r2)\n}\n\nexports.coerce = coerce;\nfunction coerce(version) {\n  if (version instanceof SemVer)\n    return version;\n\n  if (typeof version !== 'string')\n    return null;\n\n  var match = version.match(re[COERCE]);\n\n  if (match == null)\n    return null;\n\n  return parse((match[1] || '0') + '.' + (match[2] || '0') + '.' + (match[3] || '0')); \n}\n\n\n//# sourceURL=webpack:///./node_modules/semver/semver.js?");

/***/ }),

/***/ "./node_modules/wrappy/wrappy.js":
/*!***************************************!*\
  !*** ./node_modules/wrappy/wrappy.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// Returns a wrapper function that returns a wrapped callback\n// The wrapper function should do some stuff, and return a\n// presumably different callback function.\n// This makes sure that own properties are retained, so that\n// decorations and such are not lost along the way.\nmodule.exports = wrappy\nfunction wrappy (fn, cb) {\n  if (fn && cb) return wrappy(fn)(cb)\n\n  if (typeof fn !== 'function')\n    throw new TypeError('need wrapper function')\n\n  Object.keys(fn).forEach(function (k) {\n    wrapper[k] = fn[k]\n  })\n\n  return wrapper\n\n  function wrapper() {\n    var args = new Array(arguments.length)\n    for (var i = 0; i < args.length; i++) {\n      args[i] = arguments[i]\n    }\n    var ret = fn.apply(this, args)\n    var cb = args[args.length-1]\n    if (typeof ret === 'function' && ret !== cb) {\n      Object.keys(cb).forEach(function (k) {\n        ret[k] = cb[k]\n      })\n    }\n    return ret\n  }\n}\n\n\n//# sourceURL=webpack:///./node_modules/wrappy/wrappy.js?");

/***/ }),

/***/ "./src/main/index.dev.js":
/*!*******************************!*\
  !*** ./src/main/index.dev.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\n__webpack_require__(/*! electron-debug */ \"./node_modules/electron-debug/index.js\")({ showDevTools: true });\n\n__webpack_require__(/*! electron */ \"electron\").app.on('ready', function () {\n  var installExtension = __webpack_require__(/*! electron-devtools-installer */ \"./node_modules/electron-devtools-installer/dist/index.js\");\n  installExtension.default(installExtension.VUEJS_DEVTOOLS).then(function () {}).catch(function (err) {\n    console.log('Unable to install `vue-devtools`: \\n', err);\n  });\n});\n\n__webpack_require__(/*! ./index */ \"./src/main/index.js\");\n\n//# sourceURL=webpack:///./src/main/index.dev.js?");

/***/ }),

/***/ "./src/main/index.js":
/*!***************************!*\
  !*** ./src/main/index.js ***!
  \***************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ \"electron\");\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);\n\nif (false) {}\n\nvar mainWindow = void 0;\nvar winURL =  true ? 'http://localhost:9080' : undefined;\n\nfunction createWindow() {\n  mainWindow = new electron__WEBPACK_IMPORTED_MODULE_0__[\"BrowserWindow\"]({\n    height: 563,\n    useContentSize: true,\n    width: 1000\n  });\n\n  mainWindow.loadURL(winURL);\n\n  mainWindow.on('closed', function () {\n    mainWindow = null;\n  });\n}\n\nelectron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].on('ready', createWindow);\n\nelectron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].on('window-all-closed', function () {\n  if (process.platform !== 'darwin') {\n    electron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].quit();\n  }\n});\n\nelectron__WEBPACK_IMPORTED_MODULE_0__[\"app\"].on('activate', function () {\n  if (mainWindow === null) {\n    createWindow();\n  }\n});\n\n//# sourceURL=webpack:///./src/main/index.js?");

/***/ }),

/***/ 0:
/*!*********************************************************!*\
  !*** multi ./src/main/index.dev.js ./src/main/index.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! /home/mamokin/Documents/code/Fantasy-Map-Generator-Electron-Vuex/genesys-gm/src/main/index.dev.js */\"./src/main/index.dev.js\");\nmodule.exports = __webpack_require__(/*! /home/mamokin/Documents/code/Fantasy-Map-Generator-Electron-Vuex/genesys-gm/src/main/index.js */\"./src/main/index.js\");\n\n\n//# sourceURL=webpack:///multi_./src/main/index.dev.js_./src/main/index.js?");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"assert\");\n\n//# sourceURL=webpack:///external_%22assert%22?");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"child_process\");\n\n//# sourceURL=webpack:///external_%22child_process%22?");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron\");\n\n//# sourceURL=webpack:///external_%22electron%22?");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"events\");\n\n//# sourceURL=webpack:///external_%22events%22?");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"fs\");\n\n//# sourceURL=webpack:///external_%22fs%22?");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"https\");\n\n//# sourceURL=webpack:///external_%22https%22?");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"net\");\n\n//# sourceURL=webpack:///external_%22net%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ }),

/***/ "tty":
/*!**********************!*\
  !*** external "tty" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"tty\");\n\n//# sourceURL=webpack:///external_%22tty%22?");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"util\");\n\n//# sourceURL=webpack:///external_%22util%22?");

/***/ })

/******/ });