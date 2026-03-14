import { createClient } from '@/utils/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('test_table')
    .select()

  if (error) {
    console.error(error)
    return <div>something went wrong, check terminal</div>
  }

  return (
    <div>
      {data.map((row) => (
        <p key={row.id}>{row.message}</p>
      ))}
    </div>
  )
}