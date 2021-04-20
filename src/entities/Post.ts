import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType, Int } from "type-graphql";

// Define this class is an entity in the Table
@ObjectType()
@Entity()
export class Post {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt: Date = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Field(() => String)
  @Property({ type: "text" })
  title!: string;
}
