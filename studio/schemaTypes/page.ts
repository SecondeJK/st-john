import {defineArrayMember, defineField, defineType} from 'sanity'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'path',
      type: 'slug',
      description: 'URL path without slashes at either end, e.g. "about" or "about/staff"',
      validation: (r) => r.required().custom((v) => (!v?.current || /^[a-z0-9-]+(\/[a-z0-9-]+)*$/.test(v.current) ? true : 'Lowercase letters, numbers, - and / only')),
    }),
    defineField({
      name: 'layout',
      type: 'string',
      options: {
        list: [
          {title: 'Standard', value: ''},
          {title: 'About us', value: 'about'},
          {title: 'Staff list', value: 'staff'},
          {title: 'Contact', value: 'contact'},
          {title: 'Churches list', value: 'churches'},
          {title: 'Church', value: 'church'},
          {title: 'Events calendar', value: 'events'},
        ],
      },
    }),
    defineField({name: 'summary', type: 'string'}),
    defineField({name: 'heroImage', type: 'image', options: {hotspot: true}}),
    defineField({name: 'body', type: 'text', rows: 20, description: 'Markdown'}),
    defineField({
      name: 'gallery',
      type: 'array',
      of: [defineArrayMember({type: 'image', options: {hotspot: true}, fields: [defineField({name: 'alt', type: 'string'}), defineField({name: 'caption', type: 'string'})]})],
    }),
    defineField({name: 'weight', type: 'number', description: 'Sort order'}),
  ],
  preview: {select: {title: 'title', subtitle: 'path.current'}},
})
