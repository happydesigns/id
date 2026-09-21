import packageJson from '../package.json'
import document from '../brand.studio.json'

const bundledPackage = packageJson.dependencies['@happydesigns/id'].startsWith('file:')

export default defineNuxtConfig({
  extends: ['..', '@happydesigns/id/studio'],
  compatibilityDate: '2026-08-01',
  appConfig: {
    idStudio: {
      document,
      sourcePath: 'brand.studio.json',
      ...(bundledPackage ? { packageAsset: '/studio-packages/id.tgz' } : {})
    }
  }
})
