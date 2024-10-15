/* eslint-disable @typescript-eslint/no-explicit-any */

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
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
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./components/ui/chart"
import { ChartData, useDynamicBarChartData } from "./hook/useDynamicBar"
// Mock data - replace with actual data from your backend
const mockData = [
  { id: "145-5", name: "ADMINISTRACION EDUCATIVA", enrolled: 11 },
  { id: "145-9", name: "CIENCIAS DE LA EDUCACION", enrolled: 64 },
  { id: "145-A", name: "CIENCIAS DE LA EDUCACION", enrolled: 287 },
  { id: "145-B", name: "ADMINISTRACION EDUCATIVA", enrolled: 12 },
  { id: "145-E", name: "CIENCIAS DE LA EDUCACION", enrolled: 38 },
  { id: "145-N", name: "CIENCIAS DE LA EDUCACION", enrolled: 1325 },
  { id: "146-1", name: "CIENCIAS DE LA COMUNICACION", enrolled: 1255 },
  { id: "146-E", name: "CIENCIAS DE LA COMUNICACION", enrolled: 571 },
  { id: "147-2", name: "SOCIOLOGIA", enrolled: 267 },
  { id: "148-1", name: "PSICOLOGIA", enrolled: 1994 },
  { id: "149-1", name: "GESTION DEL TURISMO", enrolled: 768 },
  { id: "242-4", name: "LICENCIATURA EN INGLES", enrolled: 1 },
  { id: "242-7", name: "LENGUAS MODERNAS Y FILOLOGIA H", enrolled: 645 },
  { id: "242-8", name: "LENGUAS MODERNAS Y FILOLOGIA H", enrolled: 46 },
  { id: "242-9", name: "LENGUAS MODERNAS Y FILOLOGIA H", enrolled: 51 },
  { id: "405-1", name: "ACTIVIDAD FISICA", enrolled: 1 },
  { id: "405-2", name: "ACTIVIDAD FISICA", enrolled: 470 },
]

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export const description =
  "A products dashboard with a sidebar navigation and a main content area. The dashboard has a header with a search input and a user menu. The sidebar has a logo, navigation links, and a card with a call to action. The main content area shows an empty state with a call to action."

