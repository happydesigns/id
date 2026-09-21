import source from '../brand.studio.json'

export default defineAppConfig({
  id: {
    name: source.brand.name, theme: source.theme, assets: source.brand.assets,
  }, ui: source.theme.ui,
})
