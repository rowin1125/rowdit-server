import { Query, Resolver } from "type-graphql";

@Resolver()
export class HalloResolver {
  @Query(() => String)
  hello() {
    return "hello";
  }
}
