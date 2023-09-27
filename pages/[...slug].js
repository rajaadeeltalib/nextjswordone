import { gql } from "@apollo/client"
import client from "client"
import { cleanAndTransformBlocks } from "utils/cleanAndTransformBlocks";

export default function Page(props) {
    return <div>Page</div>
}

export const getStaticProps = async (context) => {
    const {data} = await client.query({
        query: gql`
        query NewQuery {
          nodeByUri(uri: "/") {
             ... on Page {
               id
               title
               blocksJSON
             }
           }
         }
        `,
      });
      const blocks = cleanAndTransformBlocks(data.nodeByUri.blocksJSON)
      return {
        props: {
          blocks,
          },
      };
}

export const getStaticPaths = async () => {
    const {data} = await client.query({
        query: gql`
        query AllPagesQuery {
            pages {
              nodes {
                uri
              }
            }
          }
        `,
    });

    return {
        paths: data.pages.nodes.map(page => ({
            params: {
                slug: page.uri.substring(1, page.uri.length - 1).split("/")
            },
        })),
        fallback: false,
    };
};