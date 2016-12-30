import { Mongo } from 'meteor/mongo';

export const Amounts = new Mongo.Collection('amounts');
export const Transactions = new Mongo.Collection('transactions');
export const Dates = new Mongo.Collection('dates');