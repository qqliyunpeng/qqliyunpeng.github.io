let renderSequence = 0;
let started = false;

export function getMermaidTheme(theme) {
  return theme === "dark" ? "dark" : "default";
}

export function getMermaidSource(source) {
  return source.replaceAll("\u007f", "\n").trim();
}

function markRenderError(code) {
  const pre = code.parentElement;
  if (!pre) return;
  pre.dataset.mermaidError = "true";
  pre.setAttribute("aria-label", "Mermaid 图表渲染失败，以下为原始代码");
}

export async function renderMermaidDiagrams() {
  if (started) return;

  const blocks = [
    ...document.querySelectorAll(
      'pre[data-language="mermaid"] > code, pre > code.language-mermaid'
    )
  ];
  if (blocks.length === 0) return;
  started = true;

  let mermaid;
  try {
    ({ default: mermaid } = await import("mermaid"));
  } catch {
    blocks.forEach(markRenderError);
    return;
  }

  const root = document.documentElement;
  const diagrams = new Map();

  const initialize = () => {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: getMermaidTheme(root.dataset.theme)
    });
  };

  const render = async (container, source) => {
    const id = `mermaid-diagram-${renderSequence++}`;
    const { svg, bindFunctions } = await mermaid.render(id, source);
    container.innerHTML = svg;
    bindFunctions?.(container);
  };

  initialize();
  for (const code of blocks) {
    const pre = code.parentElement;
    if (!pre) continue;

    const encodedSource = code
      .closest(".expressive-code")
      ?.querySelector("button[data-code]")?.dataset.code;
    const source = getMermaidSource(encodedSource || code.innerText || code.textContent || "");
    const container = document.createElement("div");
    container.className = "mermaid-diagram";

    try {
      await render(container, source);
      const host = pre.closest(".expressive-code") || pre;
      host.replaceWith(container);
      diagrams.set(container, source);
    } catch {
      markRenderError(code);
    }
  }

  let activeTheme = root.dataset.theme;
  const observer = new MutationObserver(async () => {
    if (root.dataset.theme === activeTheme) return;
    activeTheme = root.dataset.theme;
    initialize();

    for (const [container, source] of diagrams) {
      try {
        await render(container, source);
      } catch {}
    }
  });

  observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
}
