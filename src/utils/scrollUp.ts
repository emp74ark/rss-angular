export function scrollUp({ trigger }: { trigger: boolean }) {
  if (!trigger) {
    return
  }
  const page = document.querySelector('.page-content')
  page?.scroll({ top: 0, behavior: 'smooth' })
}
