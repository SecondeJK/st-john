import {defineArrayMember, defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'tagline', type: 'string'}),
    defineField({name: 'address', type: 'array', of: [defineArrayMember({type: 'string'})], description: 'One line per entry'}),
    defineField({name: 'phone', type: 'string'}),
    defineField({name: 'email', type: 'string'}),
    defineField({name: 'facebook', title: 'Facebook URL', type: 'url'}),
    defineField({name: 'mapQuery', title: 'Map search text', type: 'string', description: 'What to search for in the embedded Google map'}),
    defineField({
      name: 'serviceTimes',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'day', type: 'string'}),
            defineField({name: 'time', type: 'string'}),
            defineField({name: 'name', type: 'string'}),
          ],
          preview: {select: {title: 'name', day: 'day', time: 'time'}, prepare: ({title, day, time}) => ({title, subtitle: `${day} ${time}`})},
        }),
      ],
    }),
  ],
})
