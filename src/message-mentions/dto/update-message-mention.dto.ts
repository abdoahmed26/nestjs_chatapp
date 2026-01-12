import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageMentionDto } from './create-message-mention.dto';

export class UpdateMessageMentionDto extends PartialType(CreateMessageMentionDto) {}
