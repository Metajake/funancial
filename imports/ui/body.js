import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Amounts } from '../api/amounts.js';
import { Transactions } from '../api/amounts.js';
import './body.html';
import { drawChart } from './charts.js';

function log(toLog){
    console.log(toLog);
}

Template.body.onCreated( function(){
    this.currentTemplate = new ReactiveVar("amount_card");
});

Template.body.helpers({
    page: function(){
        return Template.instance().currentTemplate.get();
    },
});

Template.body.events({
    'change #nav'(event, template){
        const templateSelection = event.target.value;
        template.currentTemplate.set( templateSelection );
    },
    'click .delete'() {
        Amounts.remove(this._id);
    }
});


Template.amount_card.onCreated( function(){
    this.isSavings = new ReactiveVar(false);
});

Template.amount_card.helpers({
    isSavings: function(){
        return Template.instance().isSavings.get();
    },
    goals() {
        const goals = Amounts.find({type:'goal'});
        return goals
    },
});

Template.amount_card.events({
    'change #amount-type'(event, template){
        if(event.target.options[event.target.selectedIndex].value == 'save'){
            template.isSavings.set(true);
        }else{template.isSavings.set(false)}
    },
    'submit .new-amount'(event){
        event.preventDefault();
        const target = event.target;
        const amount = target.amount.value;
        const name = target.name.value;
        const type = target.type.value;
        const transacted = target.transacted.value;

        Transactions.insert({
            amount,
            name,
            type,
            transacted,
            createdAt: new Date(),
        });

        target.amount.value = '';
        target.type.value = '';
        target.name.value = '';
    },
});

Template.goals.helpers({
    goals() {
        const goals = Amounts.find({type:'goal'});
        return goals
    },
});
Template.goals.rendered = function(){
    const inputs = Transactions.find({type:'savings'});
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
};

Template.goals.events({
    'submit .new-goal'(event){
        log("evented")
        event.preventDefault();
        const target = event.target;
        const amount = target.amount.value;
        const name = target.name.value;
        const type = "goal";

        Amounts.insert({
            amount,
            name,
            type,
            createdAt: new Date(),
        });

        target.amount.value = '';
        target.name.value = '';
    },
});

Template.accounts.helpers({
    accounts() {
        return Amounts.find({type:'account'});
    },
});

Template.accounts.events({
    'submit .new-account'(event){
        log("evented")
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
});

Template.transactions.helpers({
    transactions() {
        const transactions = Transactions.find({});
        return transactions
    },
});

