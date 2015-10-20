var angular = window['angular'];
var m = angular.module('conf_talks', []);

m.directive("templateRef", () => ({
  restrict: 'A',
  multiElement: true,
  transclude: "element",
  require: '^confTalks',
  terminal: true,
  $$tlb: true,
  scope: {
    'name':'@'
  },
  compile: (element, attrs) => {
    return ($scope, el, attrs, ctrl, transclude) => {
      var parent = el[0].parentNode;
      // this is not performant
      // doing it "the right way" will be a lot more involved
      ctrl.addTemplate($scope.name, (items) => {
        parent.innerHTML = '';
        items.forEach(t => {
          var scope = $scope.$new(true);
          scope.talk = t;
          transclude(scope, (clone) => {
            parent.appendChild(clone[0]);
          });
        });
      })
    };
  }
}));


class ConfTalks {
  templates;
  _speakerFilter;
  _titleFilter;
  filters;
  timeout;
  _talks;
  filteredTalks;
  timer;

  constructor($timeout) {
    this.templates = {};
    this._speakerFilter = null;
    this._titleFilter = null;
    this.filters = null;
    this.timeout = $timeout;
  }

  set talks(talks) {
    this._talks = talks;
    this.filteredTalks = talks;
    this.rerender();
  }

  addTemplate(templateName, fn) {
    this.templates[templateName] = fn;
    this.rerender();
  }

  rerender() {
    if (!this.templates) return;
    if (!this.templates['row-template']) {
      throw new Error("Row template must be specified");
    }
    this.templates['row-template'](this.filteredTalks);
  }

  set speakerFilter(value) {
    this._speakerFilter = value;
    this.selectAfterHalfASecond();
  }

  get speakerFilter() {
    return this._speakerFilter;
  }

  set titleFilter(value) {
    this._titleFilter = value;
    this.selectAfterHalfASecond();
  }

  get titleFilter() {
    return this._titleFilter;
  }

  selectAfterHalfASecond() {
    clearTimeout(this.timer);
    if (this.filters.$valid) {
      this.timer = this.timeout(() => {
        this.selectTalk();
      }, 500);
    }
  }

  selectTalk() {
    this.filteredTalks = this._talks.filter(t => {
      var speakerMatched = t.speaker.indexOf(this.speakerFilter) > -1;
      var titleMatched = t.title.indexOf(this.titleFilter) > -1;
      return (speakerMatched || !this.speakerFilter) && (titleMatched || !this.titleFilter);
    });
    this.rerender();
  }
}

m.directive("confTalks", () => ({
  template: `
    <form name="ctrl.filters">
      <div class="mdl-textfield mdl-js-textfield">
        <input  class="mdl-textfield__input" ng-model="ctrl.speakerFilter" id="speaker" minlength="3">
        <label class="mdl-textfield__label" for="speaker">Speaker...</label>
      </div>
	    <div class="mdl-textfield mdl-js-textfield">
        <input  class="mdl-textfield__input" ng-model="ctrl.titleFilter" id="title" minlength="3">
        <label class="mdl-textfield__label" for="title">Title...</label>
      </div>
		</form>
    <ul>
      <ng-transclude></ng-transclude>
    </ul>
	`,
  restrict: 'E',
  transclude: true,
  controller: ConfTalks,
  controllerAs: 'ctrl',
  scope: {
    talks: '='
  },
  bindToController: true
}));