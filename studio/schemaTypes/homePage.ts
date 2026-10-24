import {defineArrayMember, defineField, defineType} from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  fields: [
    defineField({name: 'heading', type: 'string', initialValue: 'Welcome to St John the Baptist Church'}),
    defineField({name: 'subheading', type: 'string', initialValue: 'Serving Halesowen for over 1000 years'}),
    defineField({name: 'intro', type: 'text', rows: 3}),
    defineField({
      name: 'slides',
      title: 'Carousel images',
      type: 'array',
      of: [defineArrayMember({type: 'image', options: {hotspot: true}, fields: [defineField({name: 'alt', type: 'string', validation: (r) => r.required()})]})],
      validation: (r) => r.min(1).max(5),
    }),
    defineField({
      name: 'blocks',
      title: 'Link blocks',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', type: 'string'}),
            defineField({name: 'text', type: 'text', rows: 2}),
            defineField({name: 'link', type: 'string', description: 'e.g. /blog/'}),
            defineField({name: 'image', type: 'image', options: {hotspot: true}}),
          ],
        }),
      ],
      validation: (r) => r.max(3),
    }),
  ],
})
