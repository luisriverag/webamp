import { ID } from "grats";
import SkinModel from "../../../data/SkinModel";
import SkinResolver from "./SkinResolver";
import UserContext from "../../../data/UserContext.js";

/**
 * A globally unique object. The `id` here is intended only for use within
 * GraphQL.
 * https://graphql.org/learn/global-object-identification/
 *
 * @gqlInterface Node
 */
export interface NodeResolver {
  /**
   * @gqlField
   * @killsParentOnException
   */
  id(): ID;
  __typename: string;
}

export function toId(graphqlType: string, id: string) {
  return Buffer.from(`${graphqlType}__${id}`).toString("base64");
}

export function fromId(base64Id: string): { graphqlType: string; id: string } {
  const decoded = Buffer.from(base64Id, "base64").toString("ascii");
  const [graphqlType, id] = decoded.split("__");
  return { graphqlType, id };
}

/**
 * Get a globally unique object by its ID.
 *
 * https://graphql.org/learn/global-object-identification/
 * @gqlQueryField
 */
export async function node(
  id: ID,
  ctx: UserContext
): Promise<NodeResolver | null> {
  const { graphqlType, id: localId } = fromId(id);
  // TODO Use typeResolver
  switch (graphqlType) {
    case "ClassicSkin":
    case "ModernSkin": {
      const skin = await SkinModel.fromMd5(ctx, localId);
      if (skin == null) {
        return null;
      }
      return SkinResolver.fromModel(skin);
    }
  }
  return null;
}
