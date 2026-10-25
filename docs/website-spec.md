# St John the Baptist Church Website, Halesowen, England

## Agent Build Guidelines & Requirements

### What it is
A site for the Norman Church in the West Midlands of England. The core elements are the events calendar system and the blog, which needs to be filterable, taggable posts and media (video or images) attachments.

### How it's built

Hugo Golang Site that will use an appropriate cloud CMS for the blog. The events system with be with an external configured google calendar. The CMS needs to have a local development structure (content when running local will only be temporary test data)

A theme that is similar with requirements to this Church website, for look and feel: https://claineschurch.co.uk/

Developement and deployment services with .env files, live env vars for connectivity to the hosting platform, domain, google calendar credentials etc to have logic to parse the different environments.

### Site Taxonomy
- all pages need to be editable in the CMS.

Landing Page

About Us (this is a page in itself)
* Staff and Leadership
* Contact Us

Our Churches
* St John the Baptist, Halesowen (link to St John's Page)
* St Peter's Cradley (link to a church near you)
* St Peter's Lapal (link to a Church near you)
* St Margaret of Antioch, Hasbury (link to a church near you)
& St Kenelm's, Romsley (link to a church near you)

What's On
Events system (more details below)

Blog

Safeguarding
(placeholder page)

Accessibility
(info in assets/reference_documents/accessibility.docx, gallery view of images in assets/images/
accessibility-x.jpg)

Traidpoint Shop
(info in assets/reference_documents/traidpoint-info.docx)

Flower Ladies' Guild
(info in the assets/reference_documents/flower-guild.pdf, gallery view of images in assets/images/flower-guild-x.jpg)

Guiding Lights
(placeholder page about SEN parents support)

### Specific Page Requirements

### Landing Page 
carosel of three images
"Welcome to St John the Baptist Church
Serving Halesowen for over 1000 years" in text in the carosel

3 image link block
1. link to st john's page
2. link to blog
3. link to about us page

### About Us
Fetch some information from the wikipedia article, conclude with mission, SEN page links, vicar and leadership information and links. Location information, contact us.

### Staff And Leadership

Cards for each team member, plus their accompanying image in assets/images
* Revd Hazel Charlton, Vicar & Team Leader
* Revd Sarah Tranter
* Revd Chris Henson
* Revd Rachel Homer
* Mthr Victoria Barlow