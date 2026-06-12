import { supabase } from '../lib/supabase'

export default async function DealsPage() {
  const { data: deals } = await supabase
    .from('deals')
    .select(`
      *,
      providers ( name ),
      categories ( name ),
      deal_tags ( tag )
    `)
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-[#1A9E6E] text-white py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Latest Deals</h1>
        <p className="text-xl">Australia&apos;s best mobile &amp; internet deals</p>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <div className="grid gap-4">
          {deals?.map((deal) => (
            <div key={deal.id} className="bg-white rounded-xl shadow p-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{deal.title}</h3>
                <p className="text-gray-500">{deal.providers?.name} &middot; {deal.categories?.name}</p>
                <p className="text-gray-600 mt-1">{deal.description}</p>
                {deal.deal_tags?.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {deal.deal_tags.map((t: {tag: string}) => (
                      <span key={t.tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{t.tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-right ml-4 shrink-0">
                <p className="text-2xl font-bold text-[#1A9E6E]">{deal.price_label}</p>
                {deal.is_featured && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Featured</span>}
                <a href={deal.deal_url} target="_blank" className="mt-2 inline-block bg-[#1A9E6E] text-white px-4 py-2 rounded-lg text-sm">View Deal</a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
