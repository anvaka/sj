/**
 * This module implements bindings for svg
 */
module.exports = {
  'item-template': require('./lib/itemTemplate'),
  'items-source': require('./lib/itemsSource'),
  '*' : require('./lib/defaultDataBinder') 
};
