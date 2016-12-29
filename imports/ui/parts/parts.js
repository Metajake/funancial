import { Template } from 'meteor/templating';
import { Amounts } from '../../api/amounts.js';
import { Transactions } from '../../api/amounts.js';
import './parts.html';

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
    monthlyCategories() {
        let currentMonth = moment().format('YYYY MM');
        let categories = Amounts.find({type:'category'});
        let catSpend = {};
        categories.forEach(function(category){
            catSpend[category.name] = [];
            let catMonthlySpends = Transactions.find({month: currentMonth, transacted: category.name});
            catMonthlySpends.forEach(function(catMonthlySpend){
                catSpend[category.name].push(catMonthlySpend.cardAmount);
            })
        });
        // log(catSpend);
        let thisMonthSpendings = Transactions.find({month: currentMonth, type: 'category'});
        return thisMonthSpendings
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
    'click .cat'(event){
        let currentMonth = moment().format('YYYY MM');
        let categories = Amounts.find({type:'category'});
        let catSpend = {};
        categories.forEach(function(category){
            catSpend[category.name] = [];
            let catMonthlySpends = Transactions.find({month: currentMonth, transacted: category.name});
            catMonthlySpends.forEach(function(catMonthlySpend){
                catSpend[category.name].push(catMonthlySpend.cardAmount);
            })
        });
        let currentMonthAmounts = [
            ['Category','Amount']
        ];
        for (cat in catSpend){
            currentMonthAmounts.push([
                cat,
                catSpend[cat].reduce((a, b) => a + b, 0)
            ]);
        };
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(function(){drawChart( new google.visualization.PieChart(document.getElementById('monthly-expense-chart')), currentMonthAmounts )});
    },
    'click .delete'() {
        Amounts.remove(this._id);
    },

});

Template.transactions.helpers({
    transactions() {
        const transactions = Transactions.find({}, { sort: { createdOn: -1 } });
        return transactions
    },
});

Template.transactions.events({
    'click .delete'() {
        Transactions.remove(this._id);
    },
});

Template.save.helpers({ //IS THIS USED?
    goals() {
        const goals = Amounts.find({type:'goal'});
        return goals
    },
});

Template.spend.helpers({ //IS THIS USED?
    categories(){
        const categories = Amounts.find({type: 'category' });
        return categories
    }
});

Template.records.helpers({
    records() {
        const records = [{type:"monthy", date: "010101"}]   ;
        return records;
    }
});