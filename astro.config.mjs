import { defineConfig } from "astro/config";

function isExternalHref(href) {
  return /^https?:\/\//i.test(href);
}

function visitElements(tree, callback) {
  function visit(node) {
    if (node?.type === "element") {
      callback(node);
    }

    if (Array.isArray(node?.children)) {
      node.children.forEach(visit);
    }
  }

  visit(tree);
}

function rehypeExternalLinks() {
  return (tree) => {
    visitElements(tree, (node) => {
      if (node.tagName === "a") {
        const href = node.properties?.href;

        if (typeof href === "string" && isExternalHref(href)) {
          node.properties = {
            ...node.properties,
            target: "_blank",
            rel: "noopener noreferrer"
          };
        }
      }
    });
  };
}

function withBasePath(path, base) {
  if (!path.startsWith("/") || path.startsWith("//") || base === "/") {
    return path;
  }

  return `${base.replace(/\/$/, "")}${path}`;
}

function rehypeBasePaths(base) {
  return (tree) => {
    visitElements(tree, (node) => {
      ["href", "src"].forEach((property) => {
        const value = node.properties?.[property];

        if (typeof value === "string") {
          node.properties = {
            ...node.properties,
            [property]: withBasePath(value, base)
          };
        }
      });
    });
  };
}

const repository = process.env.GITHUB_REPOSITORY;
const [owner = "prechtru", repo = "kangas"] = repository?.split("/") ?? [];
const isUserSiteRepo = repo === `${owner}.github.io`;
const isGitHubActions = process.env.GITHUB_ACTIONS === "true";
const base = isGitHubActions && !isUserSiteRepo ? `/${repo}` : "/";

export default defineConfig({
  site: `https://${owner}.github.io`,
  base,
  markdown: {
    rehypePlugins: [rehypeExternalLinks, [rehypeBasePaths, base]]
  }
});
