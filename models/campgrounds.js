const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
//virtual properties for mongoose schema - each image 

const ImageSchema = new Schema({
    url: String,
    filename: String
});
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_80')
})
const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    images: [ImageSchema ],
    geometry:{
        type:{
            type: String,
            enum: ['Point'],
            required: true
        },

        coordinates :{
            type: [Number],
            required: true
        }
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews : [ {
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
})

CampgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        })
    }
})

//campground is the collection name in the Mongo DB 
module.exports = mongoose.model('Campground',CampgroundSchema);

