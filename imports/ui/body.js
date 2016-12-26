import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import { Amounts } from '../api/amounts.js';
import { Transactions } from '../api/amounts.js';
import './body.html';
import { drawChart } from './charts.js';

function log(toLog){
    console.log(toLog);
}

Template.body.onCreated( function(){
    Session.setDefaultPersistent("currentPageId", "transaction_card");
    this.currentTemplate = new ReactiveVar(Session.get("currentPageId"));
});

Template.body.rendered = function(){
    $('#nav').val(Session.get("currentPageId"));
}

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

Template.goals.helpers({
    goals() {
        const goals = Amounts.find({type:'goal'});
        return goals
    },
    fcOptions: function(){
        return {
            dayClick: function(){
                // log("a day has been clicked!");
                // $('.fc').fullCalendar('next');
            },
            events: [
                {
                    title  : 'event1.5',
                    start  : '2016-12-25'
                },{
                    title  : 'event1',
                    start  : '2016-12-25'
                },
                {
                    title  : 'event2',
                    start  : '2016-12-22',
                    end    : '2016-12-23'
                },
                {
                    title  : 'event3',
                    start  : '2016-12-19T12:30:00',
                    allDay : false // will make the time show
                }
            ]
        }
    },
});

Template.goals.rendered = function(){

};

Template.goals.events({
    'submit .new-goal'(event){
        event.preventDefault();
        const target = event.target;
        const amount = target.amount.value;
        const name = target.name.value;
        const type = "goal";
        const total = 0;

        Amounts.insert({
            amount,
            name,
            type,
            total,
            createdAt: new Date(),
        });

        target.amount.value = '';
        target.name.value = '';
    },
    'click .item'(event){
        const inputs = Transactions.find({type:'save', transacted:this.name});
        dates = [
            ['Year','Amount']
        ];
        inputs.forEach(function(input){
            dates.push([
                input.createdAt.toLocaleDateString('en-US', {month: "2-digit", day: "2-digit", year: "2-digit"}),
                input.amount
            ]);
        });
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(function(){drawChart('chart_div',dates)});
    },
    'click .delete'() {
        Amounts.remove(this._id);
    }
});

Template.accounts.helpers({
    accounts() {
        return Amounts.find({type:'account'});
    },
});

Template.accounts.events({
    'submit .new-account'(event){
        event.preventDefault();
        const target = event.target;
        const amount = target.amount.value;
        const name = target.name.value;
        const type = "account";

        Amounts.insert({
            amount,
            name,
            type,
            createdAt: new Date(),
        });

        target.amount.value = '';
        target.name.value = '';
    },
    'click .delete'() {
        Amounts.remove(this._id);
    }
});

Template.categories.helpers({
    categories() {
        return Amounts.find({type:'category'});
    },
});

Template.categories.events({
    'submit .new-category'(event){
        event.preventDefault();
        const target = event.target;
        const name = target.name.value;
        const type = "category";
        const currentTotal = 0;

        Amounts.insert({
            name,
            type,
            currentTotal,
            createdAt: new Date(),
        });

        target.name.value = '';
    },
    'click .delete'() {
        Amounts.remove(this._id);
    }
});

Template.transactions.helpers({
    transactions() {
        const transactions = Transactions.find({}, { sort: { createdAt: -1 } });
        return transactions
    },
});

Template.transactions.events({
    'click .delete'() {
        Transactions.remove(this._id);
    },
})

