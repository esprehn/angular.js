/**
 * @workInProgress
 * @ngdoc overview
 * @name angular.widget
 * @description
 *
 * An angular widget can be either a custom attribute that modifies an existing DOM elements or an
 * entirely new DOM element.
 *
 * During html compilation, widgets are processed after {@link angular.markup markup}, but before
 * {@link angular.directive directives}.
 *
 * Following is the list of built-in angular widgets:
 *
 * * {@link angular.widget.@ng:format ng:format} - Formats data for display to user and for storage.
 * * {@link angular.widget.@ng:non-bindable ng:non-bindable} - Blocks angular from processing an
 *   HTML element.
 * * {@link angular.widget.@ng:repeat ng:repeat} - Creates and manages a collection of cloned HTML
 *   elements.
 * * {@link angular.widget.@ng:required ng:required} - Verifies presence of user input.
 * * {@link angular.widget.@ng:validate ng:validate} - Validates content of user input.
 * * {@link angular.widget.HTML HTML} - Standard HTML processed by angular.
 * * {@link angular.widget.ng:view ng:view} - Works with $route to "include" partial templates
 * * {@link angular.widget.ng:switch ng:switch} - Conditionally changes DOM structure
 * * {@link angular.widget.ng:include ng:include} - Includes an external HTML fragment
 *
 * For more information about angular widgets, see {@link guide/dev_guide.compiler.widgets
 * Understanding Angular Widgets} in the angular Developer Guide.
 */

/**
 * @workInProgress
 * @ngdoc widget
 * @name angular.widget.HTML
 *
 * @description
 * The most common widgets you will use will be in the form of the
 * standard HTML set. These widgets are bound using the `name` attribute
 * to an expression. In addition they can have `ng:validate`, `ng:required`,
 * `ng:format`, `ng:change` attribute to further control their behavior.
 *
 * @usageContent
 *   see example below for usage
 *
 *   <input type="text|checkbox|..." ... />
 *   <textarea ... />
 *   <select ...>
 *     <option>...</option>
 *   </select>
 *
 * @example
    <doc:example>
      <doc:source>
        <table style="font-size:.9em;">
          <tr>
            <th>Name</th>
            <th>Format</th>
            <th>HTML</th>
            <th>UI</th>
            <th ng:non-bindable>{{input#}}</th>
          </tr>
          <tr>
            <th>text</th>
            <td>String</td>
            <td><tt>&lt;input type="text" name="input1"&gt;</tt></td>
            <td><input type="text" name="input1" size="4"></td>
            <td><tt>{{input1|json}}</tt></td>
          </tr>
          <tr>
            <th>textarea</th>
            <td>String</td>
            <td><tt>&lt;textarea name="input2"&gt;&lt;/textarea&gt;</tt></td>
            <td><textarea name="input2" cols='6'></textarea></td>
            <td><tt>{{input2|json}}</tt></td>
          </tr>
          <tr>
            <th>radio</th>
            <td>String</td>
            <td><tt>
              &lt;input type="radio" name="input3" value="A"&gt;<br>
              &lt;input type="radio" name="input3" value="B"&gt;
            </tt></td>
            <td>
              <input type="radio" name="input3" value="A">
              <input type="radio" name="input3" value="B">
            </td>
            <td><tt>{{input3|json}}</tt></td>
          </tr>
          <tr>
            <th>checkbox</th>
            <td>Boolean</td>
            <td><tt>&lt;input type="checkbox" name="input4" value="checked"&gt;</tt></td>
            <td><input type="checkbox" name="input4" value="checked"></td>
            <td><tt>{{input4|json}}</tt></td>
          </tr>
          <tr>
            <th>pulldown</th>
            <td>String</td>
            <td><tt>
              &lt;select name="input5"&gt;<br>
              &nbsp;&nbsp;&lt;option value="c"&gt;C&lt;/option&gt;<br>
              &nbsp;&nbsp;&lt;option value="d"&gt;D&lt;/option&gt;<br>
              &lt;/select&gt;<br>
            </tt></td>
            <td>
              <select name="input5">
                <option value="c">C</option>
                <option value="d">D</option>
              </select>
            </td>
            <td><tt>{{input5|json}}</tt></td>
          </tr>
          <tr>
            <th>multiselect</th>
            <td>Array</td>
            <td><tt>
              &lt;select name="input6" multiple size="4"&gt;<br>
              &nbsp;&nbsp;&lt;option value="e"&gt;E&lt;/option&gt;<br>
              &nbsp;&nbsp;&lt;option value="f"&gt;F&lt;/option&gt;<br>
              &lt;/select&gt;<br>
            </tt></td>
            <td>
              <select name="input6" multiple size="4">
                <option value="e">E</option>
                <option value="f">F</option>
              </select>
            </td>
            <td><tt>{{input6|json}}</tt></td>
          </tr>
        </table>
      </doc:source>
      <doc:scenario>

        it('should exercise text', function(){
         input('input1').enter('Carlos');
         expect(binding('input1')).toEqual('"Carlos"');
        });
        it('should exercise textarea', function(){
         input('input2').enter('Carlos');
         expect(binding('input2')).toEqual('"Carlos"');
        });
        it('should exercise radio', function(){
         expect(binding('input3')).toEqual('null');
         input('input3').select('A');
         expect(binding('input3')).toEqual('"A"');
         input('input3').select('B');
         expect(binding('input3')).toEqual('"B"');
        });
        it('should exercise checkbox', function(){
         expect(binding('input4')).toEqual('false');
         input('input4').check();
         expect(binding('input4')).toEqual('true');
        });
        it('should exercise pulldown', function(){
         expect(binding('input5')).toEqual('"c"');
         select('input5').option('d');
         expect(binding('input5')).toEqual('"d"');
        });
        it('should exercise multiselect', function(){
         expect(binding('input6')).toEqual('[]');
         select('input6').options('e');
         expect(binding('input6')).toEqual('["e"]');
         select('input6').options('e', 'f');
         expect(binding('input6')).toEqual('["e","f"]');
        });
      </doc:scenario>
    </doc:example>
 */