const formSchema = z.object({
  indicator: z.string({ required_error: 'El indicador es requerido' }),
  period: z.string(),
  modalidad: z.string(),
  locality: z.string(),
  faculty: z.string(),
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
      api: 'facaulties',
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

const chartConfig = {
  sum_t_inscritos: { label: "Total inscritos", color: "hsl(var(--chart-3))" },
  // Agrega más configuraciones según las necesidades
};

export function Dashboard() {
  const [filteredData] = useState(mockData)
  // const [modalidad, setModalidad] = useState("Todas")
  // const [facultad, setFacultad] = useState("08 HUMANIDADES")
  // const [periodo, setPeriodo] = useState("2020-1")
  // const [localidad, setLocalidad] = useState("Todas")
  const [indicator, setIndicator] = useState<IndicatorForm | null>(null)
  // const handleFilter = () => {
  //   // Implement actual filtering logic here
  //   // This is a placeholder that doesn't actually filter
  //   setFilteredData(mockData)
  // }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      indicator: "",
      period: "",
      modalidad: "",
      locality: "",
    }
  })


  const { allResource: facultades } = useGetAllResource({ endpoint: "faculties" })
  const { allResource: semesters } = useGetAllResource({ endpoint: "semesters" })
  const { allResource: localities } = useGetAllResource({ endpoint: "localities" })
  // const { allResource: careers } = useGetAllResource({ endpoint: "careers" })
  const { allResource: modes } = useGetAllResource({ endpoint: "modes" })
  const { filterOptions, queryParams, setFilterOptions } = useFilterData(filterStateDefault)
  const { createResource: GetIndicator, data: filterLocalities, isMutating } = useCreateResource({ endpoint: "filters/localities", isGet: true, query: queryParams })

  // const [graph, setGarph] = useState(null)

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log({ data, indicator, filterOptions, queryParams })
    if (indicator?.api === 'localities') {
      GetIndicator().then(res => console.log(res)).catch(console.log)
    }
  }

  const chartData = useDynamicBarChartData({
    rawData: filterLocalities as ChartData[] ?? [] as ChartData[],
    xKey: "localityName", // Esta clave cambiará dependiendo de los datos
    yKey: "sum_t_inscritos", // También cambiará según los datos
    // config: Array(filterLocalities).reduce((acc: ChartConfig, item: any, index: number) => {
    //   acc[item.localityName] = { label: 'Inscritos', color: COLORS[index % COLORS.length] }
    //   return acc
    // }, {})
    config: chartConfig
  });

  console.log(chartData)

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
                                  {dataMart?.find((item) => item.value === field.value)?.label}
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
                                      form.setValue('indicator', item.value)
                                      setIndicator(item.form)
                                      // setFilterOptions(filterStateDefault)
                                      setFilterOptions({ indicatorAttributes: item.form.indicators })
                                    }}
                                  >
                                    <CheckCheckIcon
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        item.value === field.value ? 'opacity-100' : 'opacity-0'
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

                  {indicator?.modalidad && <FormField
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
                              setFilterOptions({ ...filterOptions, modeName: value })
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

                  {indicator?.locality && <FormField
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
                              setFilterOptions({ ...filterOptions, localidadName: value })
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
                  {indicator?.period && <FormField
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
                              setFilterOptions({ ...filterOptions, semesterYear: value.split('-')[0], semesterPeriod: value.split('-')[1] })
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

                  {indicator?.faculty && <div className="col-span-2">
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
                                setFilterOptions({ ...filterOptions, facultyName: value })
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
                                          {dataMart?.find((item) => item.value === field.value)?.label}
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
                                              form.setValue('indicator', item.value)
                                              setIndicator(item.form)
                                              // setFilterOptions(filterStateDefault)
                                              setFilterOptions({ indicatorAttributes: item.form.indicators })
                                            }}
                                          >
                                            <CheckCheckIcon
                                              className={cn(
                                                'mr-2 h-4 w-4',
                                                item.value === field.value ? 'opacity-100' : 'opacity-0'
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

                          {indicator?.modalidad && <FormField
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
                                      setFilterOptions({ ...filterOptions, modeName: value })
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

                          {indicator?.locality && <FormField
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
                                      setFilterOptions({ ...filterOptions, localidadName: value })
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
                          {indicator?.period && <FormField
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
                                      setFilterOptions({ ...filterOptions, semesterYear: value.split('-')[0], semesterPeriod: value.split('-')[1] })
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

                          {indicator?.faculty && <div className="col-span-2">
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
                                        setFilterOptions({ ...filterOptions, facultyName: value })
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
                <DrawerFooter>
                  <Button>Filtrar</Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancelar</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </header>
        <CardHeader>
          <CardTitle>Estudiantes inscritos por carrera</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="bar" className="w-full">
            <TabsList>
              <TabsTrigger value="bar">Barras</TabsTrigger>
              <TabsTrigger value="bar2">Barras horiz</TabsTrigger>
            </TabsList>
            <TabsContent value="bar">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="id" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="enrolled" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="bar2">
              {!isMutating && (
                // <ResponsiveContainer width="100%" height={400}>
                <ChartContainer config={chartConfig}>
                  <BarChart
                    accessibilityLayer
                    data={chartData}
                    layout="vertical"
                    margin={{
                      left: 20,
                    }}
                  >
                    <YAxis
                      dataKey="localityName"
                      type="category"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value: keyof typeof chartConfig) => chartConfig[value]?.label || value}
                    />
                    <XAxis dataKey="sum_t_inscritos" type="number" hide />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="sum_t_inscritos" layout="vertical" radius={5} />
                  </BarChart>
                </ChartContainer>
                // </ResponsiveContainer>
              )}
            </TabsContent>

            {/* <TabsContent value="pie">
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={filteredData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="enrolled"
                  >
                    {filteredData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent> */}
          </Tabs>

          <ScrollArea className="h-[300px] mt-4">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Carrera</th>
                  <th className="px-4 py-2 text-left">Inscritos</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(filterLocalities) && filterLocalities.map((item: any) => (
                  <tr key={item.id}>
                    <td className="border px-4 py-2">{item.localityName}</td>
                    <td className="border px-4 py-2">{item.sum_t_inscritos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
        </CardContent>
      </main>
    </div>
  )
}
