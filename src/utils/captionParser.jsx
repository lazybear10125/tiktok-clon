import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Parses caption string and converts #hashtags and @mentions into clickable Links
 */
export function renderFormattedCaption(text, linkClassName = '') {
  if (!text) return null;

  // Split text by hashtags (#word) and mentions (@word)
  const tokens = text.split(/([#@][\w\d_.-]+)/g);

  return tokens.map((token, index) => {
    if (token.startsWith('#')) {
      return (
        <Link
          key={index}
          to={`/search?q=${encodeURIComponent(token)}`}
          className={linkClassName || 'caption-tag'}
          onClick={(e) => e.stopPropagation()}
        >
          {token}
        </Link>
      );
    }
    if (token.startsWith('@')) {
      const username = token.slice(1);
      return (
        <Link
          key={index}
          to={`/@${username}`}
          className={linkClassName || 'caption-mention'}
          onClick={(e) => e.stopPropagation()}
        >
          {token}
        </Link>
      );
    }
    return token;
  });
}
