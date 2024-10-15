import { generateQueryParams } from '@/utils/fetch-data.utils'
import { useState } from 'react'

export interface FilterOptions {
  indicatorAttributes: string[]
  semesterYear?: string
  semesterPeriod?: string
  modeName?: string
  localidadName?: string
  facultyName?: string
}

export const filterStateDefault: FilterOptions = {
  indicatorAttributes: [''],
}

export const useFilterData = (filterState: FilterOptions) => {
  const [filterOptions, setFilterOptions] = useState(filterState)
  const queryParams = generateQueryParams(filterOptions)
  const search = (attr: string, value: string) => {
    const updatedFilterOptions = { ...filterStateDefault, attr, value }
    setFilterOptions(updatedFilterOptions)
  }

  return { queryParams, filterOptions, setFilterOptions, search }
}
