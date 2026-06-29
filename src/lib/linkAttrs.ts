export function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

export function externalLinkAttrs(href: string) {
  return isExternalHref(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};
}
