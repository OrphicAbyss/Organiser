/** 
 * Natus Organizare
 */
var gluon = angular.module('NatusOrg', []);

function PageCtrl($scope) {
    $scope.todo = {list: [{id: 1, title: "Finish todo site", extra: "Add saving, loading, serverside etc."}, {id: 2, title: "Apply for job", extra: "Find job"}], add: ""};

    $scope.clickAdd = function() {
        var title = $scope.todo.add;

        if ("" != title) {
            var count = $scope.todo.list.length;

            $scope.todo.list.push({id: count + 1, title: title});
            $scope.todo.add = "";
        }
    }
    
    $scope.edit = function() {
        
    }
    
    $scope.done = function() {
        
    }

    $scope.dragStart = function(e, ui) {
        $('#sortable').addClass("alert-warning");
        ui.item.data('start', ui.item.index());
    }

    $scope.dragEnd = function(e, ui) {
        $('#sortable').removeClass("alert-warning");
        var start = ui.item.data('start'),
                end = ui.item.index();

        $scope.sortableArray.splice(end, 0,
                $scope.sortableArray.splice(start, 1)[0]);

        $scope.$apply();
    }

    $scope.dragStop = function(e, ui) {
        $('#sortable').removeClass("alert-warning");
    }

    sortableEle = $('#sortable').sortable({
        start: $scope.dragStart,
        update: $scope.dragEnd,
        stop: $scope.dragStop
    });
}

gluon.directive('task', function() {
    return {
        restrict: 'A',
        replace: true,
        scope: {},
        tempate: '<h1>Hi</h1>',
        link: function(scope, element, attr) {
            
        }
    }
})

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
            
            element.css({resize:"none", overflow:"hidden"});
            
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