import { Link } from 'react-router-dom'

// One element for a CMS-editable button destination (Rule 16). Internal paths
// ("/booking") render as an in-app <Link>; external / mailto / tel render as a
// plain <a>. Route every button's link through here so a client can point it
// anywhere from the CMS "… Link" field without breaking navigation.
export default function SmartLink({ to, children, ...props }) {
  const dest = (to || '').trim() || '#'
  const isHttp = /^https?:/i.test(dest)
  const external = isHttp || /^(mailto:|tel:)/i.test(dest)
  if (external) {
    return (
      <a href={dest} target={isHttp ? '_blank' : undefined} rel={isHttp ? 'noopener noreferrer' : undefined} {...props}>
        {children}
      </a>
    )
  }
  return <Link to={dest} {...props}>{children}</Link>
}
