const vDOM = function (document, window, undefined) {
  /**
   * vDOM
   * @param {[String|DomNode]}    selector    a selector string used to select a single element with `document.querySelector` or an element reference
   * @param {[Object]}            userOptions an object containing name/value pairs of options for the component initialization
   */
  function vDOM(selector, options) {
    // this is your 'root' element for the component
    this.el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    this.options = {}; // merge the passed in options object

    if (typeof Object.assign != 'function') {
      throw new Error('`Object.assign` not currently supported by this browser, perhaps you are missing the polyfill?');
    } else {
      // extend the options
      Object.assign(this.options, options);
    }

    this.init();
  }

  vDOM.prototype = {
    /**
     * Initialization of the component
     */
    init: function () {},
    // custom function to parse jsx to JS object
    h: function (type, attr) {
      const children = [];

      for (let param in arguments) {
        if (param > 1) {
          children.push(arguments[param]);
        }
      }

      return {
        type: type,
        attr: attr,
        children: children
      };
    },
    // create Element
    createElement: function (node) {
      if (typeof node === 'string') {
        return document.createTextNode(node);
      }

      const $element = document.createElement(node.type);
      this.addAttributes($element, node.attr);

      for (let child of node.children) {
        $element.appendChild(this.createElement(child));
      }

      return $element;
    },
    // add attributes
    addAttributes: function ($element, attributes) {
      for (let attr in attributes) {
        $element.setAttribute(attr, attributes[attr]);
      }
    },

    // render jsx to DOM tree
    render(jsx) {
      this.el.appendChild(this.createElement(jsx));
    },

    destroy: function () {
      // teardown code goes here
      return this;
    },

    /**
     * Wrapper method for dispatching events from this component.
     * Dependent on `polyfill_custom_event.js`
     *
     * @param  {String} name Name of the event to dispatch, this could be something like `event_name:component_name`
     * @param  {Object} data An object hash of data you want to pass to the event listeners
     */
    _dispatchEvent: function (name, data, el) {
      var el = typeof el !== 'undefined' ? el : this.el,
          // optional element to dispatch events from.  Default to `this.el` reference
      customEvent = new CustomEvent(name, {
        detail: data
      }); // dispatch the event

      el.dispatchEvent(customEvent);
    }
  };
  return vDOM;
}(document, window);

const $root = document.getElementById('root');
const dom = new vDOM($root);
/* @jsx dom.h */

const html = dom.h("div", null, dom.h("h1", null, "Hello World!"), dom.h("p", {
  class: "bold"
}, "This is my paragraph!"), dom.h("p", {
  class: "bold"
}, "This is my paragraph!"), dom.h("p", {
  class: "bold"
}, "This is my paragraph!"), dom.h("p", {
  class: "bold"
}, "This is my paragraph!"), dom.h("a", {
  href: "#"
}, "I am a link!"));
dom.render(html);
