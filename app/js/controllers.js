'use strict';

/* Controllers */

angular.module('myApp.controllers', ['firebase.utils', 'ui.bootstrap'])
	.controller('NavbarCtrl', ['$scope', 'simpleLogin', 'fbutil', '$location', '$modal', 'Data',
		function($scope, simpleLogin, fbutil, $location, $modal, Data) {
			$scope.data = Data;

			$scope.logout = function() {
				simpleLogin.logout();
				$scope.navbarCollapsed = true;
				$location.path('/home');
			};

			$scope.loginModal = function () {
				$scope.navbarCollapsed = true;
				var modalInstance = $modal.open({
					templateUrl: 'loginModal.html',
					controller: ModalInstanceCtrl
				});
			};

			var ModalInstanceCtrl = function ($scope, $modalInstance) {
				$scope.createMode = false;

				$scope.close = function() {
					$modalInstance.close();
				}

				$scope.login = function(email, pass) {
					$scope.err = null;
					simpleLogin.login(email, pass)
						.then(function(/* user */) {
							$modalInstance.close();
	//						$location.path('/home');
						}, function(err) {
							$scope.err = errMessage(err);
						});
				};

				$scope.createAccount = function(email, pass, confirm) {
					$scope.err = null;
					if (!email) {
						$scope.err = 'Please enter an email address';
					}
					else if (!pass || !confirm) {
						$scope.err = 'Please enter a password';
					}
					else if (pass != confirm ) {
						$scope.err = 'Passwords do not match';
					}

					if (!$scope.err) {
						simpleLogin.createAccount(email, pass).then(function(/* user */) {
							$modalInstance.close()
						}, function(err) {
							$scope.err = errMessage(err);
						});
					}
				};

				function errMessage(err) {
					return angular.isObject(err) && err.code ? err.code : err + '';
				}
			};
		}
	])

	.controller('HomeCtrl', ['$scope', 'fbutil', 'Data', function($scope, fbutil, Data) {
		$scope.people = fbutil.syncArray('employees');
		$scope.employees = fbutil.syncObject('employees');
		$scope.data = Data;

		$scope.checkIn = function(employee) {
			var now = new Date();
			var dt = now.getTime();
			$scope.employees[employee.$id].present = true;
			$scope.employees[employee.$id].itime = dt;
			$scope.employees.$save();
		}

		$scope.checkOut = function(employee) {
			var now = new Date();
			var dt = now.getTime();
			$scope.employees[employee.$id].present = false;
			$scope.employees[employee.$id].otime = dt;
			$scope.employees.$save();
		}
	}])
	
	.controller('EmployeesCtrl', ['$scope', 'fbutil', function($scope, fbutil) {
		$scope.people = fbutil.syncArray('employees');
		$scope.employees = fbutil.syncObject('employees');
		$scope.data = {
			editing: 0
		};

		$scope.register = function() {
			console.log('called register()');
			console.log('ooo');
			if ($scope.newguy && $scope.newguy.name) {
				console.log('length: ', $scope.newguy.name.length);
				var now = new Date();
				var dt = now.getTime();
				var newguy = {
					name: $scope.newguy.name,
					otime: dt,
					present: false
				}
				$scope.people.$add(newguy).then(function(ref) {
					var id = ref.name();
					console.log('added record with id ' + ref.name());
					$scope.newguy.name = '';
				});
			}
			else {
				console.log('missing name');
			}
		}

		$scope.save = function(employee) {
			$scope.employees.$save();
			$scope.data.editing = 0;
		}

		$scope.delete = function(employee) {
			console.log('deleting ' + employee.$id);
			$scope.people.$remove(employee).then(function(ref) {
				var id = ref.name();
				console.log('deleted record with id ' + ref.name());
			});
		}
	}]);