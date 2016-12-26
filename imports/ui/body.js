import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import { Amounts } from '../api/amounts.js';
import { Transactions } from '../api/amounts.js';
// import { drawChart } from './charts.js';
import './body.html';
import './parts/parts.js';

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
    }
});


Template.transaction_card.onCreated( function(){
    this.isSavings = new ReactiveVar(false);
    this.isSpend = new ReactiveVar(false);
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
        let transacted;
        const target = event.target;
        const cardAmount = Number(target.amount.value);
        const type = target.type.value;
        log(type);
        if(type == 'save'){

            transacted = target.transacted.value;

            let saveGoals = Amounts.find({name:transacted});
            if(saveGoals.count() > 1){
                log("Reduce your Query count to 1");
            }else{
                saveGoals.forEach(function(goal){
                    Amounts.update(goal._id, {
                        $set: {total : goal.total += cardAmount }
                    });
                });
            }
        }else if(type == 'spend'){

            transacted = target.transacted.value;

            let spendCat = Amounts.find({name:transacted});
            if(spendCat.count() > 1){
                log("Reduce your Query count to 1 (shouldn't happen as long as names are unique");
            }else{
                spendCat.forEach(function(cat){
                    Amounts.update(cat._id, {
                        $set: {currentTotal : cat.currentTotal += cardAmount }
                    });
                });
            }
        };

        Transactions.insert({
            cardAmount,
            type,
            transacted,
            createdAt: new Date(),
        });

        target.amount.value = '';
        target.type.value = '';
        template.transactionCategory.set('');
        target.transacted.value = '';
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
