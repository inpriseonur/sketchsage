import { createClient } from '@/lib/supabase/server'
import FAQEditor from '@/components/admin/FAQEditor'

export default async function FAQPage() {
  const supabase = await createClient()
  
  const { data: enData } = await supabase
    .from('landing_content')
    .select('content')
    .eq('section', 'faq')
    .eq('language', 'en')
    .single()

  const { data: trData } = await supabase
    .from('landing_content')
    .select('content')
    .eq('section', 'faq')
    .eq('language', 'tr')
    .single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">FAQ Yönetimi</h1>
        <p className="mt-2 text-sm text-white/60">
          Sıkça sorulan soruları düzenleyin
        </p>
      </div>

      <FAQEditor 
        enContent={enData?.content as any} 
        trContent={trData?.content as any} 
      />
    </div>
  )
}

