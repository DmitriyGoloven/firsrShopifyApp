
import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({

    id: String,

})



export default mongoose.model('Shop', shopSchema)
