import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
    id: String,
    shop: String,
    scope: String,
    data: Object
})

export const SessionModel = mongoose.model('Session', SessionSchema)

 // Session {
 //   id: 'devitapp.myshopify.com_79627255973',
 //   shop: 'devitapp.myshopify.com',
 //   state: '669366661170612',
 //   isOnline: true,
 //   scope: 'write_products,write_customers,write_draft_orders',
 //   expires: 2022-05-27T06:30:17.517Z,
 //   accessToken: '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',
 //   onlineAccessInfo: {
 //         expires_in: 86398,
 //     associated_user_scope: 'write_products,write_customers,write_draft_orders',
 //     session: '1c9886bafde7a71c186e3eb4d2864c1d581f6d4d7774997f849ab6e7389383a3',
 //     account_number: 0,
 //     associated_user: {
 //               id: 79627255973,
 //       first_name: 'Dmitriy',
 //       last_name: 'Goloven',
 //       email: 'goloven.dmitriy@gmail.com',
 //       account_owner: true,
 //       locale: 'en-US',
 //       collaborator: false,
 //       email_verified: true
 //    }
 //   }
 // }

