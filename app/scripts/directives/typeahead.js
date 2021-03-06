app.directive('typeahead', ["$timeout", function($timeout) {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        template: '<div><form><input class="form-control" ng-model="term" ng-click="query()" ng-change="query()" type="text" autocomplete="off" /></form><div class="dropdown" ng-transclude></div></div>',
        scope: {
            search: "&",
            select: "&",
            items: "=",
            term: "="
        },
        controller: ["$scope", "keyboardManager", function($scope, keyboardManager) {
            $scope.items = [];
            $scope.hide = false;
            $scope.showme = false;

            this.activate = function(item) {
                $scope.active = item;
            };

            this.activateNextItem = function() {
                var index = $scope.items.indexOf($scope.active);
                this.activate($scope.items[(index + 1) % $scope.items.length]);
            };

            this.activatePreviousItem = function() {
                var index = $scope.items.indexOf($scope.active);
                this.activate($scope.items[index === 0 ? $scope.items.length - 1 : index - 1]);
            };

            this.isActive = function(item) {
                return $scope.active === item;
            };

            this.selectActive = function() {
                this.select($scope.active);
            };

            this.select = function(item) {
                $scope.hide = true;
                $scope.focused = false;
                $scope.select({item:item});
                $scope.showme = false;
            };

            $scope.isVisible = function() {
                return !$scope.hide && ($scope.focused || $scope.mousedOver);
            };

            $scope.query = function() {
                $scope.hide = false;
                $scope.search({term:$scope.term});
            }

            var open = function(){
                $scope.showme = !$scope.showme;
                
                if($scope.showme) {
                    $scope.query();
                    $scope.focused = true;
                }
            }
            keyboardManager.bind('meta+shift+p',open);
            keyboardManager.bind('ctrl+shift+p',open);
        }],

        link: function(scope, element, attrs, controller) {

            var $input = element.find('form > input');
            var $list = element.find('> div');

            $input.bind('focus', function() {
                $("#SubChrome .dropdown-menu").dropdown("toggle");
                scope.$apply(function() { scope.focused = true; });
            });

            $input.bind('blur', function() {
                $("#SubChrome .dropdown-menu").dropdown("toggle");
                scope.$apply(function() { scope.focused = false; });
            });

            $list.bind('mouseover', function() {
                scope.$apply(function() { scope.mousedOver = true; });
            });

            $list.bind('mouseleave', function() {
                scope.$apply(function() { scope.mousedOver = false; });
            });

            $input.bind('keyup', function(e) {
                if (e.keyCode === 9 || e.keyCode === 13) {
                    scope.$apply(function() { controller.selectActive(); });
                }

                if (e.keyCode === 27) {
                    scope.$apply(function() { 
                        scope.hide = true; 
                        scope.showme = false;
                    });
                }
            });

            $input.bind('keydown', function(e) {
                if (e.keyCode === 9 || e.keyCode === 13 || e.keyCode === 27) {
                    e.preventDefault();
                };

                if (e.keyCode === 40) {
                    e.preventDefault();
                    scope.$apply(function() { controller.activateNextItem(); });
                }

                if (e.keyCode === 38) {
                    e.preventDefault();
                    scope.$apply(function() { controller.activatePreviousItem(); });
                }
            });

            scope.$watch('items', function(items) {
                controller.activate(items.length ? items[0] : null);
            });

            scope.$watch('focused', function(focused) {
                if (focused) {
                    $timeout(function() { $input.focus(); }, 0, false);
                }
            });

            scope.$watch('showme',function(show){
                if(show) {
                    element.css('display', 'block');
                } else {
                    element.css('display', 'none');
                }
            });

            scope.$watch('isVisible()', function(visible) {
                if (visible) {
                    $list.css({
                        width: '100%',
                        position: 'absolute',
                        display: 'block'
                    });
                } else {
                    $list.css('display', 'none');
                }
            });
        }
    };
}]);

app.directive('typeaheadItem', function() {
    return {
        require: '^typeahead',
        link: function(scope, element, attrs, controller) {

            var item = scope.$eval(attrs.typeaheadItem);

            scope.$watch(function() { return controller.isActive(item); }, function(active) {
                if (active) {
                    element.addClass('active');
                } else {
                    element.removeClass('active');
                }
            });

            element.bind('mouseenter', function(e) {
                scope.$apply(function() { controller.activate(item); });
            });

            element.bind('click', function(e) {
                scope.$apply(function() { controller.select(item); });
            });
        }
    };
});