export default async function AgentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Agent</h1>
      <p className="text-sm text-muted-foreground">ID: {id}</p>
    </div>
  )
}
