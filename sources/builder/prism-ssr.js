import Prism from 'prismjs';
import loadLanguages from 'prismjs/components/index.js';

// Load required languages
loadLanguages(['pug']);

// Setup Jade alias
if (Prism.languages.pug && !Prism.languages.jade) {
  Prism.languages.jade = Prism.languages.pug;
}

// Custom Autolinker implementation including 'plain-text' support
const urlRegex = /\b([a-z]{3,7}:\/\/|tel:)[\w\-+%~/.:#=?&@!$'()*,;@]+/;
const emailRegex = /\b\S+@[\w.]+[a-z]{2}/;
const mdRegex = /\[([^\]]+)\]\(([^)]+)\)/;

Prism.plugins.autolinker = {
  processGrammar: function (grammar) {
    if (!grammar || grammar['url-link']) {
      return;
    }
    Prism.languages.DFS(grammar, function (key, def, type) {
      if (['comment', 'url', 'attr-value', 'string', 'plain-text'].indexOf(type) > -1 && !Array.isArray(def)) {
        if (!def.pattern) {
          def = this[key] = { pattern: def };
        }
        def.inside = def.inside || {};
        if (type === 'comment') {
          def.inside['md-link'] = mdRegex;
        }
        if (type === 'attr-value') {
          Prism.languages.insertBefore('inside', 'punctuation', { 'url-link': urlRegex }, def);
        } else {
          def.inside['url-link'] = urlRegex;
        }
        def.inside['email-link'] = emailRegex;
      }
    });
    grammar['url-link'] = urlRegex;
    grammar['email-link'] = emailRegex;
  }
};

Prism.hooks.add('before-highlight', function (env) {
  Prism.plugins.autolinker.processGrammar(env.grammar);
});

Prism.hooks.add('wrap', function (env) {
  if (/-link$/.test(env.type)) {
    env.tag = 'a';
    let href = env.content;
    if (env.type === 'email-link' && href.indexOf('mailto:') !== 0) {
      href = 'mailto:' + href;
    } else if (env.type === 'md-link') {
      const match = env.content.match(mdRegex);
      href = match[2];
      env.content = match[1];
    }
    env.attributes.href = href;
    env.attributes.target = '_blank';
    env.attributes.tabindex = '-1';
  }
});

export const highlightCode = (code, lang) => {
  const grammar = Prism.languages[lang];
  if (!grammar) {
    console.warn(`Prism grammar not found for language: ${lang}`);
    return code;
  }
  // Manually run autolinker grammar processing since before-highlight hook doesn't run in node
  if (Prism.plugins.autolinker) {
    Prism.plugins.autolinker.processGrammar(grammar);
  }
  return Prism.highlight(code, grammar, lang);
};
