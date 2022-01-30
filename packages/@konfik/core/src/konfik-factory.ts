export interface KonfikFactoryProps<Brand extends PropertyKey, Blueprint> {
  brand: Brand
  toString(config: Blueprint): string
  // TODO: what else here?
}
type AnyKonfikFactoryProps = KonfikFactoryProps<PropertyKey, any>
// TODO: is this internally-managed state sinful?
const factoryPropsLookup = new Map<any, AnyKonfikFactoryProps>()

// TODO: allow additional constraints to be specified / produce generic factory.
// This would all ow us to support VSCode extension types.
// TODO: do we want to allow additional fields (like in package.json)? Make this configurable.
export const KonfikFactory = <Blueprint>() => {
  return <Brand extends PropertyKey>(factoryProps: KonfikFactoryProps<Brand, Blueprint>) => {
    return <Supplied extends Blueprint>(config: Supplied) => {
      factoryPropsLookup.set(config, factoryProps)
      // This way, we can spread configs into other configs.
      return config
    }
  }
}

export const getFactoryConfig = (supplied: unknown): AnyKonfikFactoryProps => {
  const factoryProps = factoryPropsLookup.get(supplied)
  if (!factoryProps) {
    throw new Error('TODO: throw this the effect-y way.')
  }
  return factoryProps
}
