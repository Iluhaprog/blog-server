type TagsId = number[];

export class UpdatePostDto {
  id: number;
  title: string;
  text: string;
  preview: string;
  tags: TagsId;
}
