// ── Formatting Utilities ────────────────────────────────────────

export function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toString();
}

export function getLanguageColor(lang: string): string {
  const colors: Record<string, string> = {
    'JavaScript': '#f7df1e', 'TypeScript': '#3178c6', 'Python': '#3776ab',
    'Rust': '#dea584', 'Go': '#00add8', 'Svelte': '#ff3e00', 'React': '#61dafb',
    'C++': '#f34b7d', 'Java': '#b07219', 'Ruby': '#cc342d', 'PHP': '#777bb4',
    'Swift': '#fa7343', 'Kotlin': '#a97bff', 'C#': '#178600', 'HTML': '#e34c26',
    'CSS': '#563d7c', 'PyTorch': '#ee4c2c', 'WebAssembly': '#654ff0',
    'Linux': '#fcc624', 'Zig': '#f7a41d', 'Three.js': '#000000', 'Figma': '#f24e1e',
    'TensorFlow': '#ff6f00', 'Kubernetes': '#326ce5', 'Redis': '#dc382d',
    'PostgreSQL': '#4169e1', 'Docker': '#2496ed', 'gRPC': '#244c5a',
    'Terraform': '#623ce4',
  };
  return colors[lang] || '#6c5ce7';
}

// ── Simple Syntax Highlighter ──────────────────────────────────

export function highlightCode(code: string, language: string): string {
  let html = escapeHtml(code);

  // Comments
  html = html.replace(/(\/\/.*$|#.*$)/gm, '<span class="syntax-comment">$1</span>');
  html = html.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="syntax-comment">$1</span>');
  html = html.replace(/("""[\s\S]*?""")/g, '<span class="syntax-comment">$1</span>');

  // Strings
  html = html.replace(/(&quot;.*?&quot;|&#39;.*?&#39;|`[^`]*`)/g, '<span class="syntax-string">$1</span>');

  // Keywords
  const keywords = ['import', 'export', 'from', 'const', 'let', 'var', 'function', 'return',
    'if', 'else', 'for', 'while', 'class', 'extends', 'new', 'this', 'super', 'async',
    'await', 'try', 'catch', 'throw', 'typeof', 'instanceof', 'interface', 'type', 'enum',
    'pub', 'fn', 'impl', 'struct', 'use', 'mod', 'self', 'Self', 'mut', 'match',
    'def', 'pass', 'None', 'True', 'False', 'with', 'as', 'lambda', 'yield',
    'func', 'package', 'go', 'defer', 'chan', 'select', 'case', 'default',
    'public', 'private', 'protected', 'static', 'final', 'abstract', 'override'];
  const kwRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
  html = html.replace(kwRegex, '<span class="syntax-keyword">$1</span>');

  // Types / Classes
  const types = ['string', 'number', 'boolean', 'void', 'any', 'never', 'unknown',
    'String', 'HashMap', 'Vec', 'Option', 'Result', 'Arc', 'RwLock',
    'int', 'float', 'bool', 'i32', 'u64', 'usize', 'f64',
    'Module', 'Tensor', 'Sequential', 'Linear', 'Embedding', 'Dropout',
    'Server', 'Router', 'Duration', 'Context'];
  const typeRegex = new RegExp(`\\b(${types.join('|')})\\b`, 'g');
  html = html.replace(typeRegex, '<span class="syntax-type">$1</span>');

  // Numbers
  html = html.replace(/\b(\d+\.?\d*)\b/g, '<span class="syntax-number">$1</span>');

  // Decorators / attributes
  html = html.replace(/(@\w+|#\[[\w:]+\])/g, '<span class="syntax-decorator">$1</span>');

  return html;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
