/**
 * Created by xuxle on 2015/9/24.
 */

requirejs.config({
    baseUrl: './js',
    paths: {
        app: 'app',
        ionic: '../lib/ionic/release/js/ionic.bundle',
        ngCordova: '../lib/ngCordova/dist/ng-cordova',
        ngDebounce: '../lib/ng-debounce/angular-debounce'
    },
    shim: {
        ngCordova: {
            deps: ['ionic']
        },
        ngDebounce: {
            deps: ['ionic']
        }
    }
});

// Start the main app logic.
requirejs(['app'], function () {
    var onReady = function () {
        angular.bootstrap(document, ['weather']);
    };
    document.addEventListener("deviceready", onReady, false);
    if (typeof cordova === 'undefined') {
        angular.element(document).ready(function() {
            onReady();
        });
    }
});