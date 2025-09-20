🚀 Development Setup

This theme uses Laravel Mix, Tailwind CSS, and Alpine.js to streamline development. Follow the steps below to set up your local dev environment.

1. Requirements

Node.js
 (LTS version recommended)

npm

2. Install Dependencies

Navigate to your theme root folder and run:

npm init -y
npm install laravel-mix --save-dev
npm install tailwindcss postcss autoprefixer --save-dev
npm install alpinejs

3. Configuration
Laravel Mix

Create a file named webpack.mix.js in the project root:

let mix = require('laravel-mix');

mix.js('src/js/app.js', 'assets')
   .sass('src/scss/app.scss', 'assets')
   .postCss('src/scss/app.css', 'assets', [
       require('tailwindcss')('./tailwind.config.js'),
   ]);

Tailwind CSS

Generate a Tailwind config:

npx tailwindcss init


Update tailwind.config.js to watch your theme files:

content: [
  './layout/**/*.liquid',
  './sections/**/*.liquid',
  './snippets/**/*.liquid',
  './templates/**/*.liquid',
  './templates/customers/**/*.liquid',
],

File Structure
src/
 ├── js/
 │   └── app.js
 └── scss/
     └── app.scss

4. Tailwind Directives

Inside src/scss/app.scss add:

@tailwind base;
@tailwind components;
@tailwind utilities;

5. Scripts

Update package.json with:

"scripts": {
  "dev": "npx mix",
  "watch": "npx mix watch",
  "prod": "npx mix --production"
}

6. Run

Start the watcher:

npm run watch


Compiled assets will be generated in /assets (app.css, app.js) and auto-updated when you edit source files.
