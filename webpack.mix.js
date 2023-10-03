const mix = require('laravel-mix');
mix.disableNotifications();
/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */
mix.sass('resources/sass/app.scss','public/css/style.css')

mix.styles([
    'public/assets/css/bootstrap.min.css',
    'public/assets/plugins/simplebar/css/simplebar.css',
    'public/assets/plugins/perfect-scrollbar/css/perfect-scrollbar.css',
    'public/assets/plugins/metismenu/css/metisMenu.min.css',
    'public/assets/css/icons.css',
    'public/assets/css/animate.css',
    'public/assets/css/app.css',
    'public/assets/tailwind/output.css',
    'public/css/style.css',
], 'public/css/app.css');

mix.js([
    'resources/js/app.js',
    'resources/js/custom.js',
    
    'public/assets/js/bootstrap.bundle.min.js',
    'public/assets/plugins/simplebar/js/simplebar.min.js',
], 'public/js/app.js').react()

if (mix.inProduction()) {
    mix.version();
}