function modelAccessor(scope, element) {
  var expr = element.attr('name');
  var exprFn, assignFn;
  if (expr) {
    exprFn = parser(expr).assignable();
    assignFn = exprFn.assign;
    if (!assignFn) throw new Error("Expression '" + expr + "' is not assignable.");
    return {
      get: function() {
        return exprFn(scope);
      },
      set: function(value) {
        if (value !== undefined) {
          return scope.$tryEval(function(){
            assignFn(scope, value);
          }, element);
        }
      }
    };
  }
}

function modelFormattedAccessor(scope, element) {
  var accessor = modelAccessor(scope, element),
      formatterName = element.attr('ng:format') || NOOP,
      formatter = compileFormatter(formatterName);
  if (accessor) {
    return {
      get: function() {
        return formatter.format(scope, accessor.get());
      },
      set: function(value) {
        return accessor.set(formatter.parse(scope, value));
      }
    };
  }
}

function compileValidator(expr) {
  return parser(expr).validator()();
}

function compileFormatter(expr) {
  return parser(expr).formatter()();
}

/**
 * @workInProgress
 * @ngdoc widget
 * @name angular.widget.@ng:validate
 *
 * @description
 * The `ng:validate` attribute widget validates the user input. If the input does not pass
 * validation, the `ng-validation-error` CSS class and the `ng:error` attribute are set on the input
 * element. Check out {@link angular.validator validators} to find out more.
 *
 * @param {string} validator The name of a built-in or custom {@link angular.validator validator} to
 *     to be used.
 *
 * @element INPUT
 * @css ng-validation-error
 *
 * @example
 * This example shows how the input element becomes red when it contains invalid input. Correct
 * the input to make the error disappear.
 *
    <doc:example>
      <doc:source>
        I don't validate:
        <input type="text" name="value" value="NotANumber"><br/>

        I need an integer or nothing:
        <input type="text" name="value" ng:validate="integer"><br/>
      </doc:source>
      <doc:scenario>
         it('should check ng:validate', function(){
           expect(element('.doc-example-live :input:last').attr('className')).
             toMatch(/ng-validation-error/);

           input('value').enter('123');
           expect(element('.doc-example-live :input:last').attr('className')).
             not().toMatch(/ng-validation-error/);
         });
      </doc:scenario>
    </doc:example>
 */
/**
 * @workInProgress
 * @ngdoc widget
 * @name angular.widget.@ng:required
 *
 * @description
 * The `ng:required` attribute widget validates that the user input is present. It is a special case
 * of the {@link angular.widget.@ng:validate ng:validate} attribute widget.
 *
 * @element INPUT
 * @css ng-validation-error
 *
 * @example
 * This example shows how the input element becomes red when it contains invalid input. Correct
 * the input to make the error disappear.
 *
    <doc:example>
      <doc:source>
        I cannot be blank: <input type="text" name="value" ng:required><br/>
      </doc:source>
      <doc:scenario>
       it('should check ng:required', function(){
         expect(element('.doc-example-live :input').attr('className')).toMatch(/ng-validation-error/);
         input('value').enter('123');
         expect(element('.doc-example-live :input').attr('className')).not().toMatch(/ng-validation-error/);
       });
      </doc:scenario>
    </doc:example>
 */
/**
 * @workInProgress
 * @ngdoc widget
 * @name angular.widget.@ng:format
 *
 * @description
 * The `ng:format` attribute widget formats stored data to user-readable text and parses the text
 * back to the stored form. You might find this useful for example if you collect user input in a
 * text field but need to store the data in the model as a list. Check out
 * {@link angular.formatter formatters} to learn more.
 *
 * @param {string} formatter The name of the built-in or custom {@link angular.formatter formatter}
 *     to be used.
 *
 * @element INPUT
 *
 * @example
 * This example shows how the user input is converted from a string and internally represented as an
 * array.
 *
    <doc:example>
      <doc:source>
        Enter a comma separated list of items:
        <input type="text" name="list" ng:format="list" value="table, chairs, plate">
        <pre>list={{list}}</pre>
      </doc:source>
      <doc:scenario>
       it('should check ng:format', function(){
         expect(binding('list')).toBe('list=["table","chairs","plate"]');
         input('list').enter(',,, a ,,,');
         expect(binding('list')).toBe('list=["a"]');
       });
      </doc:scenario>
    </doc:example>
 */
