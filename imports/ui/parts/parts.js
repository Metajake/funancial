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
        const transactions = Transactions.find({}, { sort: { createdOn: -1 } });
        return transactions
    },
});

Template.transactions.events({
    'click .delete'() {
        Transactions.remove(this._id);
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

Template.records.helpers({
    CM(){
        (function(){let CY = moment().format("YYYY");
        let CM = moment().format("MM");
        log(CM);});
        return
    },
    records() {
        const records = [{type:"monthy", date: "010101"}]   ;
        return records;
    }
});