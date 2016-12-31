import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import { Amounts } from '../api/amounts.js';
import { Transactions } from '../api/amounts.js';
import { Dates } from '../api/amounts.js';
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
    },
});


Template.transaction_card.onCreated( function(){
    Session.setDefaultPersistent("currentTransactionId", "income");
    this.transactionCategory = new ReactiveVar(Session.get("currentTransactionId"));
});

Template.transaction_card.rendered = function(){
    $('#amount-type').val(Template.instance().transactionCategory.get());
},

Template.transaction_card.helpers({
    category: function(){
        return Template.instance().transactionCategory.get();
    },
});

Template.transaction_card.events({
    'change #amount-type'(event, template){
        // template.transactionCategory.set(event.target.options[event.target.selectedIndex].value);
        const transactionSelection = event.target.value;
        Session.update("currentTransactionId", transactionSelection);
        template.transactionCategory.set( transactionSelection );
    },
    'submit .new-amount'(event, template){
        event.preventDefault();
        let transacted, effector;
        const target = event.target;
        const cardAmount = Number(target.amount.value);
        const type = target.type.value;
        const note = target.note.value;
        if(type == 'save' || type == 'spend' || type == 'bills'){
            transacted = target.transacted.value;
            effector = Amounts.find({name:transacted});
            if(effector.count() > 1){
                log("Reduce your Query count to 1");
            }else{
                if(type == 'save') {
                    setEffected(effector, 'total', cardAmount);
                }else if(type == 'spend'){
                    setEffected(effector, 'currentTotal', cardAmount);
                }
            }
            // target.transacted.value = '';
        }
        Transactions.insert({
            cardAmount,
            type,
            note,
            transacted,
            createdOn: new Date(),
            month: moment().format("YYYY MM"), // I DONT THINK WE NEED THESE 12/30/16
            // calendarDay: moment().format("YYYY-MM-DD"),
            // GCDay: moment().format("MM/DD/YY"),
            // week: moment().format("WW"),
        });
        target.amount.value = '';
        target.note.value = '';
        // target.type.value = template.transactionCategory.get();
        // template.transactionCategory.set('');
        // log(template.transactionCategory.get())
    },
});

Template.goals.rendered = function(){
    let transactions = Transactions.find({type:'save'});
    let goalEvents = [];
    transactions.forEach(function(transaction){
        goalEvents.push({title : transaction.transacted, start : transaction.createdOn})
    });
    Meteor.setTimeout(function(){
        $('#goal-calendar').fullCalendar({
            events: goalEvents,
            displayEventTime: false,
        });
    }, 350);
};

Template.goals.helpers({
    goals() {
        const goals = Amounts.find({type:'goal'});
        return goals
    },
});

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
            createdOn: new Date(),
            // month: moment().format("YYYY MM"), //I DONT THING WE NEED THESE 12/30/16
            // week: moment().format("WW"),
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
                input.createdOn.toLocaleDateString(),
                input.cardAmount
            ]);
        });
        log(dates);
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(function(){ drawChart("Amount saved over time...", new google.visualization.ColumnChart(document.getElementById('chart')), dates )});
    },
    'click .delete'() {
        Amounts.remove(this._id);
    }
});

Template.regularexpenses.onCreated( function() {
});

Template.regularexpenses.rendered = function(){
    let month, year;
    Meteor.setTimeout(function(){
        $('#monthlyexpenses').fullCalendar({
            events: getMonthlyDates('bill'),
            displayEventTime: false,
            viewRender: function(){
                // log("calendar view rendered");
            },
        });
        $(document).keydown(function(e) {
            switch(e.which) {
                case 37: // left
                    $('#monthlyexpenses').fullCalendar('prev');
                    year = $('#monthlyexpenses').fullCalendar('getDate').format("YYYY");
                    month = $('#monthlyexpenses').fullCalendar('getDate').format("MM");
                    rerenderCalendar('#monthlyexpenses', getMonthlyDates('bill', {year:year,month:month}));
                    break;

                case 39: // right
                    $('#monthlyexpenses').fullCalendar('next');
                    year = $('#monthlyexpenses').fullCalendar('getDate').format("YYYY");
                    month = $('#monthlyexpenses').fullCalendar('getDate').format("MM");
                    rerenderCalendar('#monthlyexpenses', getMonthlyDates('bill', {year:year,month:month}));
                    break;

                default: return; // exit this handler for other keys
            }
            e.preventDefault(); // prevent the default action (scroll / move caret)
        });
    }, 300);
    $('#reoccurring').click(function(){
        if(document.getElementById('reoccurring').checked){
            $("#bill-date").attr('type', 'number');
        }else{
            $("#bill-date").attr('type', 'date');
        }
    });
};

Template.regularexpenses.helpers({
    dates(){
        let dates = Amounts.find({type: 'bill'}, {sort: { date: 1 } } );
        return dates
    },
});

Template.regularexpenses.events({
    'submit .new-date'(event, template){
        event.preventDefault();
        const name = event.target.name.value;
        const date = event.target.date.value;
        const amount = event.target.amount.value;
        const type = 'bill';
        const reoccurring = event.target.reoccurring.checked;

        Amounts.insert({
            name,
            date,
            type,
            amount,
            reoccurring,
        });

        event.target.amount.value = '';
        event.target.name.value = '';
        event.target.date.value = '';

        rerenderCalendar('#monthlyexpenses', getMonthlyDates('bill'));
    },
    'click .delete'() {
        Amounts.remove(this._id);
        rerenderCalendar('#monthlyexpenses', getMonthlyDates('bill'))
    },
});