function valueAccessor(scope, element) {
  var validatorName = element.attr('ng:validate') || NOOP,
      validator = compileValidator(validatorName),
      requiredExpr = element.attr('ng:required'),
      formatterName = element.attr('ng:format') || NOOP,
      formatter = compileFormatter(formatterName),
      format, parse, lastError, required,
      invalidWidgets = scope.$service('$invalidWidgets') || {markValid:noop, markInvalid:noop};
  if (!validator) throw "Validator named '" + validatorName + "' not found.";
  format = formatter.format;
  parse = formatter.parse;
  if (requiredExpr) {
    scope.$watch(requiredExpr, function(newValue) {
      required = newValue;
      validate();
    });
  } else {
    required = requiredExpr === '';
  }

  element.data($$validate, validate);
  return {
    get: function(){
      if (lastError)
        elementError(element, NG_VALIDATION_ERROR, null);
      try {
        var value = parse(scope, element.val());
        validate();
        return value;
      } catch (e) {
        lastError = e;
        elementError(element, NG_VALIDATION_ERROR, e);
      }
    },
    set: function(value) {
      var oldValue = element.val(),
          newValue = format(scope, value);
      if (oldValue != newValue) {
        element.val(newValue || ''); // needed for ie
      }
      validate();
    }
  };

  function validate() {
    var value = trim(element.val());
    if (element[0].disabled || element[0].readOnly) {
      elementError(element, NG_VALIDATION_ERROR, null);
      invalidWidgets.markValid(element);
    } else {
      var error, validateScope = inherit(scope, {$element:element});
      error = required && !value
              ? 'Required'
              : (value ? validator(validateScope, value) : null);
      elementError(element, NG_VALIDATION_ERROR, error);
      lastError = error;
      if (error) {
        invalidWidgets.markInvalid(element);
      } else {
        invalidWidgets.markValid(element);
      }
    }
  }
}

function checkedAccessor(scope, element) {
  var domElement = element[0], elementValue = domElement.value;
  return {
    get: function(){
      return !!domElement.checked;
    },
    set: function(value){
      domElement.checked = toBoolean(value);
    }
  };
}

function radioAccessor(scope, element) {
  var domElement = element[0];
  return {
    get: function(){
      return domElement.checked ? domElement.value : null;
    },
    set: function(value){
      domElement.checked = value == domElement.value;
    }
  };
}

function optionsAccessor(scope, element) {
  var formatterName = element.attr('ng:format') || NOOP,
      formatter = compileFormatter(formatterName);
  return {
    get: function(){
      var values = [];
      forEach(element[0].options, function(option){
        if (option.selected) values.push(formatter.parse(scope, option.value));
      });
      return values;
    },
    set: function(values){
      var keys = {};
      forEach(values, function(value){
        keys[formatter.format(scope, value)] = true;
      });
      forEach(element[0].options, function(option){
        option.selected = keys[option.value];
      });
    }
  };
}

function noopAccessor() { return { get: noop, set: noop }; }

/*
 * TODO: refactor
 *
 * The table bellow is not quite right. In some cases the formatter is on the model side
 * and in some cases it is on the view side. This is a historical artifact
 *
 * The concept of model/view accessor is useful for anyone who is trying to develop UI, and
 * so it should be exposed to others. There should be a form object which keeps track of the
 * accessors and also acts as their factory. It should expose it as an object and allow
 * the validator to publish errors to it, so that the the error messages can be bound to it.
 *
 */
var textWidget = inputWidget('keydown change', modelAccessor, valueAccessor, initWidgetValue(), true),
    buttonWidget = inputWidget('click', noopAccessor, noopAccessor, noop),
    INPUT_TYPE = {
      'text':            textWidget,
      'textarea':        textWidget,
      'hidden':          textWidget,
      'password':        textWidget,
      'button':          buttonWidget,
      'submit':          buttonWidget,
      'reset':           buttonWidget,
      'image':           buttonWidget,
      'checkbox':        inputWidget('click', modelFormattedAccessor, checkedAccessor, initWidgetValue(false)),
      'radio':           inputWidget('click', modelFormattedAccessor, radioAccessor, radioInit),
      'select-one':      inputWidget('change', modelAccessor, valueAccessor, initWidgetValue(null)),
      'select-multiple': inputWidget('change', modelAccessor, optionsAccessor, initWidgetValue([]))
//      'file':            fileWidget???
    };


function initWidgetValue(initValue) {
  return function (model, view) {
    var value = view.get();
    if (!value && isDefined(initValue)) {
      value = copy(initValue);
    }
    if (isUndefined(model.get()) && isDefined(value)) {
      model.set(value);
    }
  };
}

function radioInit(model, view, element) {
 var modelValue = model.get(), viewValue = view.get(), input = element[0];
 input.checked = false;
 input.name = this.$id + '@' + input.name;
 if (isUndefined(modelValue)) {
   model.set(modelValue = null);
 }
 if (modelValue == null && viewValue !== null) {
   model.set(viewValue);
 }
 view.set(modelValue);
}

