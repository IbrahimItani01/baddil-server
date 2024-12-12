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

}

export const BarterSchema = SchemaFactory.createForClass(Barter);
