

export function withCore <
  Source extends Record<string, any>
> (
  source: Source,
) {
  return {
    ...source,
    dependsOn: function (...dependencies: string[]) {
      for (const attr of dependencies) {
        if (!source[attr]) {
          throw new Error(`Attribute ${attr} not found in ${source}`)
        }
      }
    }
  };
}