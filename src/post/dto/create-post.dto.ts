type TagsId = number[];

export class CreatePostDto {
  title: string;
  text: string;
  preview: string;
  tags: TagsId;
}
