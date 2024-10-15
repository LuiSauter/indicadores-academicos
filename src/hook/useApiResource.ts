import useSWRMutation from 'swr/mutation'
import useSWR from 'swr'
import { type ResponseError } from '@/utils/response-error.utils'
import { createResource, createResourceWithImage, deleteResource, getAllResource, getResource, updateResource } from '@/services/crud.service'
import { buildUrl } from '@/utils/api.utils'
// import { filterStateDefault, useFilterData } from './useFilterData'
export interface ApiResponse<T = unknown> {
  statusCode?: number
  message?: string | string[]
  error?: string
  data?: T
  countData?: number
}

interface ParamResurce {
  endpoint: string
  id?: string
  query?: string
  isImage?: boolean
  isGet?: boolean
}

const useCreateResource = <TData>({ endpoint, query, isImage, isGet }: ParamResurce) => {
  const url = buildUrl({ endpoint, query })
  const { trigger, isMutating, error, data } = useSWRMutation<unknown, ResponseError, string, TData>(
    url, isGet ? getResource : isImage ? createResourceWithImage : createResource
  )
  return { createResource: trigger, isMutating, error, data }
}

const useGetResource = <TData>({ endpoint, id, query }: ParamResurce) => {
  const url = buildUrl({ endpoint, id, query })
  const { data, isLoading, error, isValidating } = useSWR<TData, ResponseError>(url, getResource)
  return { resource: data, isLoading, error, isValidating }
}

const useGetAllResource = <T>({ endpoint }: ParamResurce) => {
  // const { filterOptions, queryParams, search, setFilterOptions } = useFilterData(filterStateDefault)
  const url = buildUrl({ endpoint })
  const { data, error, isLoading, mutate } = useSWR<ApiResponse, ResponseError>(url, getAllResource)
  return { allResource: data?.data as T[], countData: data?.countData ?? 0, error, isLoading, mutate }
}

const useUpdateResource = <TData>(endpoint: string, id?: string) => {
  const url = buildUrl({ endpoint, id })
  const { trigger, isMutating, error } =
    useSWRMutation<Promise<void>, ResponseError, string, TData>(url, updateResource)
  return { updateResource: trigger, isMutating, error }
}

const useDeleteResource = (endpoint: string) => {
  const url = buildUrl({ endpoint })
  const { trigger, error, isMutating } =
    useSWRMutation<Promise<void>, ResponseError, string, string>(url, deleteResource)
  return { deleteResource: trigger, error, isMutating }
}

export { useCreateResource, useGetAllResource, useGetResource, useUpdateResource, useDeleteResource }
