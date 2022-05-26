import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    id: String,

})

export default mongoose.model('Session', sessionSchema)


