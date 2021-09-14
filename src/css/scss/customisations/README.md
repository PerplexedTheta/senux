# README.md
If you want to customise Senux, DON'T modify the delivered content in 'src/css/scss/senux/*'.
Instead, add your customisations here and run 'dist/build-scss.sh'. The output will be delivered to 'dist/OPACUserCSS.css'

* customisations-pre.scss is for rules that don't matter too much, or will be supplimented
* customisations-main.scss is for most rules that will drive the compliled CSS file
* customisations-post.scss is for rules that are really important, or that should override stuff in -main or -pre
