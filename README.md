WatchList
=========

A social to do list app for movies you want to watch.

Live demo http://watchlist.papio.com.au
Backup demo http://watchlist.meteor.com

File Organisation
==================================================

    /.meteor
        * Meteor system files, .git, packages, release info

    /client
        * All HTML templates and client-side JS
        * organised into directories as they appear visually in the browser
        /pages
            /add
                * "Add Movie" page files
            /list
                * "My List" page files
            /users
                * "Users" page files

        /shared
            * shared client HTML/JS, i.e., header, footer, nav, etc

        index.html
            * core HTML

        main.js
            * core JS

    /common
        * shared (client/server) JS

    /lib
        * generic helper functions

    /packages

    /server
        * server-side JS
