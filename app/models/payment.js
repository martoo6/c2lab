/**
 * Created by martin on 9/18/17.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
	txn_type: {type: String},
	subscr_id: {type: String},
	last_name: {type: String},
	residence_country: {type: String},
	mc_currency: {type: String},
	item_name: {type: String},
	business: {type: String},
	amount3: {type: Number},
	recurring: {type: String},
	verify_sign: {type: String},
	payer_status: {type: String},
	test_ipn: {type: String},
	payer_email: {type: String},
	first_name: {type: String},
	receiver_email: {type: String},
	payer_id: {type: String},
	reattempt: {type: String},
	recur_times: {type: String},
	subscr_date: {type: Date},
	btn_id: {type: String},
	custom: {type: String},
	charset: {type: String},
	notify_version: {type: String},
	period3: {type: String},
	mc_amount3: {type: Number},
	ipn_track_id: {type: String},

	user_id: {type: String}
},  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}})

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;