export const getAssetPath = (path: string): string => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }

  const envBasePath = process.env.NEXT_PUBLIC_BASE_PATH;
  const isProd = process.env.NODE_ENV === "production";
  const defaultBasePath = isProd ? "/32smilesdentalclinic" : "";
  const basePath = envBasePath !== undefined ? envBasePath : defaultBasePath;

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
