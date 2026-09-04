import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

function isExternalHref(href) {
  return /^https?:\/\//i.test(href);
}

function isDownloadHref(href) {
  return /\.(?:pdf|docx?|xlsx?|csv|pptx?)(?:[?#].*)?$/i.test(href);
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

function visitNodes(tree, callback) {
  function visit(node) {
    callback(node);

    if (Array.isArray(node?.children)) {
      node.children.forEach(visit);
    }
  }

  visit(tree);
}

function rehypeNewTabLinks() {
  return (tree) => {
    visitElements(tree, (node) => {
      if (node.tagName === "a") {
        const href = node.properties?.href;

        if (typeof href === "string" && (isExternalHref(href) || isDownloadHref(href))) {
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
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#|\?)/i.test(path) || !path.startsWith("/") || base === "/") {
    return path;
  }

  return `${base.replace(/\/$/, "")}${path}`;
}

function rehypeBasePaths(base) {
  return (tree) => {
    visitNodes(tree, (node) => {
      if (node?.type !== "raw" || typeof node.value !== "string") {
        return;
      }

      node.value = node.value.replace(/\b(href|src)=(["'])(\/(?!\/)[^"']*)\2/giu, (_match, property, quote, value) => {
        return `${property}=${quote}${withBasePath(value, base)}${quote}`;
      });
    });

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
const defaultSite = "https://www.nunawadingkangas.au";
const site = process.env.SITE ?? defaultSite;
const isGitHubPagesSite = site.endsWith(".github.io") || site.includes(".github.io/");
const normalizeBasePath = (basePath) => {
  if (!basePath || basePath === "/") {
    return "/";
  }

  return `/${basePath.replace(/^\/+|\/+$/gu, "")}`;
};
const base = normalizeBasePath(
  process.env.BASE_PATH ?? (isGitHubActions && isGitHubPagesSite && !isUserSiteRepo ? repo : "/")
);

export default defineConfig({
  site,
  base,
  integrations: [sitemap()],
  markdown: {
    rehypePlugins: [rehypeNewTabLinks, [rehypeBasePaths, base]]
  }
});
