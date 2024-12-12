import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BarterDocument = Barter & Document;

@Schema({ timestamps: true })  
export class Barter {
  @Prop({
    type: String,
    enum: ['ongoing', 'completed', 'rejected'],
    default: 'ongoing',
    required: true,
  })
  status: 'ongoing' | 'completed' | 'rejected';

  @Prop({ type: [Types.ObjectId], ref: 'Item', required: true })
  initiator_items: Types.ObjectId[]; 

  @Prop({ type: [Types.ObjectId], ref: 'Item', required: true })
  receiver_items: Types.ObjectId[]; 

  @Prop({ type: Date, required: false })
  completed_at: Date; 

  @Prop({ type: Number, enum: [1, 2, 3, 4, 5], required: false })
  rating: 1 | 2 | 3 | 4 | 5; 

  @Prop({
    type: [
      {
        side: {
          type: String,
          enum: ['initiator', 'receiver'],
          required: true,
        },
        review_text: { type: String, required: true },
      },
    ],
    required: false,
  })
  reviews: { side: 'initiator' | 'receiver'; review_text: string }[]; 

  @Prop({
    type: {
      meetup_id: { type: Types.ObjectId, ref: 'Meetup', required: true },
      status: {
        type: String,
        enum: ['scheduled', 'ongoing', 'cancelled', 'success'],
        required: true,
      },
      location: { type: String, required: true },
      qr_code: { type: String, required: true }, 
      date: { type: Date, required: true }, 
    },
    required: false,
  })
  meetup: {
    meetup_id: Types.ObjectId; 
    status: 'scheduled' | 'ongoing' | 'cancelled' | 'success'; 
    location: string; 
    qr_code: string; 
    date: Date; 
  };
}

export const BarterSchema = SchemaFactory.createForClass(Barter);
