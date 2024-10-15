// eslint-disable-next-line import/no-extraneous-dependencies
import { DiscussionEmbed } from "disqus-react";
import { BlogPost } from "@/types/contentful";

interface Props {
    post: BlogPost;
}

const DisqusComments = ({ post }: Props) => {
    const disqusShortname = "rodrigomendez-dev";
    const disqusConfig = {
        url: `https://rodrigomendez.dev/blog/${post?.fields.slug}`,
        identifier: post?.sys.id,
        title: post?.fields.title,
    };
    return (
        <div>
            <DiscussionEmbed
                shortname={disqusShortname}
                config={disqusConfig}
            />
        </div>
    );
};
export default DisqusComments;
