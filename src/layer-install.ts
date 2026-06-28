export const layerInstallPackageManagers = ['pnpm', 'npm', 'yarn', 'bun'] as const

export type LayerInstallPackageManager = typeof layerInstallPackageManagers[number]

export type LayerInstallOptions = {
  packageName: string
  layer?: string
  packageManager?: LayerInstallPackageManager
}

export type LayerInstallSnippets = {
  packageName: string
  layer: string
  packageManager: LayerInstallPackageManager
  installCommand: string
  nuxtConfig: string
}

export const layerInstallCommands: Record<LayerInstallPackageManager, string> = {
  pnpm: 'pnpm add',
  npm: 'npm install',
  yarn: 'yarn add',
  bun: 'bun add'
}

export function createLayerInstallSnippets(options: LayerInstallOptions): LayerInstallSnippets {
  const packageName = options.packageName.trim()

  if (!packageName) {
    throw new Error('Layer install packageName is required.')
  }

  const layer = options.layer?.trim() || packageName
  const packageManager = options.packageManager ?? 'pnpm'

  const installCommand = `${layerInstallCommands[packageManager]} ${packageName}`
  const nuxtConfig = `export default defineNuxtConfig({
  extends: ['${layer}']
})`

  return {
    packageName,
    layer,
    packageManager,
    installCommand,
    nuxtConfig
  }
}
