import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Amounts } from '../api/amounts.js';

import './body.html';

Template.body.onCreated( function(){
    this.currentTemplate = new ReactiveVar("amount_card");
});

Template.body.helpers({
    // page: function(){
    //     return Template.instance().currentTemplate.get();
    // }
});

Template.goals.helpers({
    goal_amounts() {
        return Amounts.find({});
    },
});

Template.body.events({
    'change #nav'(event, template){
        const templateSelection = event.target.value;
        template.currentTemplate.set( templateSelection );
    },
    'submit .new-amount'(event){
        event.preventDefault();
        const target = event.target;
        const amount = target.text.value;

        Amounts.insert({
            amount,
            createdAt: new Date(),
        });

        target.text.value = '';
    },
});