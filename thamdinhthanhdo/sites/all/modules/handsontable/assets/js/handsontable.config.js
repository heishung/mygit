/**
 * @file
 * Main JavaScript file for the Handsontable module, which provides Drupal integration with the Handsontable JavaScript library.
 */

Drupal.behaviors.handsontable = {
    attach: function (context, settings) {

        function firstRowRenderer(instance, td, row, col, prop, value, cellProperties) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            td.style.fontWeight = 'bold';
            td.style.padding = '5px';
        }

        function checkIfEmpty(hot, data) {
            var noEmptyRows = false;
            jQuery.each(data, function(rowKey, object) {
                // If there's a row with data, it needs to be saved
                if(data.length > 1 && !hot.isEmptyRow(rowKey)) {
                    noEmptyRows = true;
                    return false
                }
            });
            return noEmptyRows;
        }

        function updateTable(table, container) {
            var hot = jQuery(table).data('handsontable');
            var data = hot.getData();

            if (checkIfEmpty(hot, data)) {
                jQuery(container).val(JSON.stringify(data));
            }else{
                jQuery(container).val(null);
            }
        }

        // Initiate handsontable and add constructor options.
        jQuery.each(Drupal.settings.handsontable.ids, function (i, val) {
            var container = '#' + val,
                table = container + '-table';

            jQuery(table).handsontable({
                data: JSON.parse(Drupal.settings.handsontable.data[i]),
                minRows: 1,
                minCols: 2,
                contextMenu: ['row_above', 'row_below', 'remove_row', 'remove_col', 'col_left', 'col_right', 'undo', 'redo'],
                colHeaders: true,
                manualColumnResize: true,
                manualRowResize: true,
                columnSorting: true,
                stretchH: 'all',
                cells: function (row, col, prop) {
                    var cellProperties = {};
                    if (row === 0) {
                        cellProperties.renderer = firstRowRenderer;
                    }
                    return cellProperties;
                },
                beforeChange: function () {
                    updateTable(table, container);
                },
                afterChange: function () {
                    updateTable(table, container);
                },
                afterCreateRow: function () {
                    updateTable(table, container);
                },
                afterCreateCol: function () {
                    updateTable(table, container);
                },
                afterRemoveRow: function () {
                    updateTable(table, container);
                },
                afterRemoveCol: function () {
                    updateTable(table, container);
                }
            });
        });

        //Track whether modal is visible
        var counter = 0;
        //Add modal box and ask user for input
        function addModal(rows, cols, name) {
            if (counter != 1) {
                var makeDiv = document.createElement('div');
                makeDiv.className = 'table-size';
                var overlayDiv = document.createElement('div');
                overlayDiv.className = 'table-size-overlay';
                overlayDiv.innerHTML += "<h2>Set Table Size</h2>";
                overlayDiv.innerHTML += "<label>Rows<input type='text' id='ht-rows' name='rows' value='0' maxlength='3'></label> x ";
                overlayDiv.innerHTML += "<label>Columns<input type='text' id='ht-cols' name='cols' value='0' maxlength='3'></label>";
                overlayDiv.innerHTML += "<a href='#close' class='btn table-size-close' data-action='closeModal'>Cancel</a>";
                overlayDiv.innerHTML += "<a href='#generate' class='btn table-size-generate' data-action='alterTable'>Generate</a>";
                makeDiv.appendChild(overlayDiv);
                jQuery(makeDiv).insertAfter('#' + name);
                counter++;

                if ((rows > 0) && (cols > 0)) {
                    document.getElementById('ht-rows').value = rows;
                    document.getElementById('ht-cols').value = cols;
                }
            }
        }

        function removeModal() {
            //Remove modal box
            if (counter == 1) {
                jQuery('div.table-size').remove();
                counter = 0;
            }
        }

        function setSize(ht, newRows, newCols, existingCols, existingRows) {
            //If the user pressed generate without changing any values, ignore
            if ((newRows == existingRows) && (newCols == existingCols)) {
                return true;
            }

            //See if rows or columns need to be inserted or removed
            var rowChange = (newRows > existingRows) ? 'insert_row' : 'remove_row';
            var colChange = (newCols > existingCols) ? 'insert_col' : 'remove_col';

            //Alter rows using the handsontable alter method
            if (Math.abs(newRows - existingRows)) {
                ht.alter(rowChange, null, Math.abs(newRows - existingRows));
            }
            //Alter columns using the handsontable alter method
            if (Math.abs(newCols - existingCols)) {
                ht.alter(colChange, null, Math.abs(newCols - existingCols));
            }
        }

        var actions = {
            addRow: function (event, ht) {
                ht.alter('insert_row');
            },
            addCol: function (event, ht) {
                ht.alter('insert_col');
            },
            showModal: function (event, ht, name) {
                var rows = ht.countRows(),
                    cols = ht.countCols();

                addModal(rows, cols, name);
            },
            closeModal: function () {
                removeModal();
            },
            alterTable: function (event, ht) {
                //Verify user input
                var newRows = document.getElementById('ht-rows').value,
                    newCols = document.getElementById('ht-cols').value;

                if ((isNaN(newRows)) || (isNaN(newCols)) || (newRows <= 0) || (newCols <= 0)) {
                    alert('Number of rows and columns must be a number greater than 0.');
                }
                else {
                    var existingRows = ht.countRows(),
                        existingCols = ht.countCols();

                    setSize(ht, newRows, newCols, existingCols, existingRows);
                    removeModal();
                }

            }
        };

        jQuery(document.body).unbind().delegate('div.handsontable-container a[data-action]', 'click', function (event) {
            var action = jQuery(this).data('action'),
                name = jQuery(this).parents('div.handsontable-container').find('div.handsontable').attr('id'),
                ht = jQuery('#' + name).handsontable('getInstance');

            event.preventDefault();

            // If there's an action with the given name, call it
            if (typeof actions[action] === 'function') {
                actions[action].call(this, event, ht, name);
            }
        });
    }
};