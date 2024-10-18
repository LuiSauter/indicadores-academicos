/* eslint-disable @typescript-eslint/no-explicit-any */

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { ChartNoAxesCombined, CheckCheckIcon, ChevronsUpDownIcon, Filter } from 'lucide-react'
import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "./components/ui/button"

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./components/ui/form"
import { useForm } from "react-hook-form"
import { Popover, PopoverContent, PopoverTrigger } from "./components/ui/popover"
import { cn } from "./lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./components/ui/command"
import { useCreateResource, useGetAllResource } from "./hook/useApiResource"
import { filterStateDefault, useFilterData } from "./hook/useFilterData"
import { ChartConfig } from "./components/ui/chart"
import { BarChartComponent } from "./BarChart"
import { MultipleBarChartComponent } from "./MultipleBarChart"
import { MixedBarChartComponent } from "./MixedBarChart"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

// export const description =
//   "A products dashboard with a sidebar navigation and a main content area. The dashboard has a header with a search input and a user menu. The sidebar has a logo, navigation links, and a card with a call to action. The main content area shows an empty state with a call to action."

const formSchema = z.object({
  indicator: z.string({ required_error: 'El indicador es requerido' }),
  period: z.string({ required_error: 'El periodo es requerido' }),
  modalidad: z.string({ required_error: 'La modalidad es requerida' }),
  locality: z.string({ required_error: 'La localidad es requerida' }),
  faculty: z.string({ required_error: 'La facultad es requerida' }),
})

interface IndicatorForm {
  period: boolean
  locality: boolean
  faculty: boolean
  modalidad: boolean
  career: boolean
  indicators: string[]
  api: string
}

interface Indicator {
  id: string
  value: string
  label: string
  form: IndicatorForm,
}

