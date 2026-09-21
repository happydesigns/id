import type { BrandDefinition } from './types.js'

export type BrandAdapter<
  TBrand extends BrandDefinition = BrandDefinition,
  TOptions = unknown,
  TOutput = unknown,
> = {
  readonly name: string
  readonly transform: (brand: TBrand, options: TOptions) => TOutput
}

type BrandAdapterShape = {
  readonly name: string
  readonly transform: (...args: never[]) => unknown
}

export function defineBrandAdapter<const TAdapter extends BrandAdapterShape>(adapter: TAdapter): TAdapter {
  if (!adapter.name.trim()) {
    throw new TypeError('Brand adapter names must not be empty')
  }
  return adapter
}
