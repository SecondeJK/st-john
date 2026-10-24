import {defineField, defineType} from 'sanity'

export const church = defineType({
  name: 'church',
  title: 'Church',
  type: 'document',
  fields: [
    defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'place', type: 'string'}),
    defineField({name: 'summary', type: 'string'}),
    defineField({name: 'link', type: 'string', description: 'Internal path (/our-churches/st-johns/) or A Church Near You URL'}),
    defineField({name: 'image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'order', type: 'number'}),
  ],
  preview: {select: {title: 'name', subtitle: 'place', media: 'image'}},
})
