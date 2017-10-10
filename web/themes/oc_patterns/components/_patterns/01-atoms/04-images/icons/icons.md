---
title: Icons
---
### How to use icons

We are using a gulp SVG sprite generator, which automatically creates the SVG CSS in `_icon_sprite.scss`. Simply add separate SVG files into `theme_name/images/icons/src/` and they will be added to the sprite the next time `gulp icons` is run.  Sass Mixins and classes will be automagically generated in _icon_sprite.scss.
