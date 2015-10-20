import './tabs';
import './conf_talks';

var angular = window['angular'];
var m = angular.module('demo', ['tabs', 'conf_talks']);

class App {
  data;
  eventsVisible = false;

  constructor() {
    this.data = [
      {id: 1, title: 'Routing in Eleven Dimensions with Component Router', speaker: 'Brian Ford', description: 'Component Router is a futuristic routing system for Angular 1 and 2 that may or may not have been constructed from recovered extraterrestrial technology. We’ll show how it helps organize your application, explain the linking DSL, and show how to make use of lifecycle hooks. Then we’ll talk about advanced features and auxiliary routing.'},

      {id: 2, title: 'Testing strategies with Angular 2', speaker: 'Julie Ralph', description: 'Angular loves testability, and Angular 2 will continue to make it easy to write great test suites so that you’re confident in your site. Learn how to use karma and other tools to set up and debug tests, see how the Angular team creates their test suite, and meet new test helpers just for Angular 2 components.'},

      {id: 3, title: 'Building the Best Components', speaker: 'Jeremy Elbourn', description: 'The component is the new atomic unit of an Angular 2 application. So what makes a good component? This talk will explore how Angular 2 components are different from the directives you’re used to and provide some practical guidance on building them. We’ll also look at different types of tests you can write to guard against all kinds of regressions.'},

      {id: 4, title: 'Creating realtime apps with Angular 2 and Meteor', speaker: 'Uri Goldshtein', description: 'Meteor is an open source JavaScript application platform for building realtime web and mobile applications. Meteor is also the perfect backend for Angular 2.0 applications. In this talk, you will learn how to create a real time full-stack Angular 2.0 Meteor app in minutes. You will also learn about the details of the integration, the similarities between the philosophies of both platforms, and the future collaborations between the two.'},

      {id: 5, title: 'Using Web Workers for more responsive apps', speaker: 'Jason Teplitz', description: 'Angular 2’s split rendering structure allow us to automagically run most of Angular and your code on a separate processor core via Web Workers. See live demos, and find out how to get started on the early version of this feature.'}
    ]
  }
}

m.directive('content', () => ({
	template: `
    <label class="mdl-checkbox mdl-js-checkbox" for="chk1">
      <input id="chk1" type="checkbox" class="mdl-checkbox__input" ng-model="eventsVisible">
      <span class="mdl-checkbox__label">Show events</span>
    </label>
    <tabs>
			<tab-title>Talks</tab-title>
			<tab-content>
        <conf-talks talks="ctrl.data">
          <div template-ref name="row-template">
            <li class="demo-card-wide mdl-card mdl-shadow--2dp">
              <a href="/talks/{{talk.id}}" class="mdl-card__title">
                {{talk.title}} by {{talk.speaker}}
              </a>
              <p class="mdl-card__supporting-text">{{talk.description}}</p>
            </li>
          </div>
        </conf-talks>
      </tab-content>
      <tab-title ng-if="eventsVisible">Events</tab-title>
      <tab-content ng-if="eventsVisible">
        <ul>
          <li>Slide review</li>
          <li>Speaker diner</li>
        </ul>
      </tab-content>
			<tab-title>Speakers</tab-title>
			<tab-content>
				<ul>
					<li>Brian Ford</li>
					<li>Julie Ralph</li>
					<li>Jeremy Elbourn</li>
					<li>Uri Goldshtein</li>
					<li>Jason Teplitz</li>
				</ul>
			</tab-content>
    </tabs>
	`,
	scope: {},
	restrict: 'E',
  controller: App,
  controllerAs: 'ctrl'
}));

var el = document.querySelector("#content");
angular.bootstrap(el, ["demo"]);