const dataMart: Indicator[] = [
  {
    id: "0",
    value: "estudiantes inscritos por localidad",
    label: "Estudiantes inscritos por localidad",
    form: {
      period: true,
      locality: false,
      faculty: true,
      modalidad: false,
      career: false,
      indicators: ['t_inscritos'],
      api: 'localities'
    },
  },
  {
    id: "2",
    value: "estudiantes nuevos inscritos por carrera",
    label: "Estudiantes Nuevos inscritos por carrera",
    form: {
      period: true,
      locality: true,
      faculty: true,
      modalidad: false,
      career: false,
      indicators: ['t_nuevos'],
      api: 'careers'
    }
  },
  {
    id: "3",
    value: "estudiantes inscritos por facultad",
    label: "Estudiantes inscritos por facultad",
    form: {
      period: true,
      faculty: false,
      locality: false,
      modalidad: false,
      career: false,
      indicators: ['t_inscritos'],
      api: 'faculties'
    }
  },
  {
    id: "5",
    value: "estudiantes inscritos por carrera",
    label: "Estudiantes inscritos por carrera",
    form: {
      period: true,
      faculty: true,
      locality: true,
      modalidad: true,
      career: false,
      indicators: ['t_inscritos'],
      api: 'careers',
    }
  },
  {
    id: "6",
    value: "estudiantes inscritos por modalidad",
    label: "Estudiantes inscritos por modalidad",
    form: {
      period: true,
      faculty: false,
      locality: false,
      modalidad: false,
      career: false,
      indicators: ['t_inscritos'],
      api: 'modes',
    }
  },
  {
    id: "7",
    value: "cantidad de estudiantes titulados por periodo",
    label: "cantidad de estudiantes titulados por periodo",
    form: {
      period: false,
      faculty: false,
      locality: false,
      modalidad: false,
      career: false,
      indicators: ['titulados'],
      api: 'semesters',
    }
  },
  {
    id: "8",
    value: "cantidad de estudiantes titulados por facultad",
    label: "Cantidad de estudiantes titulados por facultad",
    form: {
      period: true,
      faculty: false,
      locality: false,
      modalidad: false,
      career: false,
      indicators: ['titulados'],
      api: 'faculties',
    }
  },
  {
    id: "9",
    value: "cantidad de estudiantes egresados por periodo",
    label: "Cantidad de estudiantes egresados por periodo",
    form: {
      period: false,
      faculty: true,
      locality: true,
      modalidad: true,
      career: true,
      indicators: ['egresados'],
      api: 'semesters',
    }
  },
  {
    id: "10",
    value: "cantidad de estudiantes egresados por facultad",
    label: "Cantidad de estudiantes egresados por facultad",
    form: {
      period: true,
      faculty: false,
      locality: false,
      modalidad: false,
      career: false,
      indicators: ['egresados'],
      api: 'faculties',
    }
  },
  {
    id: "11",
    value: "comparacion de ingresos vs titulados por periodo",
    label: "Comparacion de ingresos vs titulados por periodo",
    form: {
      period: false,
      faculty: true,
      locality: true,
      modalidad: true,
      career: true,
      indicators: ['titulados', 't_nuevos'],
      api: 'semesters',
    }
  },
  {
    id: "12",
    value: "comparacion de ingresos vs titulados por facultad",
    label: "Comparacion de ingresos vs titulados por facultad",
    form: {
      period: true,
      faculty: false,
      locality: false,
      modalidad: false,
      career: false,
      indicators: ['titulados', 't_nuevos'],
      api: 'faculties',
    }
  },
  {
    id: "13",
    value: "porcentaje de deserción por carrera",
    label: "Porcentaje de deserción por carrera",
    form: {
      period: false,
      faculty: false,
      locality: false,
      modalidad: false,
      career: false,
      indicators: ['reprobados_con_0_percent'],
      api: 'careers',
    }
  },
  {
    id: "14",
    value: "porcentaje de deserción por facultad",
    label: "Porcentaje de deserción por facultad",
    form: {
      period: false,
      faculty: false,
      locality: false,
      modalidad: false,
      career: false,
      indicators: ['reprobados_con_0_percent'],
      api: 'faculties',
    }
  },
  {
    id: "15",
    value: "Rendimiento académico por periodo",
    label: "Rendimiento académico por periodo",
    form: {
      period: false,
      faculty: false,
      locality: false,
      modalidad: false,
      career: false,
      indicators: ['sin_nota_percent', 'aprobados_percent', 'reprobados_percent', 'moras_percent'],
      api: 'semesters',
    }
  },
  {
    id: "16",
    value: "Rendimiento académico por facultad",
    label: "Rendimiento académico por facultad",
    form: {
      period: true,
      faculty: false,
      locality: false,
      modalidad: false,
      career: false,
      indicators: ['sin_nota_percent', 'aprobados_percent', 'reprobados_percent', 'moras_percent'],
      api: 'faculties',
    }
  },
  {
    id: "17",
    value: "Promedio ponderado semestral (PPS) por periodo",
    label: "Promedio ponderado semestral (PPS) por periodo",
    form: {
      period: false,
      faculty: false,
      locality: false,
      modalidad: false,
      career: false,
      indicators: ['pps'],
      api: 'semesters',
    }
  },
  {
    id: "18",
    value: "promedio ponderado semestral (PPS) por facultad",
    label: "Promedio ponderado semestral (PPS) por facultad",
    form: {
      period: true,
      faculty: false,
      locality: false,
      modalidad: false,
      career: false,
      indicators: ['pps'],
      api: 'faculties',
    }
  },
  {
    id: "19",
    value: "promedio ponderado acumulado de la carrera (PPAC) por periodo",
    label: "Promedio ponderado acumulado de la carrera (PPAC) por periodo",
    form: {
      period: false,
      faculty: false,
      locality: false,
      modalidad: false,
      career: false,
      indicators: ['ppac'],
      api: 'semesters',
    }
  },
  {
    id: "20",
    value: "promedio ponderado acumulado de la carrera (PPAC) por facultad",
    label: "Promedio ponderado acumulado de la carrera (PPAC) por facultad",
    form: {
      period: true,
      faculty: false,
      locality: false,
      modalidad: false,
      career: false,
      indicators: ['ppac'],
      api: 'faculties',
    }
  },
  {
    id: "21",
    value: "promedio ponderado acumulado sin cero de la carrera (PPAC) por periodo",
    label: "Promedio ponderado acumulado sin cero de la carrera (PPAC) por periodo",
    form: {
      period: false,
      faculty: false,
      locality: false,
      modalidad: false,
      career: false,
      indicators: ['ppa1'],
      api: 'semesters',
    }
  },
  {
    id: "22",
    value: "promedio ponderado acumulado sin cero de la carrera (PPAC) por facultad",
    label: "Promedio ponderado acumulado sin cero de la carrera (PPAC) por facultad",
    form: {
      period: true,
      faculty: false,
      locality: false,
      modalidad: false,
      career: false,
      indicators: ['ppa1'],
      api: 'faculties',
    }
  }
]

