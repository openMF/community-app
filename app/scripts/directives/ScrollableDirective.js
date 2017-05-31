/*

Reference from JSfiddle : https://jsfiddle.net/sonicblis/2afea34h/9/

 */

(function(module){
   mifosX.directives = _.extend(module,{
       ScrollableDirective: function($document, $interval, $timeout, $window){
           return {
               restrict: 'A',
               link: function($scope, wrappedElement) {
                   var element = wrappedElement[0],
                       navTabsElement,
                       scrollTimer,
                       dragInfo = {};
                   

                   init();
                    function scrollOnWheel($event){
                        var delta = Math.max(-1, Math.min(1, ($event.originalEvent.wheelDelta || -$event.originalEvent.detail)));
                        navTabsElement.scrollLeft -= 15*delta;
                        $event.preventDefault();

                    }
                   function startScroll($event) {
                       if ($event.target == element) {
                           scrollTimer = $interval(function() {
                               navTabsElement.scrollLeft += ($event.clientX > 260) ? 10 : -10;
                           }, 1000 / 60);
                       }
                   }

                   function stopScroll($event) {
                       $interval.cancel(scrollTimer);
                   }

                   function onDocumentMouseMove($event) {
                       var differenceX = $event.pageX - dragInfo.lastPageX;

                       dragInfo.lastPageX = $event.pageX;
                       dragInfo.moved = true;

                       navTabsElement.scrollLeft -= differenceX;
                   }

                   function onDocumentMouseUp($event) {
                       //$event.preventDefault();
                       //$event.stopPropagation();
                       //$event.cancelBubble = true;

                       $document.off('mousemove', onDocumentMouseMove);
                       $document.off('mouseup', onDocumentMouseUp)
                       
                       if (dragInfo.moved === true) {
                           [].forEach.call(navTabsElement.querySelectorAll('li a'), function(anchor) {
                               var anchorScope = angular.element(anchor).scope();
                               anchorScope.oldDisabled = anchorScope.disabled;
                               anchorScope.disabled = true;
                           });
                           $timeout(function() {
                               [].forEach.call(navTabsElement.querySelectorAll('li a'), function(anchor) {
                                   var anchorScope = angular.element(anchor).scope();
                                   anchorScope.disabled = anchorScope.oldDisabled;
                                   delete anchorScope.oldDisabled;
                               });
                           });
                       }
                   }

                   function onNavTabsMouseDown($event) {
                       var currentlyScrollable = element.classList.contains('scrollable');
                       console.log(currentlyScrollable);

                       if (currentlyScrollable === true) {
                           $event.preventDefault();

                           dragInfo.lastPageX = $event.pageX;
                           dragInfo.moved = false;

                           $document.on('mousemove', onDocumentMouseMove);
                           $document.on('mouseup', onDocumentMouseUp);
                       }
                   }

                   function onWindowResize() {
                       checkForScroll();
                   }

                   function checkForScroll(){
                       console.log('checking tabs for scroll');
                       var currentlyScrollable = element.classList.contains('scrollable'),
                           difference = 1;


                       // determine whether or not it should actually be scrollable
                       // the logic is different if the tabs are currently tagged as scrollable
                    
                       if (currentlyScrollable === true) {
                           difference = navTabsElement.scrollWidth - navTabsElement.clientWidth;
                       } else {
                           difference = navTabsElement.clientHeight - navTabsElement.querySelector('.nav-tabs > li').clientHeight;
                       }
                       

                       if (difference > 2) {
                           element.classList.add("scrollable");
                       }
                   }

                   function bindEventListeners() {
                       wrappedElement.on('mousedown', function($event) {
                           startScroll($event);
                       });

                       wrappedElement.on('mouseup mouseleave', function($event) {
                           stopScroll($event);
                       });
                    

                       angular.element(navTabsElement).on('mousedown', onNavTabsMouseDown);
                       angular.element(navTabsElement).on('DOMMouseScroll',scrollOnWheel);
                       angular.element(navTabsElement).on('mousewheel',scrollOnWheel);
                       

                       $window.addEventListener('resize', onWindowResize);

                       $scope.$on('$destroy', function() {
                           wrappedElement.off('mousedown mouseup mouseleave');
                           angular.element(navTabsElement).off('mousedown', onNavTabsMouseDown);
                           $window.removeEventListener('resize', onWindowResize);
                       });
                   }

                   $scope.$on('checkTabs', function(){
                       console.log("tabcheck");
                       $timeout(checkForScroll, 10); });

                   function init() {
                       $timeout(function() {
                           navTabsElement = element.querySelector('.nav-tabs');

                           bindEventListeners();
                           onWindowResize();
                       });
                   }
               }
           }
       }
   })
}(mifosX.directives || {}));

mifosX.ng.application.directive("scrollable", ['$document', '$interval', '$timeout','$window', mifosX.directives.ScrollableDirective]).run(function ($log) {
    $log.info("ScrollableDirective initialized");
});

