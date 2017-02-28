var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var intlSchema = new Schema({
  ko: {
    type: String
  },
  en: {
    type: String
  }
});

var transportSchema = new Schema({
  bus: Schema.Types.Mixed,
  subway: Schema.Types.Mixed
});

var ProfileSchema = new Schema({
  groom: Schema.Types.Mixed,
  bride: Schema.Types.Mixed
});

var InfoSchema = new Schema({
  address: intlSchema,
  place: intlSchema,
  transportation: transportSchema,
  date: {
    type: String
  },
  time: {
    type: String
  },
  profiles: ProfileSchema,
  comment: intlSchema,
  created_at: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('info' , InfoSchema);