interface DynamicTableProps<T> {
  data: T[];
}

const DynamicTable = <T extends Record<string, any>>({ data }: DynamicTableProps<T>) => {
  if (data.length === 0) {
    return <p>No hay datos disponibles</p>;
  }

  // const headers = Object.keys(data[0]);
  const headers = ["Etiquetas de la fila", ...data[0].values.map((item: any) => item.label)]
  const bodyData = [
    ...data.map((item: any) => {
      return {
        "Etiquetas de la fila": item.label,
        ...item.values.reduce((acc: any, item: any) => {
          acc[item.label] = item.value
          return acc
        }, {})
      }
    })
  ]
  return (
    <table style={{ width: '100%' }}>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header} className="border px-4 py-2 text-left">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {bodyData.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {headers.map((header) => (
              <td key={header} className="border px-4 py-2">{row[header]}</td>
            ))}
          </tr>
        ))}
        {/* agrega una fila para el total */}
        <tr>
          <td className="border px-4 py-2 font-bold">Total</td>
          {headers.slice(1).map((header) => (
            <td key={header} className="border px-4 py-2 font-bold">
              {
                bodyData.reduce((acc, item) => {
                  acc += Number(item[header])
                  return acc
                }
                  , 0)
              }
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

export function Dashboard() {
  const [indicator, setIndicator] = useState<IndicatorForm | null>(null)
  const [title, setTitle] = useState('Estudiantes inscritos por...')
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      indicator: "",
      period: "",
      modalidad: "",
      locality: "",
    }
  })
  // const { allResource: careers } = useGetAllResource({ endpoint: "careers" })


  const { allResource: facultades, isLoading: isLoadingFaculties } = useGetAllResource({ endpoint: "faculties" })
  const { allResource: semesters, isLoading: isLoadingSemesters } = useGetAllResource({ endpoint: "semesters" })
  const { allResource: localities, isLoading: isLoadingLocalities } = useGetAllResource({ endpoint: "localities" })
  const { allResource: modes, isLoading: isLoadingModes } = useGetAllResource({ endpoint: "modes" })
  const { filterOptions, queryParams, setFilterOptions } = useFilterData(filterStateDefault)

  const { createResource: GetLocalities, isMutating: isMutatingLocalities } = useCreateResource({ endpoint: "filters/localities", isGet: true, query: queryParams })
  const { createResource: GetFaculties, isMutating: isMutatingFaculties } = useCreateResource({ endpoint: "filters/faculties", isGet: true, query: queryParams })
  const { createResource: GetCareers, isMutating: isMutatingCareers } = useCreateResource({ endpoint: "filters/careers", isGet: true, query: queryParams })
  const { createResource: GetModes, isMutating: isMutatingModes } = useCreateResource({ endpoint: "filters/modes", isGet: true, query: queryParams })
  const { createResource: GetSemesters, isMutating: isMutatingSemesters } = useCreateResource({ endpoint: "filters/semesters", isGet: true, query: queryParams })

  const [chartState, setChartState] = useState<{ label: string; values: { label: string; value: number }[] }[]>([])

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data)
    if (indicator?.api === 'localities') {
      GetLocalities().then(res => setChartState(res)).catch(console.log)
    } else if (indicator?.api === 'faculties') {
      GetFaculties().then(res => setChartState(res)).catch(console.log)
    } else if (indicator?.api === 'semesters') {
      GetSemesters().then(res => setChartState(res)).catch(console.log)
    } else if (indicator?.api === 'modes') {
      GetModes().then(res => setChartState(res)).catch(console.log)
    } else if (indicator?.api === 'careers') {
      GetCareers().then(res => setChartState(res)).catch(console.log)
    }
  }

  console.log(chartState.length > 0 && chartState[0].values.map((item: any) => item.label))

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[300px_1fr] lg:grid-cols-[390px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2 sticky top-0">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <ChartNoAxesCombined className="h-6 w-6" />
              <h1 className="">Indicadores académicos</h1>
            </Link>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-full flex flex-col gap-4 ">
                <FormField
                  control={form.control}
                  name="indicator"
                  defaultValue={""}
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-between space-y-1 pt-1">
                      <FormLabel className='leading-normal'>Selecciona un indicador *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                'justify-between font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value
                                ? (<span className='text-ellipsis whitespace-nowrap overflow-hidden'>
                                  {dataMart?.find((item) => item.label === field.value)?.label}
                                </span>)
                                : <span className='text-light-text-secondary dark:text-dark-text-secondary text-ellipsis whitespace-nowrap overflow-hidden'>Seleccionar un indicador</span>}
                              <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                          <Command>
                            <CommandInput placeholder="Seleccionar sucursal" />
                            <CommandList>
                              <CommandEmpty>Indicador no encontrado</CommandEmpty>
                              <CommandGroup>
                                {dataMart?.map((item) => (
                                  <CommandItem
                                    value={item.value}
                                    key={item.id}
                                    onSelect={() => {
                                      form.setValue('indicator', item.label)
                                      form.setValue('faculty', '')
                                      form.setValue('locality', '')
                                      form.setValue('modalidad', '')
                                      form.setValue('period', '')
                                      setIndicator(item.form)
                                      setTitle(item.label)
                                      setFilterOptions({ indicatorAttributes: item.form.indicators })

                                    }}
                                  >
                                    <CheckCheckIcon
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        item.label === field.value ? 'opacity-100' : 'opacity-0'
                                      )}
                                    />
                                    {item.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                  {indicator?.modalidad && !isLoadingModes && <FormField
                    control={form.control}
                    name="modalidad"
                    defaultValue={""}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selecciona una modalidad</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value)
                              setFilterOptions({ ...filterOptions, modeName: value === 'todos' ? '' : value })
                            }}
                            value={field.value}
                            name={field.name}
                            disabled={field.disabled}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger aria-label="Selecciona la modalidad">
                                <SelectValue placeholder="Modalidad" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="todos">Todos</SelectItem>
                              {modes.map((item: any) => (
                                <SelectItem key={item.id} value={item.name}>{String(item.name)}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />}

                  {indicator?.locality && !isLoadingLocalities && <FormField
                    control={form.control}
                    name="locality"
                    defaultValue={""}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selecciona una localidad</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value)
                              setFilterOptions({ ...filterOptions, localidadName: value === 'todos' ? '' : value })
                            }}
                            value={field.value}
                            name={field.name}
                            disabled={field.disabled}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger aria-label="Selecciona una localidad">
                                <SelectValue placeholder="Localidad" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="todos">Todos</SelectItem>
                              {localities.map((item: any) => (
                                <SelectItem key={item.id} value={item.name}>{String(item.name)}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />}
                  {indicator?.period && !isLoadingSemesters && <FormField
                    control={form.control}
                    name="period"
                    defaultValue={""}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selecciona un periodo</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value)
                              setFilterOptions({ ...filterOptions, semesterYear: value === 'todos' ? '' : value.split('-')[0], semesterPeriod: value === 'todos' ? '' : value.split('-')[1] })
                            }}
                            value={field.value}
                            name={field.name}
                            disabled={field.disabled}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger aria-label="Selecciona un periodo">
                                <SelectValue placeholder="Periodo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="todos">Todos</SelectItem>
                              {semesters.map((item: any) => (
                                <SelectItem key={item.id} value={`${item.year}-${item.period}`}>{item.year}-{item.period}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />}

                  {indicator?.faculty && !isLoadingFaculties && <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="faculty"
                      defaultValue={""}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Selecciona la facultad</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value)
                                setFilterOptions({ ...filterOptions, facultyName: value === 'todos' ? '' : value })
                              }}
                              value={field.value}
                              name={field.name}
                              disabled={field.disabled}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger aria-label="Selecciona una facultad">
                                  <SelectValue placeholder="Facultad" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="todos">Todos</SelectItem>
                                {facultades.map((item: any) => (
                                  <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /></div>}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                >
                  Filtrar
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto">
        <header className="m-0 p-0 md:hidden">
          <Drawer>
            <DrawerTrigger asChild className="mt-4 mx-4">
              <Button variant="ghost" size='icon'>
                <Filter />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="">
              <div className="">
                <DrawerHeader>
                  <DrawerTitle>
                    <div className="flex items-center gap-2 font-semibold">
                      <ChartNoAxesCombined className="h-6 w-6" />
                      <h1 className="text-center">Indicadores académicos</h1>
                    </div>
                  </DrawerTitle>
                </DrawerHeader>
                <div className="p-4 pb-0">
                  <div className="flex-1 p-4">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-full flex flex-col gap-4 ">
                        <FormField
                          control={form.control}
                          name="indicator"
                          defaultValue={""}
                          render={({ field }) => (
                            <FormItem className="flex flex-col justify-between space-y-1 pt-1">
                              <FormLabel className='leading-normal'>Selecciona un indicador *</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      className={cn(
                                        'justify-between font-normal',
                                        !field.value && 'text-muted-foreground'
                                      )}
                                    >
                                      {field.value
                                        ? (<span className='text-ellipsis whitespace-nowrap overflow-hidden'>
                                          {dataMart?.find((item) => item.label === field.value)?.label}
                                        </span>)
                                        : <span className='text-light-text-secondary dark:text-dark-text-secondary text-ellipsis whitespace-nowrap overflow-hidden'>Seleccionar un indicador</span>}
                                      <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="p-0">
                                  <Command>
                                    <CommandInput placeholder="Seleccionar sucursal" />
                                    <CommandList>
                                      <CommandEmpty>Indicador no encontrado</CommandEmpty>
                                      <CommandGroup>
                                        {dataMart?.map((item) => (
                                          <CommandItem
                                            value={item.value}
                                            key={item.id}
                                            onSelect={() => {
                                              form.setValue('indicator', item.label)
                                              form.setValue('faculty', '')
                                              form.setValue('locality', '')
                                              form.setValue('modalidad', '')
                                              form.setValue('period', '')
                                              setIndicator(item.form)
                                              setTitle(item.label)
                                              setFilterOptions({ indicatorAttributes: item.form.indicators })

                                            }}
                                          >
                                            <CheckCheckIcon
                                              className={cn(
                                                'mr-2 h-4 w-4',
                                                item.label === field.value ? 'opacity-100' : 'opacity-0'
                                              )}
                                            />
                                            {item.label}
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                          {indicator?.modalidad && !isLoadingModes && <FormField
                            control={form.control}
                            name="modalidad"
                            defaultValue={""}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Selecciona una modalidad</FormLabel>
                                <FormControl>
                                  <Select
                                    onValueChange={(value) => {
                                      field.onChange(value)
                                      setFilterOptions({ ...filterOptions, modeName: value === 'todos' ? '' : value })
                                    }}
                                    value={field.value}
                                    name={field.name}
                                    disabled={field.disabled}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger aria-label="Selecciona la modalidad">
                                        <SelectValue placeholder="Modalidad" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="todos">Todos</SelectItem>
                                      {modes.map((item: any) => (
                                        <SelectItem key={item.id} value={item.name}>{String(item.name)}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />}

                          {indicator?.locality && !isLoadingLocalities && <FormField
                            control={form.control}
                            name="locality"
                            defaultValue={""}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Selecciona una localidad</FormLabel>
                                <FormControl>
                                  <Select
                                    onValueChange={(value) => {
                                      field.onChange(value)
                                      setFilterOptions({ ...filterOptions, localidadName: value === 'todos' ? '' : value })
                                    }}
                                    value={field.value}
                                    name={field.name}
                                    disabled={field.disabled}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger aria-label="Selecciona una localidad">
                                        <SelectValue placeholder="Localidad" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="todos">Todos</SelectItem>
                                      {localities.map((item: any) => (
                                        <SelectItem key={item.id} value={item.name}>{String(item.name)}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />}
                          {indicator?.period && !isLoadingSemesters && <FormField
                            control={form.control}
                            name="period"
                            defaultValue={""}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Selecciona un periodo</FormLabel>
                                <FormControl>
                                  <Select
                                    onValueChange={(value) => {
                                      field.onChange(value)
                                      setFilterOptions({ ...filterOptions, semesterYear: value === 'todos' ? '' : value.split('-')[0], semesterPeriod: value === 'todos' ? '' : value.split('-')[1] })
                                    }}
                                    value={field.value}
                                    name={field.name}
                                    disabled={field.disabled}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger aria-label="Selecciona un periodo">
                                        <SelectValue placeholder="Periodo" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="todos">Todos</SelectItem>
                                      {semesters.map((item: any) => (
                                        <SelectItem key={item.id} value={`${item.year}-${item.period}`}>{item.year}-{item.period}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />}

                          {indicator?.faculty && !isLoadingFaculties && <div className="col-span-2">
                            <FormField
                              control={form.control}
                              name="faculty"
                              defaultValue={""}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Selecciona la facultad</FormLabel>
                                  <FormControl>
                                    <Select
                                      onValueChange={(value) => {
                                        field.onChange(value)
                                        setFilterOptions({ ...filterOptions, facultyName: value === 'todos' ? '' : value })
                                      }}
                                      value={field.value}
                                      name={field.name}
                                      disabled={field.disabled}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger aria-label="Selecciona una facultad">
                                          <SelectValue placeholder="Facultad" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="todos">Todos</SelectItem>
                                        {facultades.map((item: any) => (
                                          <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            /></div>}
                        </div>
                        <DrawerFooter>
                          <DrawerClose asChild type="button">
                            <Button
                              type="submit"
                              className="w-full"
                            >
                              Filtrar
                            </Button>
                          </DrawerClose>
                          {/* <Button>Filtrar</Button> */}
                          <DrawerClose asChild type="button">
                            <Button variant="outline" type="button">Cancelar</Button>
                          </DrawerClose>
                        </DrawerFooter>
                      </form>
                    </Form>
                  </div>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </header>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {(isMutatingCareers || isMutatingFaculties || isMutatingLocalities || isMutatingModes || isMutatingSemesters) ? <span>Obteniendo datos del servidor, espere un momento...</span> :
            <>
              {indicator?.indicators.length === 1 && <Tabs defaultValue="bar" className="w-full">
                <TabsList>
                  {indicator?.indicators.length === 1 && (
                    <>
                      <TabsTrigger value="bar">Barras</TabsTrigger>
                      <TabsTrigger value="bar2">Barras horizontal</TabsTrigger>
                    </>
                  )}
                  {/* {(indicator?.indicators?.length ?? 0) > 1 && <TabsTrigger value="Multiple-bar">Barras Multiples</TabsTrigger>} */}
                </TabsList>

                <TabsContent value="bar">
                  <BarChartComponent
                    data={
                      indicator?.indicators.length === 1 && chartState.length > 0 ? chartState
                        .sort((a: any, b: any) => Number(b.values[0].value) - Number(a.values[0].value))
                        .map((item: any) => (
                          { label: item.label, [item.values[0].label]: Number(item.values[0].value) }
                        )) : []
                    }
                    title="Bar Chart - Label"
                    description="January - June 2024"
                    dataKey={
                      indicator?.indicators.length === 1 && chartState.length > 0 ? chartState[0].values[0].label : ''
                    }
                    labelKey="label"
                  />
                </TabsContent>

                <TabsContent value="bar2">
                  {indicator?.indicators.length === 1 && chartState && <MixedBarChartComponent
                    title="Bar Chart - Mixed"
                    description="January - June 2024"
                    data={
                      chartState && chartState
                        .sort((a: any, b: any) => Number(b.values[0].value) - Number(a.values[0].value))
                        .map((item: any) => (
                          { label: item.label, visitors: Number(item.values[0].value), fill: 'var(--color-default)' }
                        ))
                    }
                    dataKey='visitors'
                    chartConfig={{ visitors: { label: indicator?.indicators.length === 1 && chartState.length > 0 ? chartState[0].values[0].label : '', color: "#8884D8" } }}
                    labelKey="label"
                  />}
                </TabsContent>

                {/* <TabsContent value="Multiple-bar"> */}
                {/* </TabsContent> */}
              </Tabs>}
              {(indicator?.indicators ?? []).length > 1 && <MultipleBarChartComponent
                title="Bar Chart - Multiple"
                description="January - June 2024"
                data={
                  chartState && chartState
                    .map((item: any) => ({
                      label: item.label,
                      ...item.values.reduce((acc: any, item: any) => {
                        acc[item.label] = Number(item.value)
                        return acc
                      }, {})
                      // desktop: Number(item.values[0].value),
                      // mobile: Number(item.values[1].value)
                    }))
                }
                chartConfig={
                  chartState.length > 0 ? chartState[0].values.reduce((acc: any, item: any, index: number) => {
                    acc[item.label] = { label: item.label, color: COLORS[index] }
                    return acc
                  }, {}) : {} as ChartConfig
                }
                dataKeys={chartState.length > 0 ? chartState[0].values.map((item) => item.label) : ['']} // Claves de los diferentes conjuntos de barras
                labelKey="label"
              />}

              <ScrollArea className="h-full mt-4">
                {<DynamicTable data={Array.isArray(chartState) ? chartState : []} />}
                {/* {!isMutatingCareers && <DynamicTable data={Array.isArray(filterCareers) ? filterCareers : []} />} */}
              </ScrollArea>
            </>}
        </CardContent>
      </main>
    </div>
  )
}
