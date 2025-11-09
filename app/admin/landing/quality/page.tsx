import { createClient } from '@/lib/supabase/server'
import QualityEditor from '@/components/admin/QualityEditor'

export default async function QualityPage() {
  const supabase = await createClient()
  
  const { data: enData } = await supabase
    .from('landing_content')
    .select('content')
    .eq('section', 'quality')
    .eq('language', 'en')
    .single()

  const { data: trData } = await supabase
    .from('landing_content')
    .select('content')
    .eq('section', 'quality')
    .eq('language', 'tr')
    .single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Quality Gallery Yönetimi</h1>
        <p className="mt-2 text-sm text-white/60">
          Landing page'deki kalite örnek görsellerini düzenleyin
        </p>
      </div>

      <QualityEditor 
        enContent={enData?.content as any} 
        trContent={trData?.content as any} 
      />
    </div>
  )
}

