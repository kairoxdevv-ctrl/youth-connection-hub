import AreaClient from './AreaClient'
import { getAreaIds } from '@/lib/dataStatic'

export function generateStaticParams() {
  return getAreaIds().map(id => ({ id }))
}

export default function AreaPage({ params }: { params: { id: string } }) {
  return <AreaClient areaId={params.id} />
}
