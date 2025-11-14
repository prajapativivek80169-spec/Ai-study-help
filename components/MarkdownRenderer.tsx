
import React from 'react';
import Markdown from 'markdown-to-jsx';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <Markdown
      options={{
        forceBlock: true, // Treat every line as a block element
        overrides: {
          h1: { component: 'h1', props: { className: 'text-2xl font-bold mb-2' } },
          h2: { component: 'h2', props: { className: 'text-xl font-semibold mb-2' } },
          h3: { component: 'h3', props: { className: 'text-lg font-medium mb-1' } },
          p: { component: 'p', props: { className: 'mb-1 leading-relaxed' } },
          ul: { component: 'ul', props: { className: 'list-disc list-inside mb-1 pl-2' } },
          ol: { component: 'ol', props: { className: 'list-decimal list-inside mb-1 pl-2' } },
          li: { component: 'li', props: { className: 'mb-0.5' } },
          strong: { component: 'strong', props: { className: 'font-bold' } },
          em: { component: 'em', props: { className: 'italic' } },
          a: { component: 'a', props: { className: 'text-blue-600 hover:underline' } },
          pre: { component: 'pre', props: { className: 'bg-gray-800 text-white p-2 rounded-md overflow-x-auto text-sm my-2' } },
          code: { component: 'code', props: { className: 'bg-gray-200 text-gray-800 px-1 py-0.5 rounded text-sm' } },
          blockquote: { component: 'blockquote', props: { className: 'border-l-4 border-gray-300 pl-4 py-1 italic text-gray-700 my-2' } },
          hr: { component: 'hr', props: { className: 'my-4 border-t border-gray-300' } },
          table: { component: 'table', props: { className: 'min-w-full divide-y divide-gray-200 my-2' } },
          thead: { component: 'thead', props: { className: 'bg-gray-50' } },
          tbody: { component: 'tbody', props: { className: 'bg-white divide-y divide-gray-200' } },
          th: { component: 'th', props: { className: 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' } },
          td: { component: 'td', props: { className: 'px-4 py-2 whitespace-nowrap text-sm text-gray-900' } },
        },
      }}
    >
      {content}
    </Markdown>
  );
};

export default MarkdownRenderer;
