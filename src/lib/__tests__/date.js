import { toDate, toIsoDate } from '../date.js'

test('must format the date correctly', () => {
    expect(toDate('2018-01-31T19:00:00.000Z')).toBe('31/01/2018 17:00')
    expect(toDate('2018-08-15T19:44:08.56421957Z')).toBe('15/08/2018 16:44')
})

test('must format the date-iso correctly', () => {
    expect(toIsoDate('30/01/2018 16:00')).toBe('2018-01-30T18:00:00.000Z')
})

