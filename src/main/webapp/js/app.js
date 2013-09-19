/** 
 * Natus Organizare
 */
var gluon = angular.module('NatusOrg', []);

gluon.filter('isDone', function() {
    return function(input) {
        var out = [];
        for (var i = 0; i < input.length; i++) {
            if (input[i].done === true) {
                out.push(input[i]);
            }
        }
        return out;
    }
});

gluon.filter('notDone', function() {
    return function(input) {
        var out = [];
        for (var i = 0; i < input.length; i++) {
            if (input[i].done === false) {
                out.push(input[i]);
            }
        }
        return out;
    }
});

function PageCtrl($scope) {
    $scope.todo = {list: [{id: 1, title: "Finish todo site", extra: "Add saving, loading, serverside etc.", done: false},
            {id: 2, title: "Apply for job", extra: "Find job", done: false},
            {id: 3, title: "Book dentist", extra: "Find and book dentist.", done: true},
            {id: 4, title: "Do stuff", extra: "Ok", done: true},
            {id: 5, title: "Done stuff", extra: "Ok", done: true}], add: ""};

    $scope.clickAdd = function() {
        var add = $scope.todo.add;

        if ("" != add.title) {
            var count = $scope.todo.list.length;

            $scope.todo.list.push({id: count + 1, title: add.title, extra: add.extra});
            $scope.todo.add = {};

            angular.element(".nav-tabs a:first").click();
        }
    }

    angular.element(".nav-tabs a").on("click", function(e) {
        angular.element(".nav-tabs > li").removeClass("active");
        angular.element(".tab-content > div").removeClass("active");

        angular.element(this.parentElement).addClass("active");
        angular.element(this.hash).addClass("active");

        return false;
    });

//    $scope.dragStart = function(e, ui) {
//        this.classList.add("alert-warning");
//
//        ui.item.data('start', ui.item.index());
//    }
//
//    $scope.dragEnd = function(e, ui) {
//        this.classList.remove("alert-warning");
//
//        var start = ui.item.data('start');
//        var end = ui.item.index();
//
//        $scope.sortableArray.splice(end, 0, $scope.sortableArray.splice(start, 1)[0]);
//
//        $scope.$apply();
//    }
//
//    $scope.dragStop = function(e, ui) {
//        this.classList.removeClass("alert-warning");
//    }
//
//    sortableEle = $('.sortable').sortable({
//        start: $scope.dragStart,
//        update: $scope.dragEnd,
//        stop: $scope.dragStop
//    });
}

gluon.directive('task', function() {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {item: '=ngModel', list: '=ngList'},
        templateUrl: 'pages/task.html',
        link: function(scope, element, attr) {
            scope.editClick = function() {
                scope.item.editing = true;
                angular.element("#task-" + scope.item.id).collapse('show');
            };
            scope.doneClick = function() {
                scope.item.done = true;
            }
            scope.deleteClick = function() {
                scope.list.splice(scope.list.indexOf(scope.item), 1)
            };
            
            angular.element("[data-toggle='tooltip']").tooltip();
        }
    }
});

gluon.directive('sortable', function() {
    return {
        restrict: 'A',
        link: function($scope, element, attr) {
            var start = function(e) {
                angular.element(this.parentElement).addClass("alert-success");
                angular.element(this).addClass("moving");
                this.id = "draggingElement";

                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', this.innerHTML);
            };

            var enter = function(e) {
                if (e.preventDefault) {
                    e.preventDefault(); // Necessary. Allows us to drop.
                }

//                e.dataTransfer.dropEffect = 'move';
//                angular.element(this).addClass("over");
                return false;
            };

            var over = function(e) {
                if (e.preventDefault) {
                    e.preventDefault(); // Necessary. Allows us to drop.
                }

                e.dataTransfer.dropEffect = 'move';
                angular.element(this).addClass("over");

                return false;
            };

            var leave = function(e) {
                angular.element(this).removeClass("over");
            };

            var end = function(e) {
                angular.element("#draggingElement").removeAttr("id");
                angular.element(this.parentElement).removeClass("alert-success");
                angular.element(this).removeClass("moving");
                console.log("End");
            };

            var drop = function(e) {
                if (e.preventDefault) {
                    e.preventDefault();
                }

                console.log("Drop");
                this.innerHTML = e.dataTransfer.getData('text/html');
            }

            var cancel = function(e) {
                if (e.preventDefault) {
                    e.preventDefault();
                }
                return false;
            }

            $scope.$watch(element.children(), function() {
                var children = element.children();
                for (var i = 0; i < children.length; i++) {
                    children[i].draggable = true;
                    children[i].ondragstart = start;
                    children[i].ondragend = end;
                    children[i].ondragenter = enter;
                    children[i].ondragover = over;
                    children[i].ondrop = drop;
                    //children[i].ondragleave = leave;
                }
            });


//            sortableEle = angular.element(element).sortable({
//                start: start,
//                update: update,
//                stop: stop
//            });
        }
    }
});

/*
 * Adapted from: http://code.google.com/p/gaequery/source/browse/trunk/src/static/scripts/jquery.autogrow-textarea.js
 *
 * Works nicely with the following styles:
 * textarea {
 *	resize: none;
 *  word-wrap: break-word;
 *	transition: 0.05s;
 *	-moz-transition: 0.05s;
 *	-webkit-transition: 0.05s;
 *	-o-transition: 0.05s;
 * }
 *
 * Usage: <textarea></textarea>
 */
gluon.directive('textarea', function() {
    return {
        restrict: 'E',
        link: function(scope, element, attr) {
            var minHeight = element[0].offsetHeight;
            var paddingTop = parseInt(element.css('paddingTop'));
            var paddingBottom = parseInt(element.css('paddingBottom'));
            var paddingLeft = parseInt(element.css('paddingLeft'));
            var paddingRight = parseInt(element.css('paddingRight'));

            var $shadow = angular.element('<div></div>').css({
                position: 'absolute',
                top: -10000,
                left: -10000,
                width: element[0].offsetWidth - paddingLeft - paddingRight,
                fontSize: element.css('fontSize'),
                fontFamily: element.css('fontFamily'),
                lineHeight: element.css('lineHeight'),
                resize: 'none'
            });
            angular.element(document.body).append($shadow);
            scope.$on('$destroy', function() {
                $shadow.remove();
            });

            element.css({resize: "none", overflow: "hidden"});

            var update = function() {
                var times = function(string, number) {
                    for (var i = 0, r = ''; i < number; i++) {
                        r += string;
                    }
                    return r;
                }

                $shadow.css("width", element[0].offsetWidth - paddingLeft - paddingRight + "px");

                var val = element.val().replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/&/g, '&amp;')
                        .replace(/\n$/, '<br/>&nbsp;')
                        .replace(/\n/g, '<br/>')
                        .replace(/\s{2,}/g, function(space) {
                    return times('&nbsp;', space.length - 1) + ' '
                });

                if (val == "") {
                    val = "&nbsp;";
                }

                $shadow.html(val);
                element.css('height', Math.max($shadow[0].offsetHeight + paddingTop + paddingBottom + 2 /* the "threshold" */, minHeight) + 'px');
            }

            element.bind('keyup keydown keypress change', update);
            update();
        }
    }
});