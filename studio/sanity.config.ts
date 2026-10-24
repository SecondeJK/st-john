import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

const singletons = ['siteSettings', 'homePage']

export default defineConfig({
  name: 'default',
  title: 'St John the Baptist, Halesowen',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem().title('Site settings').id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.listItem().title('Home page').id('homePage')
              .child(S.document().schemaType('homePage').documentId('homePage')),
            S.divider(),
            S.documentTypeListItem('page').title('Pages'),
            S.documentTypeListItem('post').title('Blog posts'),
            S.documentTypeListItem('tag').title('Tags'),
            S.divider(),
            S.documentTypeListItem('person').title('Staff and leadership'),
            S.documentTypeListItem('church').title('Our churches'),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    // Singletons can't be created from the "new document" menu.
    templates: (templates) => templates.filter(({schemaType}) => !singletons.includes(schemaType)),
  },
})