/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:change
 *
 * @description
 * The directive executes an expression whenever the input widget changes.
 *
 * @element INPUT
 * @param {expression} expression to execute.
 *
 * @example
 * @example
    <doc:example>
      <doc:source>
        <div ng:init="checkboxCount=0; textCount=0"></div>
        <input type="text" name="text" ng:change="textCount = 1 + textCount">
           changeCount {{textCount}}<br/>
        <input type="checkbox" name="checkbox" ng:change="checkboxCount = 1 + checkboxCount">
           changeCount {{checkboxCount}}<br/>
      </doc:source>
      <doc:scenario>
         it('should check ng:change', function(){
           expect(binding('textCount')).toBe('0');
           expect(binding('checkboxCount')).toBe('0');

           using('.doc-example-live').input('text').enter('abc');
           expect(binding('textCount')).toBe('1');
           expect(binding('checkboxCount')).toBe('0');


           using('.doc-example-live').input('checkbox').check();
           expect(binding('textCount')).toBe('1');
           expect(binding('checkboxCount')).toBe('1');
         });
      </doc:scenario>
    </doc:example>
 */
function inputWidget(events, modelAccessor, viewAccessor, initFn, textBox) {
  return annotate('$updateView', '$defer', function($updateView, $defer, element) {
    var scope = this,
        model = modelAccessor(scope, element),
        view = viewAccessor(scope, element),
        action = element.attr('ng:change') || '',
        lastValue;
    if (model) {
      initFn.call(scope, model, view, element);
      this.$eval(element.attr('ng:init')||'');
      element.bind(events, function(event){
        function handler(){
          var value = view.get();
          if (!textBox || value != lastValue) {
            model.set(value);
            lastValue = model.get();
            scope.$tryEval(action, element);
            $updateView();
          }
        }
        event.type == 'keydown' ? $defer(handler) : handler();
      });
      scope.$watch(model.get, function(value){
        if (lastValue !== value) {
          view.set(lastValue = value);
        }
      });
    }
  });
}

function inputWidgetSelector(element){
  this.directives(true);
  this.descend(true);
  return INPUT_TYPE[lowercase(element[0].type)] || noop;
}

angularWidget('input', inputWidgetSelector);
angularWidget('textarea', inputWidgetSelector);
angularWidget('button', inputWidgetSelector);

/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:options
 *
 * @description
 * Dynamically generate a list of `<option>` elements for a `<select>` element using the array
 * obtained by evaluating the `ng:options` expression.
 *
 * When an item in the select menu is select, the array element represented by the selected option
 * will be bound to the model identified by the `name` attribute of the parent select element.
 *
 * Optionally, a single hard-coded `<option>` element, with the value set to an empty string, can
 * be nested into the `<select>` element. This element will then represent `null` or "not selected"
 * option. See example below for demonstration.
 *
 * Note: `ng:options` provides iterator facility for `<option>` element which must be used instead
 * of {@link angular.widget.@ng:repeat ng:repeat}. `ng:repeat` is not suitable for use with
 * `<option>` element because of the following reasons:
 *
 *   * value attribute of the option element that we need to bind to requires a string, but the
 *     source of data for the iteration might be in a form of array containing objects instead of
 *     strings
 *   * {@link angular.widget.@ng:repeat ng:repeat} unrolls after the select binds causing
 *     incorect rendering on most browsers.
 *   * binding to a value not in list confuses most browsers.
 *
 * @element select
 * @param {comprehension_expression} comprehension _expresion_ `for` _item_ `in` _array_.
 *
 *   * _array_: an expression which evaluates to an array of objects to bind.
 *   * _item_: local variable which will refer to the item in the _array_ during the iteration
 *   * _expression_: The result of this expression will be `option` label. The
 *        `expression` most likely refers to the _item_ variable.
 *
 * @example
    <doc:example>
      <doc:source>
        <script>
        function MyCntrl(){
          this.colors = [
            {name:'black'},
            {name:'white'},
            {name:'red'},
            {name:'blue'},
            {name:'green'}
          ];
          this.color = this.colors[2]; // red
        }
        </script>
        <div ng:controller="MyCntrl">
          <ul>
            <li ng:repeat="color in colors">
              Name: <input name="color.name"/> [<a href ng:click="colors.$remove(color)">X</a>]
            </li>
            <li>
              [<a href ng:click="colors.push({})">add</a>]
            </li>
          </ul>
          <hr/>
          Color (null not allowed):
          <select name="color" ng:options="c.name for c in colors"></select><br/>

          Color (null allowed):
          <select name="color" ng:options="c.name for c in colors">
            <option value="">-- chose color --</option>
          </select><br/>

          Select <a href ng:click="color={name:'not in list'}">bogus</a>. <br/>
          <hr/>
          Currently selected: {{ {selected_color:color}  }}
          <div style="border:solid 1px black;"
               ng:style="{'background-color':color.name}">
             &nbsp;
          </div>
        </div>
      </doc:source>
      <doc:scenario>
         it('should check ng:options', function(){
           expect(binding('color')).toMatch('red');
           select('color').option('0');
           expect(binding('color')).toMatch('black');
           select('color').option('');
           expect(binding('color')).toMatch('null');
         });
      </doc:scenario>
    </doc:example>
 */

