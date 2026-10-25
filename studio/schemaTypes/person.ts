import {defineField, defineType} from 'sanity'

export const person = defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'role', type: 'string', description: 'Title, if any (e.g. Vicar & Team Leader)'}),
    defineField({name: 'bio', type: 'text', rows: 3}),
    defineField({name: 'email', type: 'string'}),
    defineField({name: 'photo', type: 'image', options: {hotspot: true}}),
    defineField({name: 'featured', type: 'boolean', description: 'Show on the About Us page', initialValue: false}),
    defineField({name: 'order', type: 'number'}),
  ],
  preview: {select: {title: 'name', subtitle: 'role', media: 'photo'}},
})
