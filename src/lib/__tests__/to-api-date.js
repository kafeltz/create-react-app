import toApiDate from '../to-api-date.js'

test('must format the date correctly', () => {
    expect(toApiDate('31/01/2018 16:55')).toBe('2018-01-31 16:55:00')
    expect(toApiDate('00/00/0000 00:00')).toBe('0000-00-00 00:00:00')
})