var NG_OPTIONS_REGEXP = /^(.*)\s+for\s+([\$\w][\$\w\d]*)\s+in\s+(.*)$/;
angularWidget('select', function(element){
  this.descend(true);
  this.directives(true);
  var isMultiselect = element.attr('multiple');
  var expression = element.attr('ng:options');
  var match;
  if (!expression) {
    return inputWidgetSelector.call(this, element);
  }
  if (! (match = expression.match(NG_OPTIONS_REGEXP))) {
    throw Error(
        "Expected ng:options in form of '_expresion_ for _item_ in _collection_' but got '" +
        expression + "'.");
  }
  var displayFn = expressionCompile(match[1]).fnSelf;
  var itemName = match[2];
  var collectionFn = expressionCompile(match[3]).fnSelf;
  // we can't just jqLite('<option>') since jqLite is not smart enough
  // to create it in <select> and IE barfs otherwise.
  var option = jqLite(document.createElement('option'));
  return function(select){
    var scope = this;
    var optionElements = [];
    var optionTexts = [];
    var lastSelectValue = isMultiselect ? {} : false;
    var nullOption = option.clone().val('');
    var missingOption = option.clone().val('?');
    var model = modelAccessor(scope, element);

    // find existing special options
    forEach(select.children(), function(option){
      if (option.value == '') nullOption = false;
    });

    select.bind('change', function(){
      var collection = collectionFn(scope) || [];
      var value = select.val();
      var index, length;
      if (isMultiselect) {
        value = [];
        for (index = 0, length = optionElements.length; index < length; index++) {
          if (optionElements[index][0].selected) {
            value.push(collection[index]);
          }
        }
      } else {
        if (value == '?') {
          value = undefined;
        } else {
          value = (value == '' ? null : collection[value]);
        }
      }
      if (!isUndefined(value)) model.set(value);
      scope.$tryEval(function(){
        scope.$root.$eval();
      });
    });

    scope.$onEval(function(){
      var scope = this;
      var collection = collectionFn(scope) || [];
      var value;
      var length;
      var fragment;
      var index;
      var optionText;
      var optionElement;
      var optionScope = scope.$new();
      var modelValue = model.get();
      var currentItem;
      var selectValue = '';
      var isMulti = isMultiselect;

      if (isMulti) {
        selectValue = new HashMap();
        if (modelValue && isNumber(length = modelValue.length)) {
          for (index = 0; index < length; index++) {
            selectValue.put(modelValue[index], true);
          }
        }
      }
      try {
        for (index = 0, length = collection.length; index < length; index++) {
          currentItem = optionScope[itemName] = collection[index];
          optionText = displayFn(optionScope);
          if (optionTexts.length > index) {
            // reuse
            optionElement = optionElements[index];
            if (optionText != optionTexts[index]) {
              (optionElement).text(optionTexts[index] = optionText);
            }
          } else {
            // grow
            if (!fragment) {
              fragment = document.createDocumentFragment();
            }
            optionTexts.push(optionText);
            optionElements.push(optionElement = option.clone());
            optionElement.attr('value', index).text(optionText);
            fragment.appendChild(optionElement[0]);
          }
          if (isMulti) {
            if (lastSelectValue[index] != (value = selectValue.remove(currentItem))) {
              optionElement[0].selected = !!(lastSelectValue[index] = value);
            }
          } else {
            if (modelValue == currentItem) {
              selectValue = index;
            }
          }
        }
        if (fragment) select.append(jqLite(fragment));
        // shrink children
        while(optionElements.length > index) {
          optionElements.pop().remove();
          delete lastSelectValue[optionElements.length];
        }

        if (!isMulti) {
          if (selectValue === '' && modelValue) {
            // We could not find a match
            selectValue = '?';
          }

          // update the selected item
          if (lastSelectValue !== selectValue) {
            if (nullOption) {
              if (lastSelectValue == '') nullOption.remove();
              if (selectValue === '') select.prepend(nullOption);
            }

            if (missingOption) {
              if (lastSelectValue == '?') missingOption.remove();
              if (selectValue === '?') select.prepend(missingOption);
            }

            select.val(lastSelectValue = selectValue);
          }
        }

      } finally {
        optionScope = null;
      }
    });
  };
});

