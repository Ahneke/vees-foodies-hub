import { defineField, defineType } from 'sanity'

export const foodType = defineType({
  name: 'food',
  title: 'Food Menu',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Dish Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Soups', value: 'soups' },
          { title: 'Rice & Pasta', value: 'rice-pasta' },
          { title: 'Food Combos', value: 'combos' },
          { title: 'Lunch Packs', value: 'lunch' },
          { title: 'Stews', value: 'stews' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Dish Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
        name: 'isSpicy',
        title: 'Is it Spicy?',
        type: 'boolean',
        initialValue: false,
    }),
    
    // NEW: Fields for items that don't need size variants
    defineField({
      name: 'basePrice',
      title: 'Single Price',
      type: 'number',
      description: 'Use this if the meal only has one fixed price (like Lunch Packs).',
    }),
    defineField({
      name: 'baseStrikePrice',
      title: 'Single Strike Price (Optional)',
      type: 'number',
    }),

    defineField({
      name: 'variants',
      title: 'Sizes & Prices (For Litre Bowls)',
      type: 'array',
      description: 'Use this for soups or stews with different litre options.',
      of: [
        {
          type: 'object',
          fields: [
            { 
              name: 'size', 
              title: 'Size/Quantity', 
              type: 'string', 
              options: {
                list: [
                  { title: '1.5 Litre', value: '1.5 Litre' },
                  { title: '2.5 Litres', value: '2.5 Litres' },
                  { title: '3.5 Litres', value: '3.5 Litres' },
                  { title: '5 Litres', value: '5 Litres' },
                ],
              },
              validation: Rule => Rule.required() 
            },
            { name: 'price', title: 'Main Price', type: 'number', validation: Rule => Rule.required() },
            { name: 'strikePrice', title: 'Strike-through Price (Optional)', type: 'number' }
          ],
          preview: {
            select: {
              title: 'size',
              subtitle: 'price'
            },
            prepare(selection) {
              const {title, subtitle} = selection
              return {
                title: `${title}`,
                subtitle: subtitle ? `₦${subtitle.toLocaleString()}` : 'Price not set'
              }
            }
          }
        }
      ]
    }),
    defineField({
        name: 'moq',
        title: 'Minimum Order Quantity',
        type: 'number',
        description: 'Only for Lunch Packs'
      }),
  ],
})