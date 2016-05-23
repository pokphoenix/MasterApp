angular.module("semi.directives", []).

    directive('actualSrc', function () {
        return {
            link: function postLink(scope, element, attrs) {
                attrs.$observe('actualSrc', function (newVal, oldVal) {
                    if (newVal !== undefined) {
                        var img = new Image();
                        img.src = attrs.actualSrc;
                        angular.element(img).bind('load', function () {
                            element.attr("src", attrs.actualSrc);
                        });
                    }
                });

            }
        }
    }).

    directive('compareTo', function () {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function (scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function (modelValue) {
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function () {
                    ngModel.$validate();
                });
            }
        };
    }).
    directive('notCompareTo', function () {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=notCompareTo"
            },
            link: function (scope, element, attributes, ngModel) {

                ngModel.$validators.notCompareTo = function (modelValue) {
                    return modelValue != scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function () {
                    ngModel.$validate();
                });
            }
        };
    }).

    directive('treeModel', function ($compile) {
        return {
            restrict: 'A',
            link: function (a, g, c) {
                var e = c.treeModel, h = c.nodeLabel || "label", d = c.nodeChildren || "children",
                    k = '<ul>' +
                        '<li ng-repeat="node in ' + e + '">' +
                        '<i class="collapsed" ng-show="node.' + d + '.length && node.collapsed" ng-click="selectNodeHead(node, $event)"></i>' +
                        '<i class="expanded" ng-show="node.' + d + '.length && !node.collapsed" ng-click="selectNodeHead(node, $event)"></i>' +
                        '<i class="normal" ng-hide="node.' + d + '.length"></i> ' +
                        '<span ng-class="node.selected" ng-click="selectNodeLabel(node, $event)">{{node.' + h + '}}</span>' +
                        '<div ng-hide="node.collapsed" tree-model="node.' + d + '" node-id=' + (c.nodeId || "id") + " node-label=" + h + " node-children=" + d + "></div>" +
                        "</li>" +
                        "</ul>";
                e && e.length && (c.angularTreeview ? (a.$watch(e, function (m, b) {
                    g.empty().html($compile(k)(a))
                }, !1), a.selectNodeHead = a.selectNodeHead || function (a, b) {
                        b.stopPropagation && b.stopPropagation();
                        b.preventDefault && b.preventDefault();
                        b.cancelBubble = !0;
                        b.returnValue = !1;
                        a.collapsed = !a.collapsed
                    }, a.selectNodeLabel = a.selectNodeLabel || function (c, b) {
                        b.stopPropagation && b.stopPropagation();
                        b.preventDefault && b.preventDefault();
                        b.cancelBubble = !0;
                        b.returnValue = !1;
                        a.currentNode && a.currentNode.selected && (a.currentNode.selected = void 0);
                        c.selected = "selected";
                        a.currentNode = c
                    }) : g.html($compile(k)(a)))
            }

        }
    });

