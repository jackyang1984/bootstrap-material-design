import BaseInput from './baseInput'
import Checkbox from './checkbox'
import Radio from './radio'
import Switch from './switch'
import TextInput from './textInput'
import Util from './util'

// FileInput decorator, to be called after Input
const FileInput = (($) => {

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  const NAME = 'fileInput'
  const DATA_KEY = `mdb.${NAME}`
  const JQUERY_NO_CONFLICT = $.fn[NAME]

  const Default = {
    formGroup: {
      autoCreate: true
    },
    invalidComponentMatches: [Checkbox, Radio, Switch, TextInput]
  }

  const ClassName = {
    IS_FILEINPUT: 'is-fileinput'
  }

  const Selector = {
    FILENAMES: 'input.form-control[readonly]'
  }

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */
  class FileInput extends BaseInput {

    constructor(element, config) {
      super(element, Default, config)

      this.$formGroup.addClass(ClassName.IS_FILEINPUT)
    }

    dispose() {
      super.dispose(DATA_KEY)
    }

    static matches($element) {
      if ($element.attr('type') === 'file') {
        return true
      }
      return false
    }

    static rejectMatch(component, $element) {
      Util.assert(this.matches($element), `${component} component is invalid for type='file'.`)
    }

    // ------------------------------------------------------------------------
    // protected

    rejectWithoutRequiredStructure() {
      // FIXME: implement this once we determine how we want to implement files since BS4 has tried to take a shot at this
    }

    addFocusListener() {
      this.$formGroup
        .on('focus', () => {
          this.addFormGroupFocus()
        })
        .on('blur', () => {
          this.removeFormGroupFocus()
        })
    }

    addChangeListener() {
      // set the fileinput readonly field with the name of the file
      this.$element.on('change', () => {
        let value = ''
        $.each(this.$element.files, (i, file) => {
          value += `${file.name}  , `
        })
        value = value.substring(0, value.length - 2)
        if (value) {
          this.removeIsEmpty()
        } else {
          this.addIsEmpty()
        }
        this.$formGroup.find(Selector.FILENAMES).val(value)
      })
    }

    // ------------------------------------------------------------------------
    // private

    // ------------------------------------------------------------------------
    // static
    static _jQueryInterface(config) {
      return this.each(function () {
        let $element = $(this)
        let data = $element.data(DATA_KEY)

        if (!data) {
          data = new FileInput(this, config)
          $element.data(DATA_KEY, data)
        }
      })
    }
  }

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */
  $.fn[NAME] = FileInput._jQueryInterface
  $.fn[NAME].Constructor = FileInput
  $.fn[NAME].noConflict = () => {
    $.fn[NAME] = JQUERY_NO_CONFLICT
    return FileInput._jQueryInterface
  }

  return FileInput

})(jQuery)

export default FileInput
