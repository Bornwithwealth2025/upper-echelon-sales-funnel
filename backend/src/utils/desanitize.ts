export const desanitizeInput = (input: string) => {
  if (input == null) return '';

  return String(input)
    .replace(/&#36;/g, '$')
    .replace(/&#x60;/g, '`')
    .replace(/&#x2F;/g, '/')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&');
};



  