/**
 * @workInProgress
 * @ngdoc widget
 * @name angular.widget.ng:include
 *
 * @description
 * Fetches, compiles and includes an external HTML fragment.
 *
 * Keep in mind that Same Origin Policy applies to included resources
 * (e.g. ng:include won't work for file:// access).
 *
 * @param {string} src angular expression evaluating to URL. If the source is a string constant,
 *                 make sure you wrap it in quotes, e.g. `src="'myPartialTemplate.html'"`.
 * @param {Scope=} [scope=new_child_scope] optional expression which evaluates to an
 *                 instance of angular.scope to set the HTML fragment to.
 * @param {string=} onload Expression to evaluate when a new partial is loaded.
 *
 * @example
    <doc:example>
      <doc:source>
       <select name="url">
        <option value="examples/ng-include/template1.html">template1.html</option>
        <option value="examples/ng-include/template2.html">template2.html</option>
        <option value="">(blank)</option>
       </select>
       url of the template: <tt><a href="{{url}}">{{url}}</a></tt>
       <hr/>
       <ng:include src="url"></ng:include>
      </doc:source>
      <doc:scenario>
        it('should load template1.html', function(){
         expect(element('.doc-example-live ng\\:include').text()).
           toBe('Content of template1.html\n');
        });
        it('should load template2.html', function(){
         select('url').option('examples/ng-include/template2.html');
         expect(element('.doc-example-live ng\\:include').text()).
           toBe('Content of template2.html\n');
        });
        it('should change to blank', function(){
         select('url').option('');
         expect(element('.doc-example-live ng\\:include').text()).toEqual('');
        });
      </doc:scenario>
    </doc:example>
 */
angularWidget('ng:include', function(element){
  var compiler = this,
      srcExp = element.attr("src"),
      scopeExp = element.attr("scope") || '',
      onloadExp = element[0].getAttribute('onload') || ''; //workaround for jquery bug #7537
  if (element[0]['ng:compiled']) {
    this.descend(true);
    this.directives(true);
  } else {
    element[0]['ng:compiled'] = true;
    return extend(function(xhr, element){
      var scope = this, childScope;
      var changeCounter = 0;
      var preventRecursion = false;
      function incrementChange(){ changeCounter++;}
      this.$watch(srcExp, incrementChange);
      this.$watch(scopeExp, incrementChange);

      // note that this propagates eval to the current childScope, where childScope is dynamically
      // bound (via $route.onChange callback) to the current scope created by $route
      scope.$onEval(function(){
        if (childScope && !preventRecursion) {
          preventRecursion = true;
          try {
            childScope.$eval();
          } finally {
            preventRecursion = false;
          }
        }
      });
      this.$watch(function(){return changeCounter;}, function(){
        var src = this.$eval(srcExp),
            useScope = this.$eval(scopeExp);

        if (src) {
          xhr('GET', src, null, function(code, response){
            element.html(response);
            childScope = useScope || createScope(scope);
            compiler.compile(element)(childScope);
            scope.$eval(onloadExp);
          }, false, true);
        } else {
          childScope = null;
          element.html('');
        }
      });
    }, {$inject:['$xhr.cache']});
  }
});

/**
 * @workInProgress
 * @ngdoc widget
 * @name angular.widget.ng:switch
 *
 * @description
 * Conditionally change the DOM structure.
 *
 * @usageContent
 * <any ng:switch-when="matchValue1">...</any>
 *   <any ng:switch-when="matchValue2">...</any>
 *   ...
 *   <any ng:switch-default>...</any>
 *
 * @param {*} on expression to match against <tt>ng:switch-when</tt>.
 * @paramDescription
 * On child elments add:
 *
 * * `ng:switch-when`: the case statement to match against. If match then this
 *   case will be displayed.
 * * `ng:switch-default`: the default case when no other casses match.
 *
 * @example
    <doc:example>
      <doc:source>
        <select name="switch">
          <option>settings</option>
          <option>home</option>
          <option>other</option>
        </select>
        <tt>switch={{switch}}</tt>
        </hr>
        <ng:switch on="switch" >
          <div ng:switch-when="settings">Settings Div</div>
          <span ng:switch-when="home">Home Span</span>
          <span ng:switch-default>default</span>
        </ng:switch>
        </code>
      </doc:source>
      <doc:scenario>
        it('should start in settings', function(){
         expect(element('.doc-example-live ng\\:switch').text()).toEqual('Settings Div');
        });
        it('should change to home', function(){
         select('switch').option('home');
         expect(element('.doc-example-live ng\\:switch').text()).toEqual('Home Span');
        });
        it('should select deafault', function(){
         select('switch').option('other');
         expect(element('.doc-example-live ng\\:switch').text()).toEqual('default');
        });
      </doc:scenario>
    </doc:example>
 */
//TODO(im): remove all the code related to using and inline equals
var ngSwitch = angularWidget('ng:switch', function (element){
  var compiler = this,
      watchExpr = element.attr("on"),
      usingExpr = (element.attr("using") || 'equals'),
      usingExprParams = usingExpr.split(":"),
      usingFn = ngSwitch[usingExprParams.shift()],
      changeExpr = element.attr('change') || '',
      cases = [];
  if (!usingFn) throw "Using expression '" + usingExpr + "' unknown.";
  if (!watchExpr) throw "Missing 'on' attribute.";
  eachNode(element, function(caseElement){
    var when = caseElement.attr('ng:switch-when');
    var switchCase = {
        change: changeExpr,
        element: caseElement,
        template: compiler.compile(caseElement)
      };
    if (isString(when)) {
      switchCase.when = function(scope, value){
        var args = [value, when];
        forEach(usingExprParams, function(arg){
          args.push(arg);
        });
        return usingFn.apply(scope, args);
      };
      cases.unshift(switchCase);
    } else if (isString(caseElement.attr('ng:switch-default'))) {
      switchCase.when = valueFn(true);
      cases.push(switchCase);
    }
  });

  // this needs to be here for IE
  forEach(cases, function(_case){
    _case.element.remove();
  });

  element.html('');
  return function(element){
    var scope = this, childScope;
    this.$watch(watchExpr, function(value){
      var found = false;
      element.html('');
      childScope = createScope(scope);
      forEach(cases, function(switchCase){
        if (!found && switchCase.when(childScope, value)) {
          found = true;
          childScope.$tryEval(switchCase.change, element);
          switchCase.template(childScope, function(caseElement){
            element.append(caseElement);
          });
        }
      });
    });
    scope.$onEval(function(){
      if (childScope) childScope.$eval();
    });
  };
}, {
  equals: function(on, when) {
    return ''+on == when;
  }
});


/*
 * Modifies the default behavior of html A tag, so that the default action is prevented when href
 * attribute is empty.
 *
 * The reasoning for this change is to allow easy creation of action links with ng:click without
 * changing the location or causing page reloads, e.g.:
 * <a href="" ng:click="model.$save()">Save</a>
 */
angularWidget('a', function() {
  this.descend(true);
  this.directives(true);

  return function(element) {
    var hasNgHref = ((element.attr('ng:bind-attr') || '').indexOf('"href":') !== -1);

    // turn <a href ng:click="..">link</a> into a link in IE
    // but only if it doesn't have name attribute, in which case it's an anchor
    if (!hasNgHref && !element.attr('name') && !element.attr('href')) {
      element.attr('href', '');
    }

    if (element.attr('href') === '' && !hasNgHref) {
      element.bind('click', function(event){
        event.preventDefault();
      });
    }
  };
});


/**
 * @workInProgress
 * @ngdoc widget
 * @name angular.widget.@ng:repeat
 *
 * @description
 * The `ng:repeat` widget instantiates a template once per item from a collection. The collection is
 * enumerated with the `ng:repeat-index` attribute, starting from 0. Each template instance gets
 * its own scope, where the given loop variable is set to the current collection item, and `$index`
 * is set to the item index or key.
 *
 * Special properties are exposed on the local scope of each template instance, including:
 *
 *   * `$index` – `{number}` – iterator offset of the repeated element (0..length-1)
 *   * `$position` – `{string}` – position of the repeated element in the iterator. One of:
 *        * `'first'`,
 *        * `'middle'`
 *        * `'last'`
 *
 * Note: Although `ng:repeat` looks like a directive, it is actually an attribute widget.
 *
 * @element ANY
 * @param {string} repeat_expression The expression indicating how to enumerate a collection. Two
 *   formats are currently supported:
 *
 *   * `variable in expression` – where variable is the user defined loop variable and `expression`
 *     is a scope expression giving the collection to enumerate.
 *
 *     For example: `track in cd.tracks`.
 *
 *   * `(key, value) in expression` – where `key` and `value` can be any user defined identifiers,
 *     and `expression` is the scope expression giving the collection to enumerate.
 *
 *     For example: `(name, age) in {'adam':10, 'amalie':12}`.
 *
 * @example
 * This example initializes the scope to a list of names and
 * then uses `ng:repeat` to display every person:
    <doc:example>
      <doc:source>
        <div ng:init="friends = [{name:'John', age:25}, {name:'Mary', age:28}]">
          I have {{friends.length}} friends. They are:
          <ul>
            <li ng:repeat="friend in friends">
              [{{$index + 1}}] {{friend.name}} who is {{friend.age}} years old.
            </li>
          </ul>
        </div>
      </doc:source>
      <doc:scenario>
         it('should check ng:repeat', function(){
           var r = using('.doc-example-live').repeater('ul li');
           expect(r.count()).toBe(2);
           expect(r.row(0)).toEqual(["1","John","25"]);
           expect(r.row(1)).toEqual(["2","Mary","28"]);
         });
      </doc:scenario>
    </doc:example>
 */
angularWidget('@ng:repeat', function(expression, element){
  element.removeAttr('ng:repeat');
  element.replaceWith(jqLite('<!-- ng:repeat: ' + expression + ' -->'));
  var linker = this.compile(element);
  return function(iterStartElement){
    var match = expression.match(/^\s*(.+)\s+in\s+(.*)\s*$/),
        lhs, rhs, valueIdent, keyIdent;
    if (! match) {
      throw Error("Expected ng:repeat in form of '_item_ in _collection_' but got '" +
      expression + "'.");
    }
    lhs = match[1];
    rhs = match[2];
    match = lhs.match(/^([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\)$/);
    if (!match) {
      throw Error("'item' in 'item in collection' should be identifier or (key, value) but got '" +
      keyValue + "'.");
    }
    valueIdent = match[3] || match[1];
    keyIdent = match[2];

    var children = [], currentScope = this;
    this.$onEval(function(){
      var index = 0,
          childCount = children.length,
          lastIterElement = iterStartElement,
          collection = this.$tryEval(rhs, iterStartElement),
          collectionLength = size(collection, true),
          fragment = (element[0].nodeName != 'OPTION') ? document.createDocumentFragment() : null,
          addFragment,
          childScope,
          key;

      for (key in collection) {
        if (collection.hasOwnProperty(key)) {
          if (index < childCount) {
            // reuse existing child
            childScope = children[index];
            childScope[valueIdent] = collection[key];
            if (keyIdent) childScope[keyIdent] = key;
            lastIterElement = childScope.$element;
            childScope.$position = index == 0
                ? 'first'
                : (index == collectionLength - 1 ? 'last' : 'middle');
            childScope.$eval();
          } else {
            // grow children
            childScope = createScope(currentScope);
            childScope[valueIdent] = collection[key];
            if (keyIdent) childScope[keyIdent] = key;
            childScope.$index = index;
            childScope.$position = index == 0
                ? 'first'
                : (index == collectionLength - 1 ? 'last' : 'middle');
            children.push(childScope);
            linker(childScope, function(clone){
              clone.attr('ng:repeat-index', index);

              if (fragment) {
                fragment.appendChild(clone[0]);
                addFragment = true;
              } else {
                //temporarily preserve old way for option element
                lastIterElement.after(clone);
                lastIterElement = clone;
              }
            });
          }
          index ++;
        }
      }

      //attach new nodes buffered in doc fragment
      if (addFragment) {
        lastIterElement.after(jqLite(fragment));
      }

      // shrink children
      while(children.length > index) {
        children.pop().$element.remove();
      }
    }, iterStartElement);
  };
});


/**
 * @workInProgress
 * @ngdoc widget
 * @name angular.widget.@ng:non-bindable
 *
 * @description
 * Sometimes it is necessary to write code which looks like bindings but which should be left alone
 * by angular. Use `ng:non-bindable` to make angular ignore a chunk of HTML.
 *
 * NOTE: `ng:non-bindable` looks like a directive, but is actually an attribute widget.
 *
 * @element ANY
 *
 * @example
 * In this example there are two location where a siple binding (`{{}}`) is present, but the one
 * wrapped in `ng:non-bindable` is left alone.
 *
 * @example
    <doc:example>
      <doc:source>
        <div>Normal: {{1 + 2}}</div>
        <div ng:non-bindable>Ignored: {{1 + 2}}</div>
      </doc:source>
      <doc:scenario>
       it('should check ng:non-bindable', function(){
         expect(using('.doc-example-live').binding('1 + 2')).toBe('3');
         expect(using('.doc-example-live').element('div:last').text()).
           toMatch(/1 \+ 2/);
       });
      </doc:scenario>
    </doc:example>
 */
angularWidget("@ng:non-bindable", noop);


/**
 * @ngdoc widget
 * @name angular.widget.ng:view
 *
 * @description
 * # Overview
 * `ng:view` is a widget that complements the {@link angular.service.$route $route} service by
 * including the rendered template of the current route into the main layout (`index.html`) file.
 * Every time the current route changes, the included view changes with it according to the
 * configuration of the `$route` service.
 *
 * This widget provides functionality similar to {@link angular.widget.ng:include ng:include} when
 * used like this:
 *
 *     <ng:include src="$route.current.template" scope="$route.current.scope"></ng:include>
 *
 *
 * # Advantages
 * Compared to `ng:include`, `ng:view` offers these advantages:
 *
 * - shorter syntax
 * - more efficient execution
 * - doesn't require `$route` service to be available on the root scope
 *
 *
 * @example
    <doc:example>
      <doc:source>
         <script>
           function MyCtrl($route) {
             $route.when('/overview', {controller: OverviewCtrl, template: 'guide.overview.html'});
             $route.when('/bootstrap', {controller: BootstrapCtrl, template: 'guide.bootstrap.html'});
             console.log(window.$route = $route);
           };
           MyCtrl.$inject = ['$route'];

           function BootstrapCtrl(){}
           function OverviewCtrl(){}
         </script>
         <div ng:controller="MyCtrl">
           <a href="#/overview">overview</a> | <a href="#/bootstrap">bootstrap</a> | <a href="#/undefined">undefined</a><br/>
           The view is included below:
           <hr/>
           <ng:view></ng:view>
         </div>
      </doc:source>
      <doc:scenario>
      </doc:scenario>
    </doc:example>
 */
angularWidget('ng:view', function(element) {
  var compiler = this;

  if (!element[0]['ng:compiled']) {
    element[0]['ng:compiled'] = true;
    return annotate('$xhr.cache', '$route', function($xhr, $route, element){
      var parentScope = this,
          childScope;

      $route.onChange(function(){
        var src;

        if ($route.current) {
          src = $route.current.template;
          childScope = $route.current.scope;
        }

        if (src) {
          //xhr's callback must be async, see commit history for more info
          $xhr('GET', src, function(code, response){
            element.html(response);
            compiler.compile(element)(childScope);
          });
        } else {
          element.html('');
        }
      })(); //initialize the state forcefully, it's possible that we missed the initial
            //$route#onChange already

      // note that this propagates eval to the current childScope, where childScope is dynamically
      // bound (via $route.onChange callback) to the current scope created by $route
      parentScope.$onEval(function() {
        if (childScope) {
          childScope.$eval();
        }
      });
    });
  } else {
    this.descend(true);
    this.directives(true);
  }
});
