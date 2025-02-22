import mongoose, { Schema } from "mongoose";

const channelSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
    ],
    admin: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    messages: [
        {
            type: Schema.Types.ObjectId,
            ref: "Message",
            required: false,
        }
    ]
}, {timestamps: true})

channelSchema.pre("save", function(next){
    this.updatedAt = Date.now();
    next();
})

channelSchema.pre("findOneAndUpdate", function(next){
    this.set({updatedAt: Date.now()});
    next();
})

export const Channel = mongoose.model("Channel", channelSchema)