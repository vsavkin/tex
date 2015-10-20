import {Component, QueryList, ContentChildren, Inject, forwardRef} from 'angular2/angular2';

@Component({
	selector: 'tab-title',
	host: {'(click)': 'updateActiveTab()', '[class.is-active]': 'active', 'class': 'mdl-tabs__tab'},
	template: `<ng-content></ng-content>`
})
export class TabTitle {
	active:boolean = false;
	constructor(@Inject(forwardRef(() => Tabs)) private tabs:Tabs) {}

	updateActiveTab() {
		this.tabs.updateActiveTabByTitle(this);
	}

	activate() {
		this.active = true;
	}

	deactivate() {
		this.active = false;
	}
}

@Component({
	selector: 'tab-content',
	host: {'[class.is-active]': 'active', 'class': 'mdl-tabs__panel'},
	template: `<ng-content></ng-content>`
})
export class TabContent {
	active: boolean = false;

	activate() {
		this.active = true;
	}

	deactivate() {
		this.active = false;
	}
}

@Component({
	selector: 'tabs',
	template: `
	<button class="mdl-button mdl-js-button mdl-tabs__tab" (click)="nextTab()">Next Tab</button>
	<div class="mdl-tabs__tab-bar">
		<ng-content select="tab-title,.tab-title"></ng-content>
	</div>
	<ng-content select="tab-content,.tab-content"></ng-content>
  `,
	host: {'class': 'mdl-tabs mdl-js-tabs mdl-js-ripple-effect'}
})
export class Tabs {
	@ContentChildren(TabTitle) titles: QueryList<TabTitle>;
	@ContentChildren(TabContent) contents: QueryList<TabContent>;
	activeTitle: TabTitle = null;

	afterContentInit() {
		this.titles.changes.observer({
			next: () => this.updateActiveTabByTitle(this.titles.first)
		});
	}

	updateActiveTabByTitle(activeTitle:TabTitle) {
		this.updateActiveTab( (titleArr) => titleArr.indexOf(activeTitle));
	}

  nextTab() {
		this.updateActiveTab( (titleArr, lastIndex) => (lastIndex + 1) % titleArr.length);
	}

	private updateActiveTab(nextActiveIndexCb: (titleArr: TabTitle[], lastIndex:number) => number) {
    var titleArr = toArray(this.titles);
		var contentArr = toArray(this.contents);
    var lastIndex = titleArr.indexOf(this.activeTitle);
		var nextIndex = nextActiveIndexCb(titleArr, lastIndex);
    this.activeTitle = titleArr[nextIndex];

		if (lastIndex !== -1) {
			titleArr[lastIndex].deactivate();
			contentArr[lastIndex].deactivate();
		}
		titleArr[nextIndex].activate();
		contentArr[nextIndex].activate();
	}
}

function toArray<T>(query:QueryList<T>):T[] { // won't be needed in the next alpha
	var result = [];
	query.map( value => result.push(value) );
	return result;
}