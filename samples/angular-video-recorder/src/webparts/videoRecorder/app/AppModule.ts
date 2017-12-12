import * as angular from 'angular';  
import HomeController from './HomeController';  
import DataService from './DataService';
import { CustomFileChange } from '../app/CustomFileChange';

const videorecorderapp: ng.IModule = angular.module('videorecorderapp', []);

videorecorderapp  
  .controller('HomeController', HomeController)
  .directive("customFileChange", CustomFileChange.factory())
  .service('DataService', DataService);