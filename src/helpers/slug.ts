import slugify from 'slugify'

export function createUniqueProductSlug(productName: string, existingSlugs: string[]) {
  const cleanedName = productName.replace(/[^\w\s]/gi, '').toLowerCase()

  const baseSlug = slugify(cleanedName, { lower: true, strict: true })

  let uniqueSlug = baseSlug
  let counter = 1

  while (existingSlugs.includes(uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter}`
    counter++
  }

  return uniqueSlug
}
