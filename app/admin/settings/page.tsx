import { createClient } from '@/lib/supabase/server'
import SettingsForm from '@/components/admin/SettingsForm'

export default async function SettingsPage() {
  const supabase = await createClient()

  // Tüm ayarları getir
  const { data: settings } = await supabase
    .from('system_settings')
    .select('*')
    .order('key')

  // Ayarları daha kullanışlı bir formata dönüştür
  const settingsMap = (settings || []).reduce((acc: any, setting) => {
    acc[setting.key] = setting.value
    return acc
  }, {})

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Sistem Ayarları</h1>
        <p className="text-gray-400">
          Uygulamanızın genel ayarlarını buradan yönetebilirsiniz
        </p>
      </div>

      <SettingsForm initialSettings={settingsMap} />
    </div>
  )
}

