import { Template } from 'meteor/templating';
import { Amounts } from '../../api/amounts.js';
import { Transactions } from '../../api/amounts.js';
import { Records } from '../../api/amounts.js';
import { drawChart } from '../charts.js';
import './parts.html';

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
                input.cardAmount
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
});

Template.records.helpers({
    records() {
        const records = Records.find({type:'monthly-record'});
        return records;
    }
});