// creating modles give us some kind of infrastructure to our data base
// as no-sql databases like mongoDB there is not much structure,
//  its very flexible which can be a greate thing but downfall as well  as our data is not structured at all
// mongoose  fives us ability to structure it on application level, rather then on a data level as we do in mySQL

const MONGOOSE = require("mongoose");


// user schema
let adminSchema = MONGOOSE.Schema({
      name: {
            type: String,
            required: true,
      },
      username: {
            type: String,
            required: true,
      },
      password: {
            type: String,
            required: true,
      },
      email: {
            type: String,
            require: true,
      }
});

let AdminModel = MONGOOSE.model('admins', adminSchema);
module.exports = AdminModel;