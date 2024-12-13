import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class ClientGoal {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  condition: string;

  @Prop({ type: String, required: true })
  category: string;

  @Prop({ type: String, required: false })
  details?: string;
}

export const ClientGoalSchema = SchemaFactory.createForClass(ClientGoal);

@Schema()
export class ClientItem {
  @Prop({ type: Types.ObjectId, ref: 'Barter', required: true })
  barter_id: Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  condition: string;

  @Prop({ type: String, required: true })
  category: string;
}

export const ClientItemSchema = SchemaFactory.createForClass(ClientItem);

@Schema()
export class Process {
  @Prop({ type: String, required: true })
  process_id: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'Barter', required: true })
  from_barter_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Barter', required: true })
  to_barter_id: Types.ObjectId;

  @Prop({ type: String, required: false })
  details?: string;
}

export const ProcessSchema = SchemaFactory.createForClass(Process);
