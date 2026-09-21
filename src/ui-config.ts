type Config = Record<string, unknown>
const object = (value: unknown): value is Config => !!value && typeof value === 'object' && !Array.isArray(value)
export function copyConfig<T>(value: T): T {
  if (Array.isArray(value)) return value.map(copyConfig) as T
  if (object(value)) return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, copyConfig(item)])) as T
  return value
}
/** Remove only seed-owned declarations; retain explicit consumer overrides. */
export function replaceThemeUi(host: Config, seed: Config, draft: Config): Config {
  function without(base: Config, owned: Config): Config {
    const result = copyConfig(base)
    for (const key of Object.keys(owned)) {
      if (object(result[key]) && object(owned[key])) {
        result[key] = without(result[key], owned[key])
        if (!Object.keys(result[key] as Config).length) Reflect.deleteProperty(result, key)
      }
      else if (JSON.stringify(result[key]) === JSON.stringify(owned[key])) Reflect.deleteProperty(result, key)
    }
    return result
  }
  function merge(base: Config, extra: Config): Config {
    const result = copyConfig(base)
    for (const [key, value] of Object.entries(extra)) result[key] = object(value) && object(result[key]) ? merge(result[key], value) : copyConfig(value)
    return result
  }
  const result = merge(merge({ colors: { primary: 'green', secondary: 'blue', success: 'green', info: 'blue', warning: 'yellow', error: 'red', neutral: 'slate' } }, draft), without(host, seed))
  // An explicit icon choice must also replace Nuxt's host-provided defaults.
  if (object(draft.icons)) result.icons = merge(object(result.icons) ? result.icons : {}, draft.icons)
  return result
}
