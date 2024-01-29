// eslint-disable-next-line import/no-extraneous-dependencies
import { Document } from "@contentful/rich-text-types";

export interface YoutubeVideo {
    fields: {
        title: string;
        description: string;
        image: {
            fields: {
                file: {
                    url: string;
                };
            };
        };
        url: string;
    };
    sys: {
        id: string;
    };
}

export interface BlogPost {
    fields: {
        title: string;
        description: string;
        slug: string;
        content: Document;
        cover: {
            fields: {
                file: {
                    url: string;
                };
            };
        };
        tags: string[];
        related: BlogPost[];
        video: YoutubeVideo;
    };
    sys: {
        id: string;
        createdAt: string;
    };
}
