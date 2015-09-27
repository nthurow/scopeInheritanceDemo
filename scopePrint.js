angular.module('customDirectives', [])
    .config(function ($sceProvider) {
        $sceProvider.enabled(false);
    })
    .directive('printScope', function () {

        return {
            restrict: 'AE',
            scope: {
                printScope: '='
            },
            template: '<span ng-bind-html="getScopeStructure(printScope, 0)"></span>',
            link: function (scope) {

                scope.getScopeStructure = function(scopeToPrint, levelsDeep) {

                    var lines = [];

                    var openBracket = getNumSpacesIndent(levelsDeep) + '{<br>';

                    for (var prop in scopeToPrint) {
                        if (scopeToPrint.hasOwnProperty(prop) && prop.indexOf('$') !== 0) {

                            var newLine = getNumSpacesIndent(levelsDeep + 1);
                            newLine += prop + ': ';
                            newLine += scopeToPrint[prop];

                            if (typeof scopeToPrint[prop] !== 'function' && typeof scopeToPrint[prop] !== 'object') {
                                lines.push(newLine);
                            }
                        }
                    }

                    if (Object.getPrototypeOf(scopeToPrint)) {
                        var childOutput = scope.getScopeStructure(Object.getPrototypeOf(scopeToPrint), levelsDeep + 1);

                        if (childOutput.replace(/&nbsp;/igm, '').replace(/<br>/igm, '').replace(/({|})/igm, '')) {
                            lines.push(childOutput);
                        }
                    }

                    var output = lines.join(',<br>');

                    return openBracket + output + '<br>' + getNumSpacesIndent(levelsDeep) + '}';
                };

                function getNumSpacesIndent(levelsDeep) {

                    var output = '';

                    for (var x = 0; x < levelsDeep; x++) {
                        output += '&nbsp;&nbsp;&nbsp;&nbsp;';
                    }

                    return output;
                }
            }
        };
    });