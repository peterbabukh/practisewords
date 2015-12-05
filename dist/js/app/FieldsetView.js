define(["backbone","app/WordsCollection","i18n!../../js/nls/ru","text!../../templates/fieldset.html","text!../../templates/gradeCol.html","text!../../templates/gradeTree.html","app/GradesModel","app/UserModel","app/AppHeaderView"],function(a,b,c,d,e,f,g,h,i){"use strict";var j=a.View.extend({el:$(".content-box"),initialize:function(){this.gradesModel=new g,this.user=new h,this.childViews=[]},events:{"click .checkbox-select":"checkoutCheckboxes","click .choose-all-groups":"selectAllCheckboxes","click .submit-form":"submitForm","click .lesson-list":"toggleLessonList"},fieldsetTemplate:_.template(d),gradeTemplateTree:_.template(f),gradeTemplateCol:_.template(e),render:function(){var a=this;return this.childViews.length&&this.onClose(),this.gradesModel.fetch({success:function(b,c,d){a.collection=b.get("words")},error:function(b,d,e){alert(c.msg.systemErrorMessage),a.handleError()}}).done(function(){a.handleSuccess()}),this},handleSuccess:function(){this.$el.html(this.fieldsetTemplate(c)),this.appendHeader(),this.createGrades()},handleError:function(){alert(c.msg.systemErrorMessage),this.goTo("/fieldset"),window.location.reload()},createGrades:function(){var a,b=this,d=b.$el.find("option[selected]").val(),e=this.valuesToArray("grade");e=e.sort(function(a,b){return String(a)>String(b)}),a="lesson"==d?b.gradeTemplateTree:b.gradeTemplateCol,$(".checkbox-container").empty(),_.each(e,function(e){var f=a({grade:e,array:b.getLessons(e,d),display_type:d,i18n:c});$(".checkbox-container").append(f)})},checkoutCheckboxes:function(a){a=a||window.event;var b=a.target||a.srcElement;this.$el.find("option").attr("selected",!1),$(b).attr("selected",!0),this.createGrades()},selectAllCheckboxes:function(a){a=a||window.event;var b=a.target||a.srcElement,c=$(b).closest("fieldset").find('[type~="checkbox"]');1==b.checked?_.each(c,function(a){a.checked=!0}):_.each(c,function(a){a.checked=!1})},toggleLessonList:function(a){a=a||window.event;var b=a.target||a.srcElement;b=$(b).closest("li"),$(b).find("ul").toggle()},submitForm:function(){var a=this,b=[],d=this.$el.find(".choose-group-input:checked");return _.each(d,function(a){var c={grade:$(a).attr("data-grade"),display_type:$(a).attr("data-type"),name:$(a).attr("name")};b.push(c)}),0===b.length?(alert(c.alert.chooseWordGroup),!1):void this.user.save({selectOptions:b},{wait:!0,type:"PUT",success:function(b,c){a.goTo("/home")},error:function(b,c){console.log(c),a.goTo("/fieldset"),window.location.reload()}})},valuesToArray:function(a){var b=this.collection;return this.sortOrder(_.uniq(_.pluck(b,a)))},getLessons:function(a,b){var c=_.where(this.collection,{grade:a}),d=this.sortOrder(_.uniq(_.pluck(c,b)));return d.sort()},sortOrder:function(a){return a.sort(function(a,b){return"number"==typeof a?a-b:a>b})},appendHeader:function(){var a=new i;this.$el.prepend(a.render().el),this.childViews.push(a)},onClose:function(){var a=this.childViews;_.each(a,function(a){a.close()})}});return j});