import React from 'react';
import DOMPurify from 'dompurify';

const BlogContent = ({ content }) => {
    // Sanitize the HTML content
    const sanitizedContent = DOMPurify.sanitize(content || '', {
        ADD_TAGS: ['iframe'],
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
    });

    return <div className="blog-content" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
};

export default BlogContent;
