import { REGEX_PHONE } from '../consts.js'

test('REGEX must work exactly as defined!', () => {
    expect( '(47) 98877-1122'.match(REGEX_PHONE) !== null ).toBe(true)

    expect( ''.match(REGEX_PHONE) !== null ).toBe(false)
    expect( '('.match(REGEX_PHONE) !== null ).toBe(false)
    expect( '(4'.match(REGEX_PHONE) !== null ).toBe(false)
    expect( '(47'.match(REGEX_PHONE) !== null ).toBe(false)
    expect( '(47)'.match(REGEX_PHONE) !== null ).toBe(false)
    expect( '(47) '.match(REGEX_PHONE) !== null ).toBe(false)
    expect( '(47) 9'.match(REGEX_PHONE) !== null ).toBe(false)
    expect( '(47) 98'.match(REGEX_PHONE) !== null ).toBe(false)
    expect( '(47) 988'.match(REGEX_PHONE) !== null ).toBe(false)
    expect( '(47) 9887'.match(REGEX_PHONE) !== null ).toBe(false)
    expect( '(47) 98877'.match(REGEX_PHONE) !== null ).toBe(false)
    expect( '(47) 98877-'.match(REGEX_PHONE) !== null ).toBe(false)
    expect( '(47) 98877-1'.match(REGEX_PHONE) !== null ).toBe(false)
    expect( '(47) 98877-11'.match(REGEX_PHONE) !== null ).toBe(false)
    expect( '(47) 98877-112'.match(REGEX_PHONE) !== null ).toBe(false)
    expect( ' (47) 98877-1122 '.match(REGEX_PHONE) !== null ).toBe(false)
})

