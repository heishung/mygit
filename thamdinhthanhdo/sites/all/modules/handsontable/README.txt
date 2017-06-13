About
=====
Integrates Handsontable into Drupal.

About Handsontable
----------------

Latest version available at https://github.com/handsontable/handsontable

Handsontable is a data grid component with an Excel-like appearance. Built in JavaScript, it integrates with any data source with peak efficiency. It comes with powerful features like data validation, sorting, grouping, data binding, formula support or column ordering.

Installation
============

Dependencies
------------

- [Libraries API 2.x](http://drupal.org/project/libraries)
- [Handsontable](https://github.com/handsontable/handsontable)

Tasks
-----

1. Download the latest version of Handsontable from https://github.com/handsontable/handsontable
2. Unzip the file and rename the folder to "handsontable" (pay attention to the case of the letters)
3. Put the folder in a libraries directory
    - Ex: sites/all/libraries
4. The following minified files are required from the dist\ directory, you can delete the rest
    - handsontable.full.min.js
    - handsontable.full.min.css
5. Ensure you have a valid path similar to this one for the two files
    - Ex: sites/all/libraries/handsontable/handsontable.full.min.js

That's it!

Usage
======

To use, add a new field with the Handsontable type and widget.

Can be displayed as either a table or formatted JSON.