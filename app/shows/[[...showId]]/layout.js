import ScrollToTop from "@/app/scroll-to-top"

export default function ShowLayout({ children }) {
  return (
    <>
    {/* scrolls to the top when opening a modal, since its recalling the url, change later */}
      <ScrollToTop />
      {children}
    </>
  )
}