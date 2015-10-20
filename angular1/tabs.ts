var angular = window['angular'];
var mod = angular.module('tabs', []);

mod.directive('tabTitle', () => {
  return {
		restrict: 'E',
		controller: TabTitle,
		controllerAs: 'ctrl',
		require: ['tabTitle', '^tabs'],
		replace: true,
		link: ($scope, el, attrs, ctrls) => {
			ctrls[0].init(ctrls[1]);
		},
		scope: {},
		transclude: true,
		template: `
<div ng-click="ctrl.updateActiveTab()"
     ng-class="{'is-active': ctrl.selected}"
		 class="tab-title mdl-tabs__tab" ng-transclude>
</div>
		`
	};
});

class TabTitle {
	selected:boolean = false;
	tabs: Tabs;

	constructor($scope, $element) {
		$element.data('tabTitleCtrl', this);
		$scope.$on('$destroy', () => this.tabs.childrenChanged());
	}

	init(tabs:Tabs) {
		this.tabs = tabs;
		tabs.childrenChanged();
	}

	updateActiveTab() {
		this.tabs.updateActiveTabByTitle(this);
	}

	activate() {
		this.selected = true;
	}

	deactivate() {
		this.selected = false;
	}
}

mod.directive('tabContent', () => {
  return {
		restrict: 'E',
		controller: TabContent,
		controllerAs: 'ctrl',
		require: ['tabContent', '^tabs'],
		replace: true,
		link: ($scope, el, attrs, ctrls) => {
			ctrls[0].init(ctrls[1]);
		},
		scope: {},
		transclude: true,
		template: `
<div ng-class="{'is-active': ctrl.selected}"
     class="tab-content mdl-tabs__panel"
		 ng-transclude>
</div>
		`
	};
});

class TabContent {
	selected:boolean = false;
	tabs:Tabs;

	constructor($scope, $element) {
		$element.data('tabContentCtrl', this);
		$scope.$on('$destroy', () => this.tabs.childrenChanged());
	}

	init(tabs:Tabs) {
		this.tabs = tabs;
		tabs.childrenChanged();
	}

	activate() {
		this.selected = true;
	}

	deactivate() {
		this.selected = false;
	}
}

mod.directive('tabs', () => {
  return {
		restrict: 'E',
		controller: Tabs,
		controllerAs: 'ctrl',
		scope: {},
    transclude: { tabTitle: 'titleSlot', tabContent: 'contentSlot' },
		link: ($scope, el, attrs, ctrl) => {
			ctrl.childrenChanged();
		},
    template: `
<div class="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
	<button class="mdl-button mdl-js-button mdl-tabs__tab" ng-click="ctrl.nextTab()">Next Tab</button>
  <div class="mdl-tabs__tab-bar" ng-transclude="titleSlot"></div>
  <div ng-transclude="contentSlot"></div>
</div>
    `
	};
});

class Tabs {
	titles:TabTitle[] = [];
	contents:TabContent[] = [];
	activeTitle: TabTitle;

	readChildrenOrderScheduled:boolean = false;

	constructor(private $scope, private $element) {}

	childrenChanged() {
		if (this.readChildrenOrderScheduled) return;
		this.readChildrenOrderScheduled = true;
		this.$scope.$evalAsync( () => {
			this.readChildrenOrderScheduled = false;
			this.readChildrenOrder();
		});
	}

	private readChildrenOrder() {
		var titleEls = angular.element(this.$element[0].querySelectorAll('.tab-title'));
		this.titles = [];
		for (var i=0; i<titleEls.length; i++) {
			this.titles.push(titleEls.eq(i).data('tabTitleCtrl'));
		}
		var contentEls = angular.element(this.$element[0].querySelectorAll('.tab-content'));
		this.contents = [];
		for (var i=0; i<contentEls.length; i++) {
			this.contents.push(contentEls.eq(i).data('tabContentCtrl'));
		}
		this.updateActiveTabByTitle(this.titles[0]);
	}

	updateActiveTabByTitle(activeTitle:TabTitle) {
		this.updateActiveTab( (titleArr) => titleArr.indexOf(activeTitle));
	}

  nextTab() {
		this.updateActiveTab( (titleArr, lastIndex) => (lastIndex + 1) % titleArr.length);
	}

	private updateActiveTab(nextActiveIndexCb: (titleArr: TabTitle[], lastIndex:number) => number) {
    var lastIndex = this.titles.indexOf(this.activeTitle);
		var nextIndex = nextActiveIndexCb(this.titles, lastIndex);
    this.activeTitle = this.titles[nextIndex];

		if (lastIndex !== -1) {
			this.titles[lastIndex].deactivate();
			this.contents[lastIndex].deactivate();
		}
		this.titles[nextIndex].activate();
		this.contents[nextIndex].activate();
	}
}
