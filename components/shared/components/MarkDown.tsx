import React from "react";
import ReactMarkdown from "react-markdown";

type MarkdownProps = {
  passage: string;
  className?: string; // Container class
};

const Markdown: React.FC<MarkdownProps> = ({ passage, className = "" }) => {
  return (
    <div className={className}>
      <ReactMarkdown
        components={{
          p: ({ node, ...props }) => <p className="mb-2" {...props} />,
          h1: ({ node, ...props }) => (
            <h1 className="text-xl font-bold my-2" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-lg font-semibold my-1" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="ml-4 list-disc" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-bold" {...props} />
          ),
          em: ({ node, ...props }) => <em className="italic" {...props} />,
        }}
      >
        {passage}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;
