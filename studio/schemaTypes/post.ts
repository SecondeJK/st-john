import {defineArrayMember, defineField, defineType} from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Blog post',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', type: 'slug', options: {source: 'title'}, validation: (r) => r.required()}),
    defineField({name: 'publishedAt', type: 'datetime', initialValue: () => new Date().toISOString(), validation: (r) => r.required()}),
    defineField({name: 'author', type: 'string'}),
    defineField({name: 'excerpt', type: 'text', rows: 2}),
    defineField({name: 'tags', type: 'array', of: [defineArrayMember({type: 'reference', to: [{type: 'tag'}]})]}),
    defineField({
      name: 'media',
      title: 'Media attachments',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [defineField({name: 'alt', type: 'string'}), defineField({name: 'caption', type: 'string'})],
        }),
        defineArrayMember({
          name: 'videoFile',
          title: 'Video file',
          type: 'object',
          fields: [
            defineField({name: 'file', type: 'file', options: {accept: 'video/*'}}),
            defineField({name: 'poster', type: 'image'}),
            defineField({name: 'alt', type: 'string'}),
            defineField({name: 'caption', type: 'string'}),
          ],
        }),
        defineArrayMember({
          name: 'youtube',
          title: 'YouTube video',
          type: 'object',
          fields: [
            defineField({name: 'videoId', title: 'Video ID', type: 'string', description: 'The part after v= in the YouTube URL'}),
            defineField({name: 'caption', type: 'string'}),
          ],
        }),
      ],
    }),
    defineField({name: 'body', type: 'text', rows: 20, description: 'Markdown'}),
  ],
  orderings: [{title: 'Newest first', name: 'publishedDesc', by: [{field: 'publishedAt', direction: 'desc'}]}],
  preview: {select: {title: 'title', subtitle: 'publishedAt', media: 'media.0'}},
})
