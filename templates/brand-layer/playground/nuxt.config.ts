import document from '../brand.studio.json'

export default defineNuxtConfig({ extends: ['..', '@happydesigns/id/studio'], css: ['~/app.css'], appConfig: { idStudio: { document } }, compatibilityDate: '2026-08-01' })
