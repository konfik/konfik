import { compareAsc, format } from 'https://cdn.skypack.dev/date-fns'

const str = format(new Date(2014, 1, 11), 'yyyy-MM-dd')
console.log({ str })
