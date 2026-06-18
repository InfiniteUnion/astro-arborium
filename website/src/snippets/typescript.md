```typescript
export type Language = "rust" | "typescript" | "bash" | "yaml";

export interface Highlighter<T = string> {
  readonly language: Language;
  highlight(source: T): Promise<Highlighted<T>>;
}

export class ArboriumHighlighter implements Highlighter {
  constructor(public readonly language: Language) {}

  async highlight(source: string): Promise<Highlighted<string>> {
    if (!source.trim()) {
      throw new Error(`Empty ${this.language} source`);
    }
    return {
      language: this.language,
      html: await render(`Hello, ${this.language}!`),
    };
  }
}

type Highlighted<T> = { language: Language; html: T };

async function render(text: string): Promise<string> {
  return `<span>${text}</span>`;
}
```
