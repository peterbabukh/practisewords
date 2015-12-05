define(["backbone","app/UserModel","i18n!../../js/nls/ru","underscore.string","text!../../templates/mainPage.html","text!../../templates/trTemplate.html","app/WordsCollection","app/AppHeaderView"],function(a,b,c,d,e,f,g,h){"use strict";var i=a.View.extend({el:$(".content-box"),template:_.template(e),events:{"click .select-displayorder":"selectOptions","click .select-lang":"selectOptions","click .select-check":"selectOptions","click .hint-button":"showHint","click .enter-button":"enterAnswer","keypress .input-field":"inputWord","click .show-wordlist-button":"showWordlistTable","click .hide-table-button":"hideWordlistTable"},initialize:function(){this.childViews=[],this.user=new b},render:function(){var a=this;return this.childViews.length&&this.onClose(),this.user.fetch({success:function(b,c,d){a.collection=new g(b.get("words").models),a.selectOptions=b.get("selectOptions")},error:function(b,d,e){alert(c.msg.systemErrorMessage),a.goTo("/"),window.location.reload()}}).done(function(){a.$el.html(a.template(c)),a.appendHeader(),a.resetSelection()}),this},proxyCollection:[],wordObject:null,wordIndex:0,values:{lang:"enWord",order:"alphabet"},resetSelection:function(){this.wordIndex=0,this.createProxyCollection(),this.createWordlistTable(),this.displayNextWord()},createProxyCollection:function(){var a=this,b=(this.values,this.selectOptions),c=[];0!=b?(_.each(b,function(b){var d,e=b.grade,f=b.display_type,g={};g.grade=isNaN(+e)?e:+e,g[f]=isNaN(+b.name)?b.name:+b.name,d=a.collection.where(g),d.length&&c.push(d)}),c=_.flatten(c)):_.each(a.collection.models,function(a){c.push(a)}),c=this.sortProxyCollection(c),this.proxyCollection=c},displayNextWord:function(){var a;this.wordIndex==this.proxyCollection.length&&(this.wordIndex=0),a=this.proxyCollection[this.wordIndex++],this.wordObject=this.parseGeneratedObject(a),$(".display-field").text(this.wordObject.displayWord)},parseGeneratedObject:function(a){var b=this.values,c="enWord"==b.lang?a.get("ruWord"):a.get("enWord"),e="enWord"==b.lang?a.get("ruSynonyms"):a.get("enSynonyms");return{displayWord:d.clean(a.get(b.lang)),answerWord:d.clean(c),synonyms:e}},sortProxyCollection:function(a){var b=this.values;switch(b.order){case"random":return _.shuffle(a);case"alphabet":return this.sortOrder(a,b.lang);case"reverse":return this.sortOrder(a,b.lang).reverse();default:return this.sortOrder(a,b.lang)}},sortOrder:function(a,b){return a.sort(function(a,c){return a.get(b)>c.get(b)?1:a.get(b)<c.get(b)?-1:0})},selectOptions:function(a){a=a||window.event;var b=a.target||a.srcElement;this.$el.find(".hint-word").css({display:"none"}),$(b).closest("select").find("option").attr("selected",!1),$(b).attr("selected",!0),this.findSelectedValues(),this.resetSelection()},findSelectedValues:function(){var a=this.$el.find("option.select-displayorder[selected]").val(),b=this.$el.find("option.select-lang[selected]").val();this.values={order:a,lang:b}},showHint:function(){var a=$(".wordlist-table-box");a.hasClass("visible")||null!=this.wordObject&&($(".input-text").text(c.msg.answerIs),$(".hint-word").text(this.wordObject.answerWord).css({display:"block"}),document.querySelector(".usedhints-count span").innerHTML++,document.querySelector(".nohints-count span").innerHTML--,$(".input-field").select().focus())},enterAnswer:function(){var a=$(".input-field").val().toLowerCase().trim();if(null==this.wordObject)return void alert(c.alert.chooseWordGroup);if(0==a&&this.wordObject)return void alert(c.alert.enterWordTranslation);if(this.checkAnswer()){var b=$(".wordlist-table-box"),d=$(".nohints-count span");document.querySelector(".rightanswer-count span").innerHTML++,b.hasClass("visible")||d.html(Number(d.html())+1),d.html()>0&&d.html()%10==0&&$("#celebrate-img").css({display:"inline"}),$(".input-text").html('<span class="right">'+c.msg.correct+"</span>"),$(".input-field").val(""),$("#rightanswer-img").css({display:"inline"}),this.displayNextWord()}else $(".input-text").html('<span class="wrong">'+c.msg.wrongAnswer+"</span>");$(".input-field").select().focus()},checkAnswer:function(){var a=$("option.select-check[selected]").val(),b=this.wordObject.answerWord,c=this.wordObject.synonyms;return"strict"==a?this.checkArray(b):this.checkArray(c)},checkArray:function(a){var b=a.split(","),c=d.clean($(".input-field").val().toLowerCase());return b.some(function(a){return d.clean(a.toLowerCase())==c})},inputWord:function(a){a=a||window.event,13===a.keyCode||13===a.which?$(".enter-button").click():a===a&&($(".input-text").html(""),$("#rightanswer-img").css({display:"none"}),$("#celebrate-img").css({display:"none"}),$(".hint-word").css({display:"none"}))},showWordlistTable:function(a){a.preventDefault();var b=$(".wordlist-table-box");if(!this.wordObject)return void alert(c.alert.chooseWordGroup);if(!b.hasClass("visible")){var d=confirm(c.conf.countersWillBeZero);d&&(document.querySelector(".nohints-count span").innerHTML=0,document.querySelector(".usedhints-count span").innerHTML=0,b.addClass("visible").slideDown())}},createWordlistTable:function(){var a,b,c;$(".wordlist-table").empty(),a=_.template(f),b=$("option.select-lang[selected]").val(),c=_.sortBy(this.proxyCollection,b),_.each(c,function(c){var d={};d.cellOne=c.get(b),d.synonyms="enWord"==b?c.get("ruSynonyms"):c.get("enSynonyms"),$(".wordlist-table").append(a(d))})},hideWordlistTable:function(){var a=$(".wordlist-table-box");a.removeClass("visible").slideUp()},appendHeader:function(){var a=new h;this.$el.prepend(a.render().el),this.childViews.push(a)},onClose:function(){var a=this.childViews;_.each(a,function(a){a.close()})}});return i});