export function buildGoogleFeedURL(parts,sheet) {
  return 'https://spreadsheets.google.com/feeds/list/' + parts + '/'+sheet+'/public/values?alt=json'
}