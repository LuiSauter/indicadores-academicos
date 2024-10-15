import { ApiResponse } from '@/hook/useApiResource'
import { ResponseError } from './response-error.utils'
import { FilterOptions } from '@/hook/useFilterData'

export const generateQueryParams = ({ indicatorAttributes, ...rest }: FilterOptions): string => {
  const queryParams = new URLSearchParams()

  indicatorAttributes.forEach((value) => {
    if (value) {
      queryParams.append('indicatorAttributes', value.toString())
    }
  })

  Object.entries(rest).forEach(([key, value]) => {
    if (value) {
      queryParams.append(key, value.toString())
    }
  })

  return queryParams.toString()
}

export const handleResponseErrors = async (response: Response) => {
  if (!response.ok) {
    const errorResponse: ApiResponse = await response.json()
    const error = new ResponseError('Ocurrio un error al realizar la solicitud', errorResponse)
    throw error
  }
}

export const fetchData = async (url: string, options?: RequestInit, typeBlob?: boolean) => {
  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...options?.headers,
    }
  }

  if (!options || (options && !(options.body instanceof FormData))) {
    requestOptions.headers = {
      ...requestOptions.headers,
      'Content-Type': 'application/json'
    }
  }

  const response = await fetch(url, requestOptions)
  await handleResponseErrors(response)
  return !typeBlob ? await response.json() : response
}

type QueryOptions = Record<string, string | number | undefined>

export const generateQueryParamsGeneric = (queryOption: QueryOptions): string => {
  const queryParams = new URLSearchParams()

  for (const key in queryOption) {
    if (queryOption[key] !== undefined) {
      queryParams.append(key, queryOption[key].toString())
    }
  }

  return queryParams.toString()
}

// Esto: 'extends Record<string, any>' indica que debe ser un objeto
export const convertObjectToFormData = (obj: Record<string, File | unknown>): FormData => {
  const formData = new FormData()

  for (const key in obj) {
    if (key in obj) {
      const value = obj[key]
      if (value !== undefined && value !== null) {
        if (value instanceof Array) {
          value.forEach((element) => {
            formData.append(`${key}[]`, element instanceof File ? element : String(element))
          })
        } else {
          formData.append(key, value instanceof File ? value : String(value))
        }
      }
    }
  }

  return formData
}
