import React from 'react'
import renderer from 'react-test-renderer'

import PageDevice from '../page-device.js'

describe('render page-device correctly base on params', () => {
    it('renders scenario 1', () => {
        const params = {
            fetchOnInit: false,
        }

        const tree = renderer.create(<PageDevice {...params} />).toJSON()

        expect(tree).toMatchSnapshot()
    })

    it('renders scenario 2', () => {
        const params = {
            busy: false,
            fetchOnInit: false,
        }

        const tree = renderer.create(<PageDevice {...params} />).toJSON()

        expect(tree).toMatchSnapshot()
    })

    it('renders scenario 3', () => {
        const params = {
            devices: [{'address': 'http://0.0.0.0:8100'}],
            fetchOnInit: false,
            selectedIP: 'http://0.0.0.0:8100',
        }

        const tree = renderer.create(<PageDevice {...params} />).toJSON()

        expect(tree).toMatchSnapshot()
    })

    it('renders scenario 4', () => {
        const params = {
            address: [{'address': 'http://192.168.0.31:8100'}, {'address': 'http://0.0.0.0:8100'}],
            fetchOnInit: false,
            selectedIP: 'http://192.168.0.31:8100',
        }

        const tree = renderer.create(<PageDevice {...params} />).toJSON()

        expect(tree).toMatchSnapshot()
    })

    it('renders scenario 5', () => {
        const params = {
            address: [{'address': 'http://192.168.0.31:8100'}, {'address': 'http://0.0.0.0:8100'}],
            busy: true,
            fetchOnInit: false,
            selectedIP: 'http://0.0.0.0:8100',
        }

        const tree = renderer.create(<PageDevice {...params} />).toJSON()

        expect(tree).toMatchSnapshot()
    })
})

