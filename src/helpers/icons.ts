import * as icons from 'ionicons/icons'
import _pickBy from 'lodash/pickBy'

export class Icons {
  static all = icons
  static common = _pickBy(icons, (value, key) => !key.match(/outline/i) && !key.match(/sharp/i))
  static outline = _pickBy(icons, (value, key) => key.match(/outline/i))
  static sharp = _pickBy(icons, (value, key) => key.match(/sharp/i))
}
