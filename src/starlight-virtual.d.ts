// Starlight 只在内部文件 `virtual-internal.d.ts` 里声明了组件的 virtual 模块类型，
// 该文件没有对外导出，自定义 Header 覆盖时 TS 找不到模块。这里补齐本地声明，
// 保证组件仍然通过 virtual 模块解析，用户的组件覆盖（Search/ThemeSelect 等）依旧生效。
declare module "virtual:starlight/components/LanguageSelect" {
  const LanguageSelect: typeof import("@astrojs/starlight/components/LanguageSelect.astro").default;
  export default LanguageSelect;
}

declare module "virtual:starlight/components/Search" {
  const Search: typeof import("@astrojs/starlight/components/Search.astro").default;
  export default Search;
}

declare module "virtual:starlight/components/SiteTitle" {
  const SiteTitle: typeof import("@astrojs/starlight/components/SiteTitle.astro").default;
  export default SiteTitle;
}

declare module "virtual:starlight/components/SocialIcons" {
  const SocialIcons: typeof import("@astrojs/starlight/components/SocialIcons.astro").default;
  export default SocialIcons;
}

declare module "virtual:starlight/components/ThemeSelect" {
  const ThemeSelect: typeof import("@astrojs/starlight/components/ThemeSelect.astro").default;
  export default ThemeSelect;
}
