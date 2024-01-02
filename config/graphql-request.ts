import { GraphQLClient } from "graphql-request";

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;
const GRAPHQL_ENDPOINT_PIXWINGAI=process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT_PIXWINGAI;
if (typeof GRAPHQL_ENDPOINT === "undefined") {
  throw new Error("No GraphQL endpoint defined");
}
if(typeof GRAPHQL_ENDPOINT_PIXWINGAI=="undefined") {
  throw new Error("No GraphQL endpoint defined");
}
export const client = new GraphQLClient(GRAPHQL_ENDPOINT);
export const client2=new GraphQLClient(GRAPHQL_ENDPOINT_PIXWINGAI);
