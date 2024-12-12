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

}

export const BarterSchema = SchemaFactory.createForClass(Barter);
