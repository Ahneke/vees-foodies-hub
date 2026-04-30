import { type SchemaTypeDefinition } from 'sanity'
import { foodType } from './food'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [foodType],
}