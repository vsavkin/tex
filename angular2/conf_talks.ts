import {bootstrap, Component, CORE_DIRECTIVES, FORM_DIRECTIVES, Input, ViewChild, ContentChild, TemplateRef, NgForm} from 'angular2/angular2';
import {Observable} from "@reactivex/rxjs"; // this will be removed in the next alpha

@Component({
  selector: 'conf-talks',
  directives: [CORE_DIRECTIVES, FORM_DIRECTIVES],
  template: `
	  <form>
	    <div class="mdl-textfield mdl-js-textfield">
        <input class="mdl-textfield__input" ng-control="speaker" id="speaker" minlength="3">
        <label class="mdl-textfield__label" for="speaker">Speaker...</label>
      </div>
	    <div class="mdl-textfield mdl-js-textfield">
        <input class="mdl-textfield__input" ng-control="title" id="title" minlength="3">
        <label class="mdl-textfield__label" for="title">Title...</label>
      </div>
	  </form>
    <ul>
      <template ng-for [ng-for-of]="filteredTalks" [ng-for-template]="itemTmpl"/>
    </ul>
  `
})
export class ConfTalks {
  private _talks;
  private filteredTalks;
  @Input()
  set talks(talks) {
    this._talks = talks;
    this.filteredTalks = talks;
  }
  @ContentChild(TemplateRef) itemTmpl;
  @ViewChild(NgForm) form;

  afterViewInit() {
    var obs = <any>Observable.from(this.form.control.valueChanges.toRx()); // this will be removed in the next alpha
    obs.filter(_ => this.form.valid).
      throttle(500).
      subscribe(value => this.selectTalk(value));
  }

  selectTalk(filters) {
    this.filteredTalks = this._talks.filter(t => {
      var speakerMatched = t.speaker.indexOf(filters.speaker) > -1;
      var titleMatched = t.title.indexOf(filters.title) > -1;
      return (speakerMatched || !filters.speaker) && (titleMatched || !filters.title);
    });
  }
}