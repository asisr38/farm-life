import { notFound } from 'next/navigation'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  // Nepali is the only locale served under a prefix; any other first segment is a 404
  const { lang } = await params
  if (lang !== 'ne') notFound()

  return <>{children}</>
}
