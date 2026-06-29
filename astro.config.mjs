import { defineConfig } from "astro/config";

function isExternalHref(href) {
  return /^https?:\/\//i.test(href);
}

function rehypeExternalLinks() {
  return (tree) => {
    function visit(node) {
      if (node?.type === "element" && node.tagName === "a") {
        const href = node.properties?.href;

        if (typeof href === "string" && isExternalHref(href)) {
          node.properties = {
            ...node.properties,
            target: "_blank",
            rel: "noopener noreferrer"
          };
        }
      }

      if (Array.isArray(node?.children)) {
        node.children.forEach(visit);
      }
    }

    visit(tree);
  };
}

const repository = process.env.GITHUB_REPOSITORY;
const [owner = "prechtru", repo = "kangas"] = repository?.split("/") ?? [];
const isUserSiteRepo = repo === `${owner}.github.io`;
const isGitHubActions = process.env.GITHUB_ACTIONS === "true";

export default defineConfig({
  site: `https://${owner}.github.io`,
  base: isGitHubActions && !isUserSiteRepo ? `/${repo}` : "/",
  markdown: {
    rehypePlugins: [rehypeExternalLinks]
  }
});
