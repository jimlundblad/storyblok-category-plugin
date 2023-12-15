import { render, screen } from '@testing-library/react'
// import userEvent from '@testing-library/user-event'
import { describe, test, expect } from 'vitest'
import SelectCategories from './'

describe('SelectCategories', () => {
  test('should render the component', () => {
    render(<SelectCategories />)
    const label = screen.getByText('Select categories')
    expect(label).toBeInTheDocument()
  })  
})
