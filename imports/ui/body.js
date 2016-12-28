import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import { Amounts } from '../api/amounts.js';
import { Transactions } from '../api/amounts.js';
import './body.html';
import './parts/parts.js';

let currentFC = null;

Template.body.onCreated( function(){
    Session.setDefaultPersistent("currentPageId", "transaction_card");
    this.currentTemplate = new ReactiveVar(Session.get("currentPageId"));
});

Template.body.rendered = function(){
    $('#nav').val(Session.get("currentPageId"));
};

Template.body.helpers({
    page: function(){
        return Template.instance().currentTemplate.get();
    },
});

Template.body.events({
    'change #nav'(event, template){
        const templateSelection = event.target.value;
        Session.update("currentPageId", templateSelection);
        template.currentTemplate.set( templateSelection );
    },
});


Template.transaction_card.onCreated( function(){
    this.transactionCategory = new ReactiveVar("");
});

Template.transaction_card.helpers({
    category: function(){
        return Template.instance().transactionCategory.get();
    },
});

Template.transaction_card.events({
    'change #amount-type'(event, template){
        template.transactionCategory.set(event.target.options[event.target.selectedIndex].value);
    },
    'submit .new-amount'(event, template){
        event.preventDefault();
        let transacted, effector;
        const target = event.target;
        const cardAmount = Number(target.amount.value);
        const type = target.type.value;
        const note = target.note.value;
        if(type == 'save' || type == 'spend'){
            transacted = target.transacted.value;
            effector = Amounts.find({name:transacted});
            if(effector.count() > 1){
                log("Reduce your Query count to 1");
            }else{
                if(type == 'save') {
                    effector.forEach(function (effecting) {
                        Amounts.update(effecting._id, {
                            $set: {total: effecting.total += cardAmount}
                        });
                    });
                }else if(type == 'spend'){
                    effector.forEach(function(effecting){
                        Amounts.update(effecting._id, {
                            $set: {currentTotal : effecting.currentTotal += cardAmount }
                        });
                    });
                }
            }
            target.transacted.value = '';
        }
        Transactions.insert({
            cardAmount,
            type,
            note,
            transacted,
            createdAt: new Date(),
        });
        target.amount.value = '';
        target.note.value = '';
        target.type.value = '';
        template.transactionCategory.set('');
    },
});

Template.save.helpers({
    goals() {
        const goals = Amounts.find({type:'goal'});
        return goals
    },
});

Template.spend.helpers({
    categories(){
        const categories = Amounts.find({type: 'category' });
        return categories
    }
});
