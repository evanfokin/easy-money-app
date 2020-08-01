import numeral from 'numeral'

// @ts-ignore
numeral.localeData().delimiters.thousands = ' '

export function formatNumber(value: string | number) {
  return numeral(value).format('0,0')
}
