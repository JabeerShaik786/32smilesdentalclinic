export const getAssetPath = (path: string): string => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }

  // Root-relative by default for production domain (32smilesdentalclinic.com)
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  // Split query and hash if present
  const [baseAndQuery, ...hashParts] = path.split("#");
  const [pathname, ...searchParts] = baseAndQuery.split("?");
  const hashPart = hashParts.length > 0 ? `#${hashParts.join("#")}` : "";
  const searchPart = searchParts.length > 0 ? `?${searchParts.join("?")}` : "";

  const cleanPath = pathname.startsWith("/") ? pathname : `/${pathname}`;

  // If cleanPath already begins with basePath, return without double-prefixing
  if (basePath && (cleanPath === basePath || cleanPath.startsWith(`${basePath}/`))) {
    return `${cleanPath}${searchPart}${hashPart}`;
  }

  const encodedPath = cleanPath
    .split("/")
    .map((segment) => encodeURIComponent(decodeURIComponent(segment)))
    .join("/")
    .replace(/%2F/g, "/");

  return `${basePath}${encodedPath}${searchPart}${hashPart}`;
};
