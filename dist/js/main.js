require.config({baseUrl:"js/lib",paths:{app:"../app",helpers:"../helpers",jquery:"./jquery-2.1.4.min",backbone:"./backbone-0.9.2",underscore:"./underscore-1.4.2",i18n:"../i18n","underscore.string":"./underscore.string-3.2.2.min",text:"./text-2.0.14"},shim:{backbone:{deps:["underscore","jquery"],exports:"Backbone"},underscore:{exports:"_"},jquery:{exports:"$"},i18n:{deps:["jquery"]},"underscore.string":{deps:["underscore"],exports:"s"}}}),require(["app/ApplicationController"],function(a){"use strict